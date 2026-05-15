import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product.types';
import { getFeaturedProducts } from '../../services/api';
import ProductCard from '../ProductCard/ProductCard';
import styles from './FeaturedProducts.module.css';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getFeaturedProducts()
      .then(setProducts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={styles.section}>

      {/* Editorial text block — как на референсе */}
      <div className={styles.editorial}>
        <div className={styles.editorialLeft}>
          <span className={styles.tag}>01 — Featured</span>
          <p className={styles.editorialSmall}>
            Engineered for <strong>pure performance.</strong>
          </p>
        </div>
        <div className={styles.editorialRight}>
          <h2 className={styles.editorialBig}>
            Advanced 40mm<br />
            drivers. Active<br />
            noise cancelling.<br />
            <em>Transparent</em> design<br />
            with purpose.
          </h2>
        </div>
      </div>

      {/* Products grid */}
      <div className={styles.gridHeader}>
        <span className={styles.label}>New arrivals</span>
        <button className={styles.viewAll} onClick={() => navigate('/catalog')}>
          View All →
        </button>
      </div>

      {loading && (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}

      {error && (
        <p className={styles.error}>Could not load products.</p>
      )}

      {!loading && !error && (
        <div className={styles.grid}>
          {products.slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}