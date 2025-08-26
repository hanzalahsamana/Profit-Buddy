import React from 'react'
import { motion } from 'framer-motion';

const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};
const AnimationWrapper = ({ children }) => {
    return (
        <motion.div variants={fadeUpVariant} initial="hidden" animate="visible">
            {children}
        </motion.div>
    )
}

export default AnimationWrapper