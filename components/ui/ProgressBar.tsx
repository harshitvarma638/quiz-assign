import React from "react";

const CircularProgressBar = ({ score, total, color, label }: any) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / total) * circumference;

  return (
    <div className="flex flex-col items-center justify-center mb-4 border-2 rounded-lg p-2 sm:p-4">
      <p className="text-sm sm:text-base font-semibold mb-1 sm:mb-2">{label}</p>
      <div className="relative">
        <svg 
          width="90" 
          height="90" 
          className="w-[90px] h-[90px] sm:w-[120px] sm:h-[120px]"
          viewBox="0 0 120 120" 
          preserveAspectRatio="xMidYMid meet"
        >
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
            className="text-base sm:text-xl font-medium"
          >
            {score}/{total}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default CircularProgressBar;
