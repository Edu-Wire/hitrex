"use client";
import { motion } from "framer-motion";

const fadeInUpVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function FadeInUp({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  className = "",
  once = true 
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={fadeInUpVariants}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
