type Props = {
  title?: string;
  topText?: string;
  bottomText?: string;
  width?: number;
  height?: number;
  className?: string;
  strokeWidth?: number;
  textColor?: string;
  startColor?: string;
  endColor?: string;
  backgroundImage?: string;
  backgroundImageOpacity?: number;
};

export const NumberCircle = ({
  title = "",
  width = 50,
  height = 50,
  className,
  strokeWidth = 10,
  textColor = "black",
  topText = "",
  bottomText = "",
  startColor = "#9a2104",
  endColor = "#feb47b",
  backgroundImage,
  backgroundImageOpacity = 1, // Default opacity set to 1 (fully opaque)
}: Props) => {
  // Adjust radius based on width and height
  const radius = Math.min(width, height) / 2 - strokeWidth;

  return (
    <svg width={width} height={height} className={className}>
      <defs>
        <clipPath id="circleClip">
          <circle cx={width / 2} cy={height / 2} r={radius} />
        </clipPath>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: startColor, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: endColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {backgroundImage && (
        <image
          href={backgroundImage}
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#circleClip)"
          opacity={backgroundImageOpacity} // Set the opacity of the image
        />
      )}
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
