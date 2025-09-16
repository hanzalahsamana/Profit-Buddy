import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { EndPoints } from "../../Utils/EndPoints";
import BASE_URL from "../../../config";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ priceId, email }) {
    
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        const createSubscription = async () => {
            // Create PaymentIntent on backend
            const res = await fetch(`${BASE_URL}/${EndPoints.createSubscription}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId, email, paymentMethodId: "pm_card_visa" }), // Test card
            });
            const data = await res.json();
            setClientSecret(data.clientSecret);
        };
        createSubscription();
    }, [priceId, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: `${window.location.origin}/success` },
        });

        if (error) alert(error.message);
    };

    if (!clientSecret) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl">
            <PaymentElement />
            <button type="submit" disabled={!stripe} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg w-full">
                Subscribedd
            </button>
        </form>
    );
}

export default function PaymentPage() {
    const [priceId, setPriceId] = useState("price_1S7tu6Q2jkTuccFDPE9f4OOJ");
    const [email, setEmail] = useState("test@example.com");

    return (
        <Elements stripe={stripePromise}>
            <div className="max-w-lg mx-auto mt-10">
                <h2 className="text-2xl font-bold mb-4">Subscribe to ProfitBuddyAI</h2>

                {/* Plan Selection */}
                <select
                    value={priceId}
                    onChange={(e) => setPriceId(e.target.value)}
                    className="mb-4 p-2 border rounded w-full"
                >
                    <option value="prod_T41xMBOEf6C9JN">Basic Plan - $34.99/mo</option>
                    <option value="price_test_basic_yearly">Basic Plan - $249.99/yr</option>
                    <option value="prod_T41yQS1En12xtf">Business Plan - $49.99/mo</option>
                    <option value="price_test_business_yearly">Business Plan - $399.99/yr</option>
                </select>

                <CheckoutForm priceId={priceId} email={email} />
            </div>
        </Elements>
    );
}
