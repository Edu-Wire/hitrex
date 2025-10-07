"use client";
import { motion } from "framer-motion";

const slideInLeftVariants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

export default function SlideInLeft({ 
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
      variants={slideInLeftVariants}
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
