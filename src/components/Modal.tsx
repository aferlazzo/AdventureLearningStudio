import React from "react";

interface ModalProps {
  title: string;
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({
  title,
  open,
  children,
  onClose,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "24px",
          width: "420px",
          maxWidth: "100%",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
        }}
      >
        <h2
          id="modal-title"
          style={{
            marginTop: 0,
            marginBottom: "20px",
          }}
        >
          {title}
        </h2>

        {children}
      </section>
    </div>
  );
}