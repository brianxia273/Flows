type ThemeButtonProps = {
  color1: string;
  color2: string;
  onClick: () => void;
  selected?: boolean;
};

export function ThemeButton({
  color1,
  color2,
  onClick,
  selected,
}: ThemeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-20 h-12 flex items-center justify-center gap-1 rounded-lg bg-gray-200 transition ${
        selected
          ? "border-gray-500 ring-2 ring-gray-500"
          : "border-gray-500 hover:shadow-md"
      }`}
    >
      <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: color1 }} />
      <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: color2 }} />
    </button>
  );
}
