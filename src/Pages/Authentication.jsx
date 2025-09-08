import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../Components/Sections/Login";
import Register from "../Components/Sections/Register";

const Authentication = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex items-center justify-center min-h-screen bg-lBackground hideScroll !overflow-hidden">
            {/* <div className="relative w-full max-w-md overflow-hidden"> */}
                <AnimatePresence mode="wait" initial={false}>
                    {isLogin ? (
                        <motion.div
                            key="login"
                            initial={{ x: "-40%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-40%", opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="absolute w-full"
                        >
                            <Login setCurrentAuthState={setIsLogin} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register"
                            initial={{ x: "40%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "40%", opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="absolute w-full"
                        >
                            <Register setCurrentAuthState={setIsLogin} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        // </div>

    );
}

export default Authentication;