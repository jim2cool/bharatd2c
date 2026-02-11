'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client';

export default function NewProductPage() {
  const router = useRouter();

  const [storeId, setStoreId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [cogs, setCogs] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client-side store guard
  useEffect(() => {
    const id = getActiveStoreIdClient();
    if (!id) {
      router.replace('/admin/stores');
    } else {
      setStoreId(id);
    }
  }, [router]);

  async function handleCreate() {
    if (!storeId) {
      setError('No active store selected');
      return;
    }

    if (!title.trim()) {
      setError('Product title is required');
      return;
    }

    if (!cogs || Number(cogs) <= 0) {
      setError('Valid COGS is required');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch('/api/admin/products/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        cogs: Number(cogs),
        store_id: storeId,
      }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok || !json.id) {
      setError(json?.error || 'Failed to create product');
      return;
    }

    router.push(`/admin/products/${json.id}`);
  }

  // Prevent flash while redirecting
  if (!storeId) return null;

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">New Product</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />

        <input
          type="number"
          placeholder="COGS (Cost of Goods)"
          value={cogs}
          onChange={(e) => setCogs(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Create Product'}
        </button>

        <p className="text-sm text-gray-500">
          Product will be created as <strong>draft</strong>.
          <br />
          Add price, images, and details on the next screen.
        </p>
      </div>
    </div>
  );
}
