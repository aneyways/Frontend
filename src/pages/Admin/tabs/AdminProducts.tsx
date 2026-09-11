import { useEffect, useState } from 'react';
import {
  getAllProducts, createProduct, deleteProduct,
  updateProduct, getAllCategories, addProductImage,
  deleteProductImage, getSubCategoriesByCategory
} from '../../../services/api';
import type { Product, ProductCreateDto } from '../../../types/product.types';
import styles from './AdminTab.module.css';

const EMPTY_FORM: ProductCreateDto = {
  name: '', description: '', price: 0, categoryId: 0,
  subCategoryId: 0, imageUrl: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductCreateDto>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<{ id: number; url: string }[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([getAllProducts(), getAllCategories()])
      .then(([p, c]) => { setProducts(p); setCategories(c); })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCategoryChange = async (categoryId: number) => {
    setForm(prev => ({ ...prev, categoryId, subCategoryId: 0 }));
    setSubCategories([]);
    if (categoryId === 0) return;
    try {
      const subs = await getSubCategoriesByCategory(categoryId);
      setSubCategories(subs);
    } catch {
      setSubCategories([]);
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setProductImages(prev => [...prev, { id: 0, url: newImageUrl.trim() }]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = async (img: { id: number; url: string }, idx: number) => {
    if (img.id > 0 && editingId) {
      try {
        await deleteProductImage(editingId, img.id);
      } catch { /* ignore */ }
    }
    setProductImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCreate = async () => {
    if (!form.name.trim() || form.price <= 0) {
      setError('Please enter a product name and a valid price.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const newProduct = await createProduct(form);
      for (const img of productImages) {
        await addProductImage(newProduct.id, img.url);
      }
      setForm(EMPTY_FORM);
      setProductImages([]);
      setNewImageUrl('');
      setSubCategories([]);
      setShowForm(false);
      load();
    } catch {
      setError('Failed to create product. Check if category is selected.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (product: Product) => {
  setEditingId(product.id);
  setForm({
    name: product.name,
    description: product.description ?? '',
    price: product.price,
    categoryId: product.categoryId ?? 0,
    subCategoryId: product.subCategoryId ?? 0,
    imageUrl: '',
  });
  setProductImages(product.images?.map(i => ({ id: i.id, url: i.url })) ?? []);
  setNewImageUrl('');
  setShowForm(true);

  // загружаем подкатегории для текущей категории
  if (product.categoryId) {
    try {
      const subs = await getSubCategoriesByCategory(product.categoryId);
      setSubCategories(subs);
    } catch {
      setSubCategories([]);
    }
  }
};

  const handleUpdate = async () => {
    console.log('updating with form:', form);
    if (!editingId || !form.name.trim() || form.price <= 0) {
      setError('Please enter a product name and a valid price.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateProduct(editingId, form);
      for (const img of productImages.filter(i => i.id === 0)) {
        await addProductImage(editingId, img.url);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setProductImages([]);
      setNewImageUrl('');
      setSubCategories([]);
      setShowForm(false);
      load();
    } catch {
      setError('Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      load();
    } catch {
      setError('Failed to delete product.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setProductImages([]);
    setNewImageUrl('');
    setSubCategories([]);
    setError(null);
  };

  return (
    <div>
      <div className={styles.tableHeader}>
        <p className={styles.count}>{products.length} products</p>
        <button
          className={styles.addBtn}
          onClick={() => showForm ? handleCancel() : setShowForm(true)}
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {showForm && (
        <div className={styles.form}>
          <p className={styles.formTitle}>
            {editingId ? `Edit Product #${editingId}` : 'New Product'}
          </p>

          <div className={styles.formGrid}>
            {/* Name */}
            <div className={styles.field}>
              <label>Name *</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Product name"
              />
            </div>

            {/* Price */}
            <div className={styles.field}>
              <label>Price (MDL) *</label>
              <input
               type="number"
               min="0"
              step="0.01"
              value={form.price === 0 ? '' : form.price}
             onChange={e =>
             setForm({
             ...form,
              price: e.target.value === '' ? 0 : Number(e.target.value),
             })}
             placeholder="Enter price"
            />
            </div>

            {/* Category */}
            <div className={styles.field}>
              <label>Category</label>
              <select
                value={form.categoryId}
                onChange={e => handleCategoryChange(Number(e.target.value))}
              >
                <option value={0}>Select category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* SubCategory */}
            <div className={styles.field}>
              <label>
                SubCategory
                {subCategories.length === 0 && form.categoryId !== 0 && (
                  <span className={styles.subCatHint}> — none available</span>
                )}
              </label>
              <select
                value={form.subCategoryId ?? 0}
                onChange={e => setForm({ ...form, subCategoryId: Number(e.target.value) })}
                disabled={subCategories.length === 0}
              >
                <option value={0}>Select subcategory</option>
                {subCategories.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Product description"
                rows={3}
              />
            </div>

            {/* Images manager */}
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label>Images</label>
              <div className={styles.imagesManager}>
                {productImages.map((img, idx) => (
                  <div key={idx} className={styles.imageItem}>
                    <img
                      src={img.url}
                      alt=""
                      className={styles.imageThumb}
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                    <span className={styles.imageUrl}>{img.url}</span>
                    <button
                      className={styles.removeImgBtn}
                      onClick={() => handleRemoveImage(img, idx)}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <div className={styles.addImageRow}>
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    onKeyDown={e => e.key === 'Enter' && handleAddImage()}
                  />
                  <button className={styles.addImageBtn} onClick={handleAddImage}>
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            className={styles.saveBtn}
            onClick={editingId ? handleUpdate : handleCreate}
            disabled={saving}
          >
            {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : products.length === 0 ? (
        <p className={styles.empty}>No products yet. Add your first product.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>SubCategory</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className={styles.idCell}>#{p.id}</td>
                <td>
                  {p.images?.[0]?.url ? (
                    <img
                      src={p.images[0].url}
                      alt={p.name}
                      className={styles.tableImg}
                    />
                  ) : (
                    <div className={styles.noImg}>—</div>
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.category ?? '—'}</td>
                <td>{p.subCategory ?? '—'}</td>
                <td>{p.price.toLocaleString()} MDL</td>
                <td className={styles.actionBtns}>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}