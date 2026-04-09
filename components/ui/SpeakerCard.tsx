import Image from 'next/image'

type Props = {
  name: string
  title: string
  imageUrl?: string
}

export default function SpeakerCard({ name, title, imageUrl }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Slightly rectangular image */}
      <div className="w-60 h-48 rounded-md bg-gray-200 overflow-hidden mb-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </div>

      {/* Bigger name */}
      <p className="text-lg font-semibold text-[var(--color-secondary)]">{name}</p>

      {/* Bigger title */}
      <p className="text-base text-gray-500">{title}</p>
    </div>
  )
}