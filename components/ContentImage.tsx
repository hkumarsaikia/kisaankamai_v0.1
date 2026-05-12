/* eslint-disable jsx-a11y/alt-text */
import Image, { type ImageProps } from "next/image";

type ContentImageProps = Omit<ImageProps, "fill" | "height" | "width"> & {
  height?: number;
  mobileSrc?: string;
  sizes?: string;
  width?: number;
};

export function ContentImage({
  width = 1600,
  height = 900,
  mobileSrc,
  sizes = "100vw",
  loading = "lazy",
  ...props
}: ContentImageProps) {
  if (mobileSrc) {
    return (
      <picture>
        <source media="(max-width: 767px)" srcSet={mobileSrc} type="image/webp" />
        <Image
          height={height}
          loading={loading}
          sizes={sizes}
          width={width}
          {...props}
        />
      </picture>
    );
  }

  return (
    <Image
      height={height}
      loading={loading}
      sizes={sizes}
      width={width}
      {...props}
    />
  );
}
