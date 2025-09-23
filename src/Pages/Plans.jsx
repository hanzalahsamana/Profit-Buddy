"use client";
import React, { useState } from "react";
import Button from "../Components/Controls/Button";
import { CiDiscount1 } from "react-icons/ci";
import { RiDiscountPercentLine } from "react-icons/ri";
import { HiArrowLongRight, HiOutlineArrowRight } from "react-icons/hi2";
import { ImArrowRight2 } from "react-icons/im";
import ToggleSwitch from "../Components/Controls/ToggleSwitch";

const plansData = [
    {
        name: "Basic",
        subText: "Perfect for individual users getting started", // mini sub text
        monthly: 34.99,
        yearly: 249.99,
        benefits: [
            "Cancel at anytime",
            "Access to ProfitBuddy University, Store Spying, AI Buddy, Chrome Extension, Sales Estimator, and more...",
        ],
        includes: ["Unlimited Product Lookups", "Limited AI Access"],
    },
    {
        name: "Business",
        monthly: 49.99,
        subText: "Ideal for teams needing full access", // mini sub text
        yearly: 399.99,
        benefits: [
            "Cancel at anytime",
            "Access to ProfitBuddy University, Store Spying, AI Buddy, Chrome Extension, Sales Estimator, and more...",
        ],
        includes: [
            "3 Users (With Individual Analytics)",
            "Unlimited Product Lookups",
            "Unlimited AI Access",
            "Priority Support + Onboarding",
        ],
    },
];

const Plans = () => {
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [selectedPlan, setSelectedPlan] = useState(null);

    const toggleBilling = () =>
        setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly");

    return (
        <div className="bg-lBackground min-h-screen flex flex-col gap-8 items-center py-12 px-4">


            <button className="text-[16px] border-[#d5d5d5] text-lText !bg-white hover:scale-105 transition-all duration-300 cursor-pointer flex gap-2 items-center glowSpinBox  py-3 px-3 rounded-lg !border-[1.5px] ">
                <RiDiscountPercentLine />Proceed with coupon code
            </button>

            <ToggleSwitch
                options={['Yearly', 'Monthly']}
                onChange={(option) => setBillingCycle(option)}
                selected={billingCycle}
            />

            {/* Plan Cards */}
            <div className="grid gap-6 md:grid-cols-2 w-full max-w-[670px]">
                {plansData.map((plan) => {
                    const price = billingCycle === "Monthly" ? plan.monthly : plan.yearly;
                    const isSelected = selectedPlan === plan.name;

                    return (
                        <div
                            key={plan.name}
                            className={` relative  rounded-lg border-[1.5px]  p-6  rainbow-glow-box cursor-pointer transition-all duration-300 
                                ${plan.name === 'Business' ? 'border-accent bg-primary shadow-lg' : ' border-border/80 bg-lBackground'}`}
                            onClick={() => setSelectedPlan(plan.name)}
                        >
                            {plan.name === 'Business' ? (
                                <div className="absolute top-2 right-2 bg-accent text-primary rounded-full px-3 py-1 text-sm">
                                    Most Popular
                                </div>
                            ) : ''}
                            <h2 className="text-2xl font-semibold text-[var(--secondary)]">
                                {plan.name} Plan
                            </h2>
                            <p className="text-sm/[14px] text-lText/80">{plan.subText}</p>
                            <p className="text-[var(--lText)] my-4">
                                <span className="text-[40px] text-secondary font-semibold">{price.toFixed(2)}</span> / Paid {billingCycle}
                            </p>
                            <button className={`w-full ring-4  ring-secondary/20 py-2 mb-3 rounded-sm font-semibold text-primary ${isSelected ? "bg-secondary" : "bg-secondary"}`}
                            >
                                {isSelected ? "Selected" : "Subscribe"}
                            </button>

                            <div className="mb-4">
                                <h3 className="font-semibold text-[var(--secondary)] mb-1">Key Benefits</h3>
                                <ul className="text-lText text-sm list-disc list-inside space-y-1">
                                    {plan.benefits.map((b, i) => (
                                        <li key={i}>{b}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="">
                                <h3 className="font-semibold text-[var(--secondary)] mb-1">Includes</h3>
                                <ul className="text-lText text-sm list-disc list-inside space-y-1">
                                    {plan.includes.map((i, idx) => (
                                        <li key={idx}>{i}</li>
                                    ))}
                                </ul>
                            </div>


                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Plans;
