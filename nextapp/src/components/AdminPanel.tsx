'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Product, ProductInput } from '@/types/product';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
const empty: ProductInput = { title: '', description: '', price: 0, thumbnail: '', stock: 0, category: '' };

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

export default function AdminPanel({ products }: { products: Product[] }) {
  const router = useRouter();
  const [form, setForm] = useState<ProductInput>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const filteredProducts = products.filter((product) =>
    `${product.title} ${product.category.name}`.toLowerCase().includes(query.toLowerCase()),
  );
  const lowStock = products.filter((product) => product.stock < 10).length;
  const categories = new Set(products.map((product) => product.category.name)).size;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const res = await fetch(editingId ? `${API}/products/${editingId}` : `${API}/products`, {
      method: editingId ? 'PATCH' : 'POST',
      headers: authHeaders(),
      body: JSON.stringify(form),
    });
    if (res.status === 401) {
      setMessage('Please log in first (session missing or expired).');
    } else if (!res.ok) {
      setMessage('Request failed. Check the fields (URL must start with https://).');
    } else {
      setMessage(editingId ? 'Product updated successfully.' : 'Product created successfully.');
      setForm(empty);
      setEditingId(null);
      router.refresh();
    }
    setSaving(false);
  }

  async function remove(id: number) {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`${API}/products/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.status === 401) {
      setMessage('Please log in first (session missing or expired).');
    } else if (!res.ok) {
      setMessage('Delete failed. Please try again.');
    } else {
      setMessage('Product deleted successfully.');
      router.refresh();
    }
  }

  function edit(p: Product) {
    setEditingId(p.id);
    setForm({ title: p.title, description: p.description, price: p.price, thumbnail: p.thumbnail, stock: p.stock, category: p.category.name });
  }

  return (
    <>
      <div className="admin-stats">
        <div className="admin-stat-card"><span className="admin-stat-icon">▦</span><div><strong>{products.length}</strong><span>Total products</span></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon admin-stat-icon-blue">◈</span><div><strong>{categories}</strong><span>Categories</span></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon admin-stat-icon-orange">!</span><div><strong>{lowStock}</strong><span>Low stock</span></div></div>
      </div>

      <section className="admin-form-card">
        <div className="admin-section-heading">
          <div><p className="admin-eyebrow">{editingId ? 'Update listing' : 'New listing'}</p><h2>{editingId ? 'Edit product' : 'Add a product'}</h2></div>
          {editingId && <span className="admin-editing-label">Editing product #{editingId}</span>}
        </div>
        <form onSubmit={submit} className="admin-form-grid">
          <label className="admin-field-wide">Title<input placeholder="e.g. Wireless headphones" required minLength={2} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Price<input type="number" step="0.01" min="0.01" placeholder="0.00" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></label>
          <label>Stock<input type="number" min="0" placeholder="0" required value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></label>
          <label>Category<input placeholder="e.g. Audio" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
          <label>Thumbnail URL<input type="url" placeholder="https://..." required value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} /></label>
          <label className="admin-field-wide">Description<textarea rows={3} placeholder="Describe the product..." required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <div className="admin-form-actions admin-field-wide">
            <button className="admin-primary-button" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update product' : 'Create product'} <span>→</span></button>
            {editingId && <button type="button" className="admin-secondary-button" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</button>}
          </div>
        </form>
      </section>

      {message && <p className="admin-message" role="status">{message}</p>}

      <section className="admin-list-card">
        <div className="admin-list-heading">
          <div><p className="admin-eyebrow">Inventory</p><h2>All products <span>{products.length}</span></h2></div>
          <input className="admin-search" type="search" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th className="admin-actions-column">Actions</th></tr></thead>
            <tbody>{filteredProducts.map((p) => (
              <tr key={p.id}>
                <td><div className="admin-product-cell"><img src={p.thumbnail} alt="" /><strong>{p.title}</strong></div></td>
                <td><span className="admin-category">{p.category.name}</span></td>
                <td className="admin-price">${p.price.toFixed(2)}</td>
                <td><span className={`admin-stock ${p.stock < 10 ? 'admin-stock-low' : ''}`}>{p.stock} {p.stock < 10 ? 'low' : 'in stock'}</span></td>
                <td className="admin-actions"><button onClick={() => edit(p)}>Edit</button><button onClick={() => remove(p.id)}>Delete</button></td>
              </tr>
            ))}</tbody>
          </table>
          {filteredProducts.length === 0 && <p className="admin-empty">No products match your search.</p>}
        </div>
      </section>
    </>
  );
}
