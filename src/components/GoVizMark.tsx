type Props = {
  size?: number;
  color?: string;
};

export default function GoVizMark({ size = 28, color = "#032bff" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path
        d="M 28 14 L 86 14 L 86 86 L 14 86 L 14 40 L 28 14 Z M 28 28 L 28 72 L 72 72 L 72 56 L 54 56 L 54 48 L 72 48 L 72 28 Z"
        fill={color}
        fillRule="evenodd"
      />
      <path
        d="M 14 40 L 28 14 L 28 28 L 14 40 Z"
        fill={color}
        opacity="0.5"
      />
    </svg>
  );
}
