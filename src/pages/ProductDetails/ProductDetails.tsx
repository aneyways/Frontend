import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product.types';
import { getProductById, addItemToCart } from '../../services/api';
import { addToLocalCart } from '../../store/cartStore';
import { getCurrentUser, isAuthenticated } from '../../services/auth';
import styles from './ProductDetails.module.css';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProductById(Number(id))
      .then(setProduct)
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated()) {
      navigate('/auth');
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    const cartItem = {
      id: product.id,
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      price: product.price,
      totalPrice: product.price,
      quantity: 1,
      imageUrl: product.images?.[0]?.url ?? '',
    };

    addToLocalCart(cartItem);

    try {
      await addItemToCart(user.id, {
        productId: product.id,
        quantity: 1,
        unitPrice: product.price,
      });
    } catch {
      // бэкенд недоступен — используем локальную корзину
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const priceFormatted = (price: number) =>
    new Intl.NumberFormat('ro-MD', {
      style: 'currency',
      currency: 'MDL',
      minimumFractionDigits: 0,
    }).format(price);

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonInfo}>
        <div className={styles.skeletonLine} style={{ width: '40%' }} />
        <div className={styles.skeletonLine} style={{ width: '70%' }} />
        <div className={styles.skeletonLine} style={{ width: '30%' }} />
      </div>
    </div>
  );

  if (error || !product) return (
    <div className={styles.error}>
      <h2>Product not found.</h2>
      <button onClick={() => navigate('/catalog')}>← Back to Catalog</button>
    </div>
  );

  const images = product.images?.length
    ? product.images.map(i => i.url)
    : [];

  return (
    <div className={styles.page}>

      <div className={styles.breadcrumb}>
        <button onClick={() => navigate('/')}>Home</button>
        <span>/</span>
        <button onClick={() => navigate('/catalog')}>Catalog</button>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className={styles.inner}>

        {/* LEFT — Gallery */}
        <div className={styles.gallery}>
          {images.length > 0 ? (
            <>
              <div className={styles.mainImg}>
                <img src={images[activeImg]} alt={product.name} />
              </div>
              {images.length > 1 && (
                <div className={styles.thumbs}>
                  {images.map((url, i) => (
                    <button
                      key={i}
                      className={`${styles.thumb} ${activeImg === i ? styles.thumbActive : ''}`}
                      onClick={() => setActiveImg(i)}
                    >
                      <img src={url} alt={`${product.name} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={styles.noImage}>No image available</div>
          )}
        </div>

        {/* RIGHT — Info */}
        <div className={styles.info}>
          <p className={styles.category}>
            {product.category ?? 'Audio'}
            {product.subCategory && (
              <span className={styles.subCategory}> · {product.subCategory}</span>
            )}
          </p>

          <h1 className={styles.name}>{product.name}</h1>

          <p className={styles.price}>
            {priceFormatted(product.price)}
          </p>

          {product.description && (
            <p className={styles.desc}>{product.description}</p>
          )}

          <div className={styles.actions}>
            <button
              className={`${styles.addToCart} ${added ? styles.added : ''}`}
              onClick={handleAddToCart}
            >
              {added ? '✓ Added to Cart' : isAuthenticated() ? 'Add to Cart' : 'Login to Buy'}
            </button>
          </div>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Category</span>
              <span className={styles.metaValue}>{product.category ?? '—'}</span>
            </div>
            {product.subCategory && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Subcategory</span>
                <span className={styles.metaValue}>{product.subCategory}</span>
              </div>
            )}
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Availability</span>
              <span className={styles.metaValue}>In Stock</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Warranty</span>
              <span className={styles.metaValue}>2 Years</span>
            </div>
          </div>

          <div className={styles.perks}>
            <div className={styles.perk}>
              <span>⬡</span>
              <p>Free delivery on orders over 1500 MDL</p>
            </div>
            <div className={styles.perk}>
              <span>◎</span>
              <p>30-day hassle-free returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}