import { motion } from "framer-motion";
import { FC } from "react";

interface SquareProps {
  value: string;
  onSquareClick: () => void;
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => {
    const delay = 0;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};

const Square: FC<SquareProps> = ({ value = "", onSquareClick }) => {
  return (
    <button
      className="box-border h-32 w-32 p-4 border-4"
      onClick={onSquareClick}
    >
      {value && (
        <motion.svg
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
          ) : (
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
          )}
        </motion.svg>
      )}
    </button>
  );
};

export default Square;
