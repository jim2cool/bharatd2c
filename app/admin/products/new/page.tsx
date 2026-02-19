'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client';

const createProductSchema = z.object({
  title: z.string().min(1, 'Product title is required'),
  cogs: z.number().min(0.01, 'COGS must be greater than 0'),
});

type CreateProductForm = z.infer<typeof createProductSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductForm>({
    resolver: zodResolver(createProductSchema),
  });

  // Client-side store guard
  useEffect(() => {
    const id = getActiveStoreIdClient();
    if (!id) {
      router.replace('/admin/stores');
    } else {
      setStoreId(id);
    }
  }, [router]);

  const onSubmit = async (data: CreateProductForm) => {
    if (!storeId) {
      setServerError('No active store selected');
      return;
    }

    setServerError(null);

    try {
      const res = await fetch('/api/admin/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          cogs: data.cogs,
          store_id: storeId,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.id) {
        setServerError(json?.error || 'Failed to create product');
        return;
      }

      router.push(`/admin/products/${json.id}`);
    } catch (err) {
      setServerError('An unexpected error occurred');
    }
  };

  // Prevent flash while redirecting
  if (!storeId) return null;

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">New Product</h1>
        <p className="text-neutral-500 text-sm font-medium mt-1">Start fresh with a manual entry or use AI for speed.</p>
      </div>



      <div className="h-[1px] bg-neutral-100 w-full" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register('title')}
            type="text"
            placeholder="Product title"
            className={`w-full rounded border px-3 py-2 ${errors.title ? 'border-red-500' : 'border-gray-200'
              }`}
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('cogs', { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="COGS (Cost of Goods)"
            className={`w-full rounded border px-3 py-2 ${errors.cogs ? 'border-red-500' : 'border-gray-200'
              }`}
          />
          {errors.cogs && (
            <p className="text-sm text-red-600 mt-1">{errors.cogs.message}</p>
          )}
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Creating…' : 'Create Product'}
        </button>

        <p className="text-sm text-gray-500">
          Product will be created as <strong>draft</strong>.
          <br />
          Add price, images, and details on the next screen.
        </p>
      </form>
    </div>
  );
}
