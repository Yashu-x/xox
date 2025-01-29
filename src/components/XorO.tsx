"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

interface XorOProps {
  value?: string;
}

const XorO: React.FC<XorOProps> = ({ value}) => {
  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: () => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 },
      },
    }),
  };

  return (
    <>
      {value && (
        <motion.svg
          className="box-border h-32 w-32 p-4 border-4"
          viewBox="0 0 128 128"
          initial="hidden"
          animate="visible"
        >
          {value === "O" ? (
            <motion.circle
              cx="64"
              cy="64"
              r="40"
              stroke="#0099ff"
              strokeWidth="8"
              fill="none"
              variants={draw}
              custom={2}
            />
          ) : value === "X" ? (
            <>
              <motion.line
                x1="36"
                y1="36"
                x2="92"
                y2="92"
                stroke="#ff0055"
                strokeWidth="8"
                custom={3}
                variants={draw}
              />
              <motion.line
                x1="92"
                y1="36"
                x2="36"
                y2="92"
                stroke="#ff0055"
                strokeWidth="8"
                custom={3.5}
                variants={draw}
              />
            </>
          ) : (
            <motion.rect
              width="100"
              height="100"
              // x="410"
              // y="230"
              rx="10"
              fill="none"
              strokeWidth="8"
              stroke="#00cc88"
              custom={4}
              variants={draw}
            />
          )}
        </motion.svg>
      )}
    </>
  );
};

export default XorO;
