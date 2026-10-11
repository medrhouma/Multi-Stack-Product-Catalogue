import AdminPanel from '@/components/AdminPanel';
import { getProducts } from '@/lib/api';

export default async function AdminPage() {
  const data = await getProducts({ limit: 50, skip: 0 });
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Workspace</p>
          <h1>Product management</h1>
          <p>Keep your catalogue organised and up to date.</p>
        </div>
        <span className="admin-live-status"><span /> Catalogue live</span>
      </div>
      <AdminPanel products={data.products} />
    </div>
  );
}