import React from "react";

/**
 * The GridPattern component (formerly InteractiveGridPattern).
 * Removed interactivity and cn dependencies.
 */
export default function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [64, 64],
  className,
  squaresClassName,
  ...props
}) {
  const [horizontal, vertical] = squares;

  return (
    <svg
      viewBox={`0 0 ${width * horizontal} ${height * vertical}`}
      preserveAspectRatio="xMidYMid slice"
      className={` absolute inset-0 h-full w-full bg-white ${className || ''}`}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width;
        const y = Math.floor(index / horizontal) * height;
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={`stroke-black/30 fill-transparent ${squaresClassName || ''}`}
          />
        );
      })}
    </svg>
  );
}