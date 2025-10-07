"use client";
import { motion } from "framer-motion";

const scaleInVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

export default function ScaleIn({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  className = "",
  once = true,
  whileHover = false
}) {
  const hoverProps = whileHover ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  } : {};

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={scaleInVariants}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut"
      }}
      className={className}
      {...hoverProps}
    >
      {children}
    </motion.div>
  );
}
