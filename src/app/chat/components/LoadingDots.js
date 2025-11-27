"use client";

export default function LoadingDots() {
  return (
    <span style={{ display: "inline-block", width: "24px" }}>
      <span className="dot">.</span>
      <span className="dot">.</span>
      <span className="dot">.</span>

      <style jsx>{`
        .dot {
          animation: blink 1.4s infinite both;
          font-size: 20px;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0% {
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </span>
  );
}
