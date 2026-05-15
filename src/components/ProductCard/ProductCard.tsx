import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product.types';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80';

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const imageUrl = product.images?.[0]?.url ?? PLACEHOLDER;
  const priceFormatted = new Intl.NumberFormat('ro-MD', {
    style: 'currency',
    currency: 'MDL',
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/catalog/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/catalog/${product.id}`)}
    >
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt={product.name} className={styles.image} />
        <div className={styles.waveform} aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className={styles.bar}
              style={{ '--i': i } as React.CSSProperties}
            />
          ))}
        </div>
        {product.status === 'out_of_stock' && (
          <span className={styles.badge}>Sold Out</span>
        )}
      </div>
      <div className={styles.info}>
        <p className={styles.category}>{product.category?.name ?? 'Audio'}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>{priceFormatted}</p>
      </div>
    </article>
  );
}