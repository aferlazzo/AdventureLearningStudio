import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: "10px 18px",
        fontSize: "1rem",
        cursor: "pointer",
        borderRadius: "6px",
        border: "1px solid #888",
        backgroundColor: "#ffffff",
      }}
    >
      {children}
    </button>
  );
}
