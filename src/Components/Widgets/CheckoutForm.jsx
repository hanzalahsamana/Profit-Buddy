"use client";
import { useState, useEffect } from "react";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { createSubscription } from "../../Apis/Subscription";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentFormInner = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href, // stays on same page
        },
      });

      if (error) toast.error(error.message);
      else if (paymentIntent?.status === "succeeded") toast.success("Payment successful!");
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
        className="w-full py-3 bg-black text-white text-lg font-semibold rounded-md disabled:bg-backgroundC"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const PaymentForm = () => {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await createSubscription({ planName: "business_month" });
        if (response?.clientSecret) setClientSecret(response.clientSecret);
        else toast.error("Failed to initialize payment.");
      } catch (err) {
        toast.error("Could not fetch payment details.");
      }
    };
    fetchClientSecret();
  }, []);

  if (!clientSecret) return <p className="text-center mt-6">Loading payment form...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="bg-backgroundC flex justify-center items-center">
        <div className="w-full max-w-[600px] p-8 bg-white ">
          <PaymentFormInner clientSecret={clientSecret}  />
        </div>
      </div>
    </Elements>
  );
};

export default PaymentForm;
