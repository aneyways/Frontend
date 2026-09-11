import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../../types/product.types';
import { getAllProducts, getSubCategoriesByCategory, getAllCategories } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Catalog.module.css';

const CATEGORIES = ['All', 'Headphones', 'Speakers', 'Microphones', 'Accessories'];

const SORT_OPTIONS = [
  { value: 'default',    label: 'Default' },
  { value: 'price-asc',  label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'name-asc',   label: 'A → Z' },
  { value: 'name-desc',  label: 'Z → A' },
];

function extractBrand(name: string): string {
  const SKIP_WORDS = ['the', 'new', 'ultra', 'pro', 'max', 'plus', 'mini', 'lite'];
  const words = name.split(/\s+/);
  for (const word of words) {
    const clean = word.replace(/[^a-zA-Z]/g, '');
    if (clean.length > 1 && !SKIP_WORDS.includes(clean.toLowerCase())) {
      return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
    }
  }
  return 'Other';
}

const MAX_PRICE = 20000;

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch]         = useState('');
  const [sort, setSort]             = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandsOpen, setBrandsOpen] = useState(true);
  const [subCategories, setSubCategories] = useState<{ id: number; name: string }[]>([]);
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');

  const activeCategory = searchParams.get('category') ?? 'all';

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const availableBrands = useMemo(() => {
    const brands = new Set(products.map(p => extractBrand(p.name)));
    return Array.from(brands).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'all') {
      result = result.filter(p =>
        p.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (activeSubCategory !== 'all') {
      result = result.filter(p =>
        p.subCategory?.toLowerCase() === activeSubCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    result = result.filter(p =>
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (selectedBrands.length > 0) {
      result = result.filter(p =>
        selectedBrands.includes(extractBrand(p.name))
      );
    }

    switch (sort) {
      case 'price-asc':  result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'name-asc':   result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc':  result.sort((a, b) => b.name.localeCompare(a.name)); break;
    }

    return result;
  }, [products, activeCategory, activeSubCategory, search, priceRange, selectedBrands, sort]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryClick = async (cat: string) => {
    if (cat === 'All') {
      setSearchParams({});
      setSubCategories([]);
      setActiveSubCategory('all');
    } else {
      setSearchParams({ category: cat.toLowerCase() });
      setActiveSubCategory('all');
      try {
        const allCats = await getAllCategories();
        const found = allCats.find(c => c.name.toLowerCase() === cat.toLowerCase());
        if (found) {
          const subs = await getSubCategoriesByCategory(found.id);
          setSubCategories(subs);
        } else {
          setSubCategories([]);
        }
      } catch {
        setSubCategories([]);
      }
    }
  };

  const handleReset = () => {
    setSearch('');
    setSort('default');
    setPriceRange([0, MAX_PRICE]);
    setSelectedBrands([]);
    setSubCategories([]);
    setActiveSubCategory('all');
    setSearchParams({});
  };

  const hasActiveFilters =
    search || priceRange[0] > 0 || priceRange[1] < MAX_PRICE ||
    selectedBrands.length > 0 || activeCategory !== 'all' || activeSubCategory !== 'all';

  const priceFormatted = (v: number) =>
    new Intl.NumberFormat('ro-MD', { style: 'currency', currency: 'MDL', minimumFractionDigits: 0 }).format(v);

  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <span className={styles.eyebrow}>Our collection</span>
        <h1 className={styles.title}>All Products</h1>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className={styles.toolbarRight}>
          {hasActiveFilters && (
            <button className={styles.resetAllBtn} onClick={handleReset}>
              Clear all
            </button>
          )}
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.inner}>

        <aside className={styles.sidebar}>

          {/* Category */}
          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Category</p>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${
                  activeCategory === cat.toLowerCase() ||
                  (cat === 'All' && activeCategory === 'all') ? styles.active : ''
                }`}
                onClick={() => handleCategoryClick(cat)}
              >
                <span>{cat}</span>
                <span className={styles.filterCount}>
                  {cat === 'All'
                    ? products.length
                    : products.filter(p =>
                        p.category?.toLowerCase() === cat.toLowerCase()
                      ).length}
                </span>
              </button>
            ))}
          </div>

          {/* Subcategory */}
          {subCategories.length > 0 && (
            <div className={styles.filterGroup}>
              <p className={styles.filterLabel}>Subcategory</p>
              <button
                className={`${styles.filterBtn} ${activeSubCategory === 'all' ? styles.active : ''}`}
                onClick={() => setActiveSubCategory('all')}
              >
                <span>All</span>
                <span className={styles.filterCount}>
                  {products.filter(p =>
                    p.category?.toLowerCase() === activeCategory.toLowerCase()
                  ).length}
                </span>
              </button>
              {subCategories.map(sub => (
                <button
                  key={sub.id}
                  className={`${styles.filterBtn} ${
                    activeSubCategory === sub.name.toLowerCase() ? styles.active : ''
                  }`}
                  onClick={() => setActiveSubCategory(sub.name.toLowerCase())}
                >
                  <span>{sub.name}</span>
                  <span className={styles.filterCount}>
                    {products.filter(p =>
                      p.subCategory?.toLowerCase() === sub.name.toLowerCase()
                    ).length}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Price slider */}
          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Price Range</p>
            <div className={styles.priceDisplay}>
              <span>{priceFormatted(priceRange[0])}</span>
              <span>{priceFormatted(priceRange[1])}</span>
            </div>
            <div className={styles.sliderWrap}>
              <input
                type="range"
                min={0} max={MAX_PRICE} step={100}
                value={priceRange[0]}
                className={styles.slider}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val < priceRange[1]) setPriceRange([val, priceRange[1]]);
                }}
              />
              <input
                type="range"
                min={0} max={MAX_PRICE} step={100}
                value={priceRange[1]}
                className={styles.slider}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val > priceRange[0]) setPriceRange([priceRange[0], val]);
                }}
              />
            </div>
          </div>

          {/* Brands */}
          {availableBrands.length > 0 && (
            <div className={styles.filterGroup}>
              <button
                className={styles.filterGroupToggle}
                onClick={() => setBrandsOpen(prev => !prev)}
              >
                <p className={styles.filterLabel}>Brand</p>
                <span className={`${styles.toggleIcon} ${brandsOpen ? styles.toggleOpen : ''}`}>
                  ›
                </span>
              </button>

              {brandsOpen && (
                <div className={styles.brandsContent}>
                  {availableBrands.map(brand => (
                    <label key={brand} className={styles.checkLabel}>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkMark} />
                      <span className={styles.checkText}>{brand}</span>
                      <span className={styles.filterCount}>
                        {products.filter(p => extractBrand(p.name) === brand).length}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <button className={styles.resetBtn} onClick={handleReset}>
            Reset All Filters
          </button>
        </aside>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : (
            <>
              <div className={styles.contentHeader}>
                <p className={styles.count}>
                  <span>{filtered.length}</span> products
                  {hasActiveFilters && ` found`}
                </p>
              </div>

              {filtered.length === 0 ? (
                <div className={styles.noResults}>
                  <p>No products match your filters.</p>
                  <button onClick={handleReset}>Reset filters →</button>
                </div>
              ) : (
                <div className={styles.grid}>
                  {filtered.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}