export default function ResponsivePicture({
  image,
  alt,
  sizes,
  className,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  ...props
}) {
  return (
    <picture>
      {image.sources?.avif && (
        <source
          srcSet={image.sources.avif}
          sizes={sizes}
          type="image/avif"
        />
      )}
      {image.sources?.webp && (
        <source
          srcSet={image.sources.webp}
          sizes={sizes}
          type="image/webp"
        />
      )}
      {image.sources?.jpg && (
        <source
          srcSet={image.sources.jpg}
          sizes={sizes}
          type="image/jpeg"
        />
      )}
      <img
        src={image.jpg}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        {...props}
      />
    </picture>
  );
}
