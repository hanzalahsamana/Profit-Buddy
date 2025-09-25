import { useState } from "react";
import { RiDiscountPercentLine } from "react-icons/ri";
import ToggleSwitch from "../Components/Controls/ToggleSwitch";
import ApplyCouponModal from "../Components/UI/ApplyCouponModal";
import { BsArrowRight } from "react-icons/bs";
import Button from "../Components/Controls/Button";
import useConfirm from "../Hooks/useConfirm";
import { toast } from "react-toastify";
import { setUserSubscription } from "../Redux/Slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { SUBSCRIPTION_PLANS_DATA } from "../Enums/Enums";
import { cancelSubscription, createSubscription } from "../Apis/Subscription";
import { useNavigate } from "react-router-dom";

const Plans = () => {
    const [billingCycle, setBillingCycle] = useState("Monthly");
    const { user } = useSelector((state) => state?.user);
    const userSubscription = user?.currentSubscription;

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [applyCouponModalOpen, setApplyCouponModalOpen] = useState(false);
    const { confirm, ConfirmationModal } = useConfirm()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubscribePlan = async (planId) => {
        console.log(planId);

        const ok = await confirm("Proceed with Subscription?", "You will be redirected to the checkout page to complete your subscription.", "No, cancel", "Yes, continue", "secondary")
        if (!ok) return


        if (!planId) {
            toast.error('This is not a valid plan.')
            return
        }

        setLoading(true)
        try {
            const data = await createSubscription({ planName: planId })
            dispatch(setUserSubscription(data?.subscription))
            if (data?.clientSecret) {
                navigate(`/checkout?planName=${planId}`)
            } else {
                toast.error("Unable to start checkout session. Please try again.");
            }
        } catch (err) {
            console.error(err);
            const message = err.response ? err.response.data.message : err.message
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    const handleCancelSubscription = async () => {
        try {
            const ok = await confirm(
                "Cancel Your Subscription?",
                "If you proceed, your current subscription will be canceled and you will need to subscribe again to continue using our services.",
                "No, keep it",
                "Yes, cancel",
                "danger"
            );
            if (!ok) return
            setLoading(true)
            const responce = await cancelSubscription()
            dispatch(setUserSubscription(responce?.subscription))
            toast.success(responce?.message)
        } catch (err) {
            const message = err.response ? err.response.data.message : err.message
            toast.error(message)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="bg-lBackground flex flex-col gap-8 items-center py-10 px-4">
            <div className="flex items-center  gap-4 justify-between w-full max-w-[670px]">

                <ToggleSwitch
                    options={['Monthly', 'Yearly']}
                    onChange={(option) => setBillingCycle(option)}
                    selected={billingCycle}
                />

                <button onClick={() => setApplyCouponModalOpen(true)} className="text-[16px] outline-none border-border text-lText bg-primary hover:scale-[1.04] transition-all duration-300 cursor-pointer flex gap-2 items-center glowSpinBox  py-3 px-3 rounded-lg !border-[1.5px] ">
                    <RiDiscountPercentLine size={20} />
                    Proceed with coupon code
                    <BsArrowRight size={20} />
                </button>

            </div>
            <div className="flex gap-8 w-full justify-center items-center">
                {Object.values(SUBSCRIPTION_PLANS_DATA)
                    .filter(plan => plan.type.toLowerCase() === billingCycle.toLowerCase()) // only monthly/yearly
                    .map((plan) => {
                        return (
                            <div
                                key={plan.id}
                                className={`relative rounded-lg border-[1.5px] w-[320px] p-6 rainbow-glow-box cursor-pointer transition-all duration-300 ${plan.isPopular ? 'border-accent bg-primary shadow-lg' : 'border-border/80 bg-lBackground'}`}
                                onClick={() => setSelectedPlan(plan.id)}
                            >
                                {plan.isPopular && (
                                    <div className="absolute top-2 right-2 bg-accent text-primary rounded-full px-3 py-1 text-xs">
                                        Most Popular
                                    </div>
                                )}
                                <h2 className="text-2xl font-semibold text-secondary">{plan.name} Plan</h2>
                                <p className="text-sm/[14px] text-lText/80">{plan.subText}</p>
                                <p className="text-lText my-2">
                                    <span className="text-[40px] text-secondary font-semibold">{plan.price.toFixed(2)}</span> / Paid {billingCycle}
                                </p>
                                <Button
                                    label={userSubscription?.status === 'active' && userSubscription?.planName === plan.id
                                        ? "Cancel Plan"
                                        : "Subscribe"
                                    }
                                    action={userSubscription?.status === 'active' && userSubscription?.planName === plan.id
                                        ? handleCancelSubscription
                                        : () => handleSubscribePlan(plan.id)
                                    }
                                    variant={plan.isPopular ? "secondary" : "secondary"}
                                    size="medium"
                                    className="ring-4 mb-3 ring-secondary/20 w-full"
                                    disabled={loading}
                                />

                                <div className="mb-4">
                                    <h3 className="font-semibold text-secondary mb-1">Key Benefits</h3>
                                    <ul className="text-lText text-sm list-disc list-inside space-y-1">
                                        {plan.benefits.map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary mb-1">Includes</h3>
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

            <ApplyCouponModal
                isOpen={applyCouponModalOpen}
                setIsOpen={setApplyCouponModalOpen}
            />

            {ConfirmationModal}
        </div>
    );
};

export default Plans;
