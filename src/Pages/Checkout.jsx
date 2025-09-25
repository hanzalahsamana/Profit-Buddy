"use client";
import { useState, useEffect } from "react";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { createSubscription } from "../Apis/Subscription";
import { formatDate, formatYear } from "../Utils/GraphUtils";
import { useNavigate } from "react-router-dom";
import { SUBSCRIPTION_PLANS_DATA } from "../Enums/Enums";
import { getUserDetail } from "../Apis/User";
import { setUser } from "../Redux/Slices/UserSlice";
import { useDispatch } from "react-redux";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) return toast.error(`Payment failed: ${error.message}`);

      if (paymentIntent?.status === "succeeded") {
        const data = await getUserDetail();
        if (data?.user) {
          dispatch(setUser({
            ...data.user,
            currentSubscription: {
              ...(data.user?.currentSubscription ?? {}),
              status: "active",
            },
          }));
          toast.success("Payment successful!");
          navigate("/");
        } else {
          toast.error("Failed to update user info.");
        }
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement className="mb-6" />
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full py-3 bg-black cursor-pointer text-white text-lg font-semibold rounded-md disabled:bg-backgroundC"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(window.location.search);
  const planName = searchParams.get("planName");

  useEffect(() => {
    if (!planName || !SUBSCRIPTION_PLANS_DATA?.[planName]) {
      navigate("/plans", { replace: true });
      return;
    }

    const fetchClientSecret = async () => {
      try {
        const response = await createSubscription({ planName });
        setSummary(response?.summary)
        if (response?.clientSecret) setClientSecret(response.clientSecret);
        else toast.error("Failed to initialize payment.");
      } catch (err) {
        const message = err.response ? err.response.data.message : err.message
        toast.error(message);
      }
    };
    fetchClientSecret();
  }, []);

  if (!clientSecret) return (
    <div className="flex flex-col items-center justify-center mt-12 h-screen">
      <div className="w-16 h-16 border-4 border-t-secondary border-border rounded-full animate-spin"></div>
      <p className="mt-4 text-lText text-lg font-medium">Preparing your checkout...</p>
    </div>
  );

  console.log(clientSecret);


  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      }}

    >
      <div className="bg-lBackground min-h-screen flex justify-center items-start py-12 px-6 gap-8">
        <div className="flex gap-10 w-full max-w-[1000px]">
          {/* Order Summary */}
          <div className="w-full p-6 bg-white border border-border rounded-lg flex flex-col gap-4 h-max">
            <h2 className="text-[30px] font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium text-gray-900">{summary.planName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-gray-900">{summary.currency.toUpperCase()} {summary.amount.toFixed(2)}</span>
            </div>

            {summary.description && (
              <div className="flex justify-between">
                <span className="text-gray-600">Description:</span>
                <span className="font-medium text-gray-900">{summary.description}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium text-gray-900">{formatDate(summary.startDate)}, {formatYear(summary.startDate)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">End Date:</span>
              <span className="font-medium text-gray-900">{formatDate(summary.endDate)}, {formatYear(summary.endDate)}</span>
            </div>
          </div>

          <div className="w-full max-w-[600px] p-4 bg-white rounded-lg border border-border">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default Checkout;
