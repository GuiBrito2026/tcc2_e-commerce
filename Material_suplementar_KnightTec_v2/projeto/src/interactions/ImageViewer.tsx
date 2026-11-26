import { useEffect, useRef, useState } from 'react';
import type { ProductData } from '../data/catalog';
export default function ImageViewer({
  product,
  initialIndex,
  onClose,
}: {
  product: ProductData;
  initialIndex: number;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(initialIndex);
  useEffect(() => {
    const el = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    el?.showModal();
    return () => {
      el?.close();
      previous?.focus();
    };
  }, []);
  const current = product.images[index];
  return (
    <dialog className="image-viewer" ref={dialog} onCancel={onClose} aria-labelledby="viewer-title">
      <div className="section-heading">
        <h2 id="viewer-title">Imagens de {product.name}</h2>
        <button autoFocus onClick={onClose}>
          Fechar
        </button>
      </div>
      <img src={current.src} alt={current.alt} width={800} height={800} loading="eager" />
      <div className="viewer-controls">
        <button
          disabled={product.images.length < 2}
          onClick={() => setIndex((i) => (i + product.images.length - 1) % product.images.length)}
        >
          Imagem anterior
        </button>
        <span aria-live="polite">
          Imagem {index + 1} de {product.images.length}
        </span>
        <button
          disabled={product.images.length < 2}
          onClick={() => setIndex((i) => (i + 1) % product.images.length)}
        >
          Próxima imagem
        </button>
      </div>
    </dialog>
  );
}
