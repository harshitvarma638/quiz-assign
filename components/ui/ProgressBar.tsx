import React from "react";

const CircularProgressBar = ({ score, total, color, label }: any) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / total) * circumference;

  return (
    <div className="flex flex-col items-center justify-center mb-4 border-2 rounded-lg p-4">
      <p className="font-semibold mb-2">{label}</p>
      <div className="relative">
        <svg width="120" height="120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#dee2e6"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={isNaN(circumference - progress) ? "0" : String(circumference - progress)}
            style={{
                transition: "stroke-dashoffset 0.5s ease",
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
            }}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            stroke="black"
            strokeWidth="1px"
            dy=".3em"
            className="font-medium text-xl"
          >
            {score}/{total}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default CircularProgressBar;
