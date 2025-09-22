// PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ customerId, priceId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMsg("");

    try {
      // 1️⃣ Get card details from CardElement
      const cardElement = elements.getElement(CardElement);
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name: "Customer Name" }, // Replace with real user name
      });

      if (pmError) {
        setErrorMsg(pmError.message);
        setLoading(false);
        return;
      }

      // 2️⃣ Call backend to create subscription with paymentMethod.id
      const res = await fetch("http://localhost:2000/api/v1/post/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          priceId,
          paymentMethodId: paymentMethod.id
        }),
      });

      const data = await res.json();
      if (data.error) {
        setErrorMsg(data.error.message);
        setLoading(false);
        return;
      }

      const clientSecret = data.clientSecret;

      // 3️⃣ Confirm payment on client
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);
      if (confirmError) {
        setErrorMsg(confirmError.message);
      } else if (paymentIntent.status === "succeeded") {
        setSuccess(true);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }

    setLoading(false);
  };

  if (success) {
    return <p>✅ Subscription active! Payment succeeded.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Subscribe"}
      </button>
      {errorMsg && <div style={{ color: "red" }}>{errorMsg}</div>}
    </form>
  );
}

export default function PaymentPage() {
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    // 1️⃣ Create a Stripe Customer
    const createCustomer = async () => {
      const res = await fetch("http://localhost:2000/api/v1/post/create-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "customer@example.com", name: "John Doe" }),
      });
      const data = await res.json();
      setCustomerId(data.customerId);
    };
    createCustomer();
  }, []);

  // 2️⃣ Use actual Price IDs from Stripe dashboard
  const BASIC_MONTHLY_PRICE_ID = "price_1S7tu6Q2jkTuccFDPE9f4OOJ";

  return (
    <Elements stripe={stripePromise}>
      {customerId ? (
        <CheckoutForm customerId={customerId} priceId={BASIC_MONTHLY_PRICE_ID} />
      ) : (
        <p>Loading customer...</p>
      )}
    </Elements>
  );
}
