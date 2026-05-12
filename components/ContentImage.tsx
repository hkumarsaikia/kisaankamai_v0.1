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
    const {
      alt,
      className,
      decoding,
      fetchPriority,
      src,
      style,
    } = props;

    return (
      <picture>
        <source media="(max-width: 767px)" srcSet={mobileSrc} type="image/webp" />
        <img
          alt={alt}
          className={className}
          decoding={decoding}
          fetchPriority={fetchPriority}
          height={height}
          loading={loading}
          src={String(src)}
          style={style}
          width={width}
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
