"use client";
import { motion } from "framer-motion";

const slideInRightVariants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

export default function SlideInRight({ 
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
      variants={slideInRightVariants}
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
