import { useEffect, useRef, useState } from 'react';
import type { ProductData } from '../data/catalog';

function ObservedProductImage({ product }: { product: ProductData }) {
  const image = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (visible || !image.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    });
    observer.observe(image.current);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <img
      ref={image}
      src={visible ? product.image : undefined}
      alt={product.name}
      width={800}
      height={800}
      loading="eager"
      decoding="async"
    />
  );
}

export default function ProductImage({
  product,
  primary = false,
  observeVisibility = false,
}: {
  product: ProductData;
  primary?: boolean;
  observeVisibility?: boolean;
}) {
  if (__LAZY_IMAGES__ && observeVisibility) return <ObservedProductImage product={product} />;

  return (
    <img
      src={product.image}
      alt={product.name}
      width={800}
      height={800}
      loading={!primary && __LAZY_IMAGES__ ? 'lazy' : 'eager'}
      decoding="async"
    />
  );
}
