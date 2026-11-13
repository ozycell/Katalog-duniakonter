import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export default function AuthLayout() {
    return (
        <div className="min-h-dvh bg-background">
            <motion.div
                className="w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <Outlet />
            </motion.div>
        </div>
    );
}
