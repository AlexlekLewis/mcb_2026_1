import type { Metadata } from "next";

type MetadataOptions = {
  title: string;
  description: string;
  image?: string;
  path?: string;
};

export function pageMetadata({ title, description, image, path }: MetadataOptions): Metadata {
  const metadata: Metadata = {
    title,
    description,
  };

  if (path) {
    metadata.alternates = {
      canonical: path,
    };
  }

  if (image) {
    metadata.openGraph = {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    };
  }

  return metadata;
}
