import Image from "next/image";
import type { CatalogProduct } from "@/lib/catalog";

type ProductGalleryProps = {
  product: CatalogProduct;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  const images =
    product.images.length > 0
      ? product.images
      : [
          {
            id: product.id,
            productId: product.id,
            url: product.featuredImage,
            altText: product.name,
            sortOrder: 0,
            createdAt: product.createdAt,
          },
        ];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#d7dfbd] bg-[#edf1df] shadow-sm">
        <Image
          src={product.featuredImage}
          alt={product.name}
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.slice(0, 3).map((image) => (
          <div
            key={image.id}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#d7dfbd] bg-white"
          >
            <Image
              src={image.url}
              alt={image.altText}
              fill
              unoptimized
              sizes="(min-width: 1024px) 14vw, 30vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
