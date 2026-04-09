type Props = {
  title: string;
  subtitle?: string;
  light?: boolean;
};

export default function SectionHeading({
  title,
  subtitle,
  light = false,
}: Props) {
  return (
    <div className="text-center mb-10">
      <h2
        className={`text-2xl md:text-3xl font-bold uppercase tracking-wide ${light ? "text-white" : "text-[var(--color-secondary)]"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-2 text-sm ${light ? "text-gray-300" : "text-gray-500"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
