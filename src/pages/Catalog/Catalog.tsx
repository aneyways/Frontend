import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../../types/product.types';
import { getAllProducts } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Catalog.module.css';

const CATEGORIES = ['All', 'Headphones', 'Speakers', 'Microphones', 'Accessories'];

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') ?? 'all';

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p =>
        p.category?.name.toLowerCase() === activeCategory.toLowerCase()
      );

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Our collection</span>
        <h1 className={styles.title}>All Products</h1>
      </div>

      <div className={styles.inner}>
        <aside className={styles.sidebar}>
          <p className={styles.filterLabel}>Category</p>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${
                activeCategory === cat.toLowerCase() ||
                (cat === 'All' && activeCategory === 'all')
                  ? styles.active : ''
              }`}
              onClick={() =>
                setSearchParams(cat === 'All' ? {} : { category: cat.toLowerCase() })
              }
            >
              {cat}
            </button>
          ))}
        </aside>

        <div className={styles.content}>
          {loading && (
            <div className={styles.grid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          )}
          {!loading && (
            <>
              <p className={styles.count}>{filtered.length} products</p>
              <div className={styles.grid}>
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}