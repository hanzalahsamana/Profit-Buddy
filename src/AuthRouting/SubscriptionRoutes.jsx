import { Navigate } from "react-router-dom";
import Loader from "../Components/Loaders/Loader";
import { useSelector } from "react-redux";

const SubscriptionRoute = () => {
    const { user, userLoading } = useSelector((state) => state?.user);

    if (userLoading) return <Loader />;

    if (!user) return <Navigate to="/login" />;

    if (user.currentSubscription && user?.currentSubscription?.status === "active") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default SubscriptionRoute;