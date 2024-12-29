import React from "react";
import { useSpring, animated } from "react-spring";

const AnimatedButton = ({ onClick, children, className }) => {
  const [props, set] = useSpring(() => ({
    transform: "scale(1)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  }));

  return (
    <animated.button
      onClick={onClick}
      className={`${className} transition-all duration-300 ease-in-out transform`}
      style={props}
      onMouseEnter={() => set({ transform: "scale(1.1)" })}
      onMouseLeave={() => set({ transform: "scale(1)" })}
    >
      {children}
    </animated.button>
  );
};

export default AnimatedButton;
