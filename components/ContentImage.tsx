/* eslint-disable jsx-a11y/alt-text */
import Image, { type ImageProps } from "next/image";

type ContentImageProps = Omit<ImageProps, "fill" | "height" | "width"> & {
  height?: number;
  sizes?: string;
  width?: number;
};

export function ContentImage({
  width = 1600,
  height = 900,
  sizes = "100vw",
  loading = "lazy",
  ...props
}: ContentImageProps) {
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
