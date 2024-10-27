import { EpochRarity, rarityGradientColors } from "@customTypes/index";

type Props = {
  title?: string;
  topText?: string;
  bottomText?: string;
  width?: number;
  height?: number;
  className?: string;
  borderRadius?: number;
  strokeWidth?: number;
  textColor?: string;
  startColor?: string;
  endColor?: string;
  backgroundImage?: string;
  backgroundImageOpacity?: number;
};

export const RectangleCard = ({
  title = "",
  width = 50,
  height = 50,
  className,
  borderRadius = 50,
  strokeWidth = 10,
  textColor = "black",
  topText = "",
  bottomText = "",
  startColor = rarityGradientColors[EpochRarity.Common].start,
  endColor = rarityGradientColors[EpochRarity.Common].end,
  backgroundImage,
  backgroundImageOpacity = 1, // Default opacity set to 1 (fully opaque)
}: Props) => {
  const gradientId = `gradient-rc-${startColor.replace("#", "")}-${endColor.replace("#", "")}`;
  // console.log(
  //   "RectangleCard -> render -> text",
  //   topText,
  //   title,
  //   bottomText,
  //   "gradient",
  //   gradientId,
  //   startColor,
  //   endColor,
  // );

  return (
    <svg width={width} height={height} className={className}>
      <defs>
        <clipPath id="rectangleClip">
          <rect x="0" y="0" width={width} height={height} rx={borderRadius} ry={borderRadius} />
        </clipPath>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
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
          clipPath="url(#rectangleClip)"
          opacity={backgroundImageOpacity}
        />
      )}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx={borderRadius}
        ry={borderRadius}
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <text x="50%" y="20%" textAnchor="middle" dominantBaseline="middle" fontSize={height * 0.1} fill={textColor}>
        {topText}
      </text>
      <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontSize={height * 0.2} fill={textColor}>
        {title}
      </text>
      <text x="50%" y="80%" textAnchor="middle" dominantBaseline="middle" fontSize={height * 0.1} fill={textColor}>
        {bottomText}
      </text>
    </svg>
  );
};
