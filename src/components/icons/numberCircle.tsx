type Props = {
  title: string;
  topText?: string;
  bottomText?: string;
  width?: number;
  height?: number;
  className?: string;
  strokeWidth?: number;
  textColor?: string;
};

export const NumberCircle = ({
  title = "10",
  width = 50,
  height = 50,
  className,
  strokeWidth = 10,
  textColor = "black",
  topText = "", // New prop for text above the title
  bottomText = "", // New prop for text below the title
}: Props) => {
  // Adjust radius based on width and height
  const radius = Math.min(width, height) / 2 - strokeWidth;

  return (
    <svg width={width} height={height} className={className}>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#ff7e5f", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#feb47b", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx={width / 2} cy={height / 2} r={radius} stroke="url(#gradient)" strokeWidth={strokeWidth} fill="none" />
      <text x="50%" y="20%" textAnchor="middle" dominantBaseline="middle" fontSize={radius * 0.2} fill={textColor}>
        {topText}
      </text>
      <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontSize={radius} fill={textColor}>
        {title}
      </text>
      <text x="50%" y="80%" textAnchor="middle" dominantBaseline="middle" fontSize={radius * 0.2} fill={textColor}>
        {bottomText}
      </text>
    </svg>
  );
};
