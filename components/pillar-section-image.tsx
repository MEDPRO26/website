import Image from "next/image";

export type PillarSectionImageData = {
  src: string;
  alt: string;
  title?: string;
  caption: string;
};

export default function PillarSectionImage({
  image,
}: {
  image?: PillarSectionImageData;
}) {
  if (!image) return null;
  return (
    <figure className="my-8 max-w-3xl">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-container">
        <Image
          src={image.src}
          alt={image.alt}
          title={image.title ?? image.alt}
          fill
          sizes="(min-width: 768px) 48rem, 100vw"
          className="object-cover scale-[1.12]"
        />
      </div>
      <figcaption className="font-heading mt-3 text-sm font-medium text-on-surface-variant sm:text-base">
        {image.caption}
      </figcaption>
    </figure>
  );
}
