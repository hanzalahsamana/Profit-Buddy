import { useSelector } from "react-redux";
import Button from "../Controls/Button";
import { useNavigate } from "react-router-dom";
import { SUBSCRIPTION_PLANS_DATA } from "../../Enums/Enums";

const SupportTab = () => {
    const { user } = useSelector((state) => state?.user);
    const navigate = useNavigate()

    // Check if the user has support access
    const hasSupportAccess = user?.currentSubscription?.planName
        ? SUBSCRIPTION_PLANS_DATA[user.currentSubscription.planName]?.quotas?.supportAccess
        : false;

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-4 h-max relative">
            <div className={`flex flex-col gap-4 bg-primary border border-border rounded-xl p-4 ${!hasSupportAccess ? "" : ""}`}>
                <p className="text-2xl text-secondary/80 font-medium">Support</p>
                {hasSupportAccess ? (
                    // Placeholder for actual support UI
                    <div className="text-lText">
                        <p>Welcome to support! Here you can submit queries and get help from our team.</p>
                    </div>
                ) : null}
            </div>

            {!hasSupportAccess && (
                <div className="absolute inset-0 flex flex-col items-center justify-center h-[400px] border border-border bg-primary/5 backdrop-blur-2xl rounded-xl gap-5">
                    <p className="text-xl capitalize text-secondary/80 text-center font-semibold">
                        Support feature is only available for Business plan users.
                    </p>
                    <Button
                        label="Upgrade Plan"
                        variant="secondary"
                        size="large"
                        action={() => navigate("/plans")}
                    />
                </div>
            )}
        </div>
    );
};

export default SupportTab;
