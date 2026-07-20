import React from "react";

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <section
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "20px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "12px",
          fontSize: "1.2rem",
          borderBottom: "1px solid #ddd",
          paddingBottom: "6px",
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}