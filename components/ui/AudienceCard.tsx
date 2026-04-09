import Image from "next/image";
import Link from "next/link";

type Props = {
  label: string;
  imageUrl: string;
};

export default function AudienceCard({ label, imageUrl }: Props) {
  return (
    <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden rounded-lg group cursor-pointer">
      <Image
        src={imageUrl}
        alt={label}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
        <h3 className="text-white font-bold text-lg uppercase">{label}</h3>
        <Link href="/events">
          <button className="mt-2 text-xs border border-[var(--color-primary)] text-[var(--color-primary)] px-3 py-1 rounded w-fit hover:bg-[var(--color-primary)] hover:text-black transition">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
}
