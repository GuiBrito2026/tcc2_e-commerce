import type { ProductData } from '../data/catalog';
export default function ProductImage({
  product,
  primary = false,
}: {
  product: ProductData;
  primary?: boolean;
}) {
  return (
    <img
      src={product.image}
      alt={product.name}
      width="800"
      height="800"
      loading={!primary && __LAZY_IMAGES__ ? 'lazy' : 'eager'}
      decoding="async"
    />
  );
}
