'use client';

import React, { useState, useEffect, useCallback, DragEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { saveProduct } from '@/lib/actions';
import { fetchActiveCategories } from '@/lib/actions';
import { Upload, Loader2, X } from 'lucide-react';
import { PriceCalculator } from '@/components/PriceCalculator';

interface Props {
  product?: Record<string, unknown>;
  error?: string;
}

const emptyShade = { name: '', colorHex: '#000000', isHot: false, label: '' };

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export function ProductForm({ product, error: initialError }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  // ─── Form state (all controlled) ─────────────────────────────────
  const [name, setName] = useState((product?.name as string) || (product?.title as string) || '');
  const [slug, setSlug] = useState((product?.slug as string) || '');
  const [slugAuto, setSlugAuto] = useState(!product?.slug);
  const [subtitle, setSubtitle] = useState((product?.subtitle as string) || '');
  const [description, setDescription] = useState((product?.description as string) || '');
  const [category, setCategory] = useState((product?.category as string) || '');
  const [categoryId, setCategoryId] = useState((product?.category_id as string) || '');
  const [categories, setCategories] = useState<Array<{ id: string; slug: string; title: string; parent_id: string | null }>>([]);
  const [howToUse, setHowToUse] = useState((product?.how_to_use as string) || '');
  const [ingredients, setIngredients] = useState((product?.ingredients as string) || '');
  const [supplierUrl, setSupplierUrl] = useState((product?.supplier_url as string) || '');
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : '');
  const [originalPrice, setOriginalPrice] = useState(product?.old_price != null ? String(product.old_price) : '');
  const [rating, setRating] = useState(product?.rating != null ? String(product.rating) : '');
  const [reviewsCount, setReviewsCount] = useState(product?.reviews_count != null ? String(product.reviews_count) : '');
  const [isNew, setIsNew] = useState(Boolean(product?.is_new));
  const [tryOnEnabled, setTryOnEnabled] = useState(Boolean(product?.try_on_enabled));
  const [status, setStatus] = useState((product?.status as string) || 'active');

  const [images, setImages] = useState<string[]>(
    Array.isArray(product?.images) ? (product?.images as string[]) : ['']
  );
  const [benefits, setBenefits] = useState<string[]>(
    Array.isArray(product?.benefits) ? (product?.benefits as string[]) : ['']
  );
  const [tags, setTags] = useState<string[]>(
    Array.isArray(product?.tags) ? (product?.tags as string[]) : ['']
  );
  const [shades, setShades] = useState<typeof emptyShade[]>(
    Array.isArray(product?.shades) ? (product?.shades as typeof emptyShade[]) : [emptyShade]
  );

  // ─── UI state ────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState(initialError || '');

  useEffect(() => {
    fetchActiveCategories().then(setCategories).catch(() => {});
  }, []);

  // ─── File Upload to R2 ───────────────────────────────────────────
  const [uploading, setUploading] = useState(false);
  const [uploadDragOver, setUploadDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToR2 = useCallback(async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) return null;
    if (file.size > 20 * 1024 * 1024) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'products');
      const resp = await fetch('/api/upload-image', { method: 'POST', body: fd });
      if (!resp.ok) { console.error('[Upload] HTTP', resp.status); return null; }
      const data = await resp.json();
      if (data.success && data.url) return data.url as string;
      console.error('[Upload] API error:', data.error);
      return null;
    } catch (err) {
      console.error('[Upload] Network error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFileDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    setUploadDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    for (const file of files) {
      const url = await uploadToR2(file);
      if (url) setImages(prev => [...prev.filter(Boolean), url]);
    }
  }, [uploadToR2]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const url = await uploadToR2(file);
      if (url) setImages(prev => [...prev.filter(Boolean), url]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [uploadToR2]);

  // ─── Вставка из буфера (Ctrl+V / Cmd+V) — глобальный ──────────
  useEffect(() => {
    const onPasteGlobal = async (e: globalThis.ClipboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (blob) {
            const url = await uploadToR2(blob);
            if (url) setImages(prev => [...prev.filter(Boolean), url]);
          }
          break;
        }
      }
    };
    document.addEventListener('paste', onPasteGlobal);
    return () => document.removeEventListener('paste', onPasteGlobal);
  }, [uploadToR2]);

  function onNameChange(v: string) {
    setName(v);
    if (slugAuto) setSlug(slugify(v));
  }

  // ─── Submit handler — ручной, как в vakansiya ──────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');

    // Валидация
    if (!name.trim()) { setSaveError('Ad mütləqdir'); return; }
    if (!slug.trim()) { setSaveError('Slug mütləqdir'); return; }
    if (!price || Number(price) <= 0) { setSaveError('Qiymət mütləqdir'); return; }

    setSubmitting(true);

    try {
      const fd = new FormData();
      if (product?.id) fd.append('id', product.id as string);
      fd.append('name', name.trim());
      fd.append('slug', slug.trim());
      fd.append('subtitle', subtitle);
      fd.append('description', description);
      fd.append('category', category);
      if (categoryId) fd.append('categoryId', categoryId);
      fd.append('price', price);
      if (originalPrice) fd.append('originalPrice', originalPrice);
      fd.append('rating', rating || '0');
      fd.append('reviewsCount', reviewsCount || '0');
      fd.append('howToUse', howToUse);
      if (ingredients) fd.append('ingredients', ingredients);
      if (supplierUrl) fd.append('supplierUrl', supplierUrl);
      fd.append('status', status);
      if (isNew) fd.append('isNew', 'true');
      if (tryOnEnabled) fd.append('tryOnEnabled', 'true');

      images.filter(Boolean).forEach(img => fd.append('images', img));
      benefits.filter(Boolean).forEach(b => fd.append('benefits', b));
      tags.filter(Boolean).forEach(t => fd.append('tags', t));
      fd.append('shades', JSON.stringify(shades.filter(s => s.name)));

      const result = await saveProduct(fd);

      if (!result.success) {
        setSaveError(result.error || 'Xəta baş verdi');
        setSubmitting(false);
        return;
      }

      // Успех — редирект делает клиент
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      console.error('Submit error:', err);
      setSaveError('Gözlənilməz xəta baş verdi');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Основное */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Основное</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium text-zinc-600">Название</label>
            <input value={name} onChange={e => onNameChange(e.target.value)} required
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Slug{' '}
              <button type="button" onClick={() => setSlugAuto(!slugAuto)} className="ml-2 text-xs text-zinc-400 hover:text-black">
                {slugAuto ? 'авто' : 'вручную'}
              </button>
            </label>
            <input value={slug} onChange={e => { setSlug(e.target.value); setSlugAuto(false); }} required
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Категория</label>
            {categories.length > 0 ? (
              <select
                value={categoryId || category}
                onChange={e => {
                  const selected = categories.find(c => c.id === e.target.value);
                  if (selected) { setCategoryId(selected.id); setCategory(selected.title); }
                  else { setCategory(e.target.value); setCategoryId(''); }
                }}
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black bg-white"
              >
                <option value="">— Seçin —</option>
                {categories.filter(c => !c.parent_id).map(root => (
                  <optgroup key={root.id} label={root.title}>
                    <option value={root.id}>{root.title}</option>
                    {categories.filter(c => c.parent_id === root.id).map(sub => (
                      <option key={sub.id} value={sub.id}>&nbsp;&nbsp;└ {sub.title}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ) : (
              <input value={category} onChange={e => setCategory(e.target.value)}
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
            )}
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium text-zinc-600">Подзаголовок</label>
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium text-zinc-600">Описание</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium text-zinc-600">URL поставщика</label>
            <input value={supplierUrl} onChange={e => setSupplierUrl(e.target.value)}
              placeholder="https://..."
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
        </div>
      </section>

      {/* Цены и рейтинг */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Цены и рейтинг</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Цена *</label>
            <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} required
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Старая цена</label>
            <input type="number" step="0.01" min="0" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Рейтинг</label>
            <input type="number" step="0.1" min="0" max="5" value={rating} onChange={e => setRating(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Кол-во отзывов</label>
            <input type="number" step="1" min="0" value={reviewsCount} onChange={e => setReviewsCount(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
        </div>
        <div className="mt-4 flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isNew} onChange={e => setIsNew(e.target.checked)} /> Новинка
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={tryOnEnabled} onChange={e => setTryOnEnabled(e.target.checked)} /> Примерка
          </label>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Статус</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black">
              <option value="active">Активный</option>
              <option value="draft">Черновик</option>
              <option value="archived">Архив</option>
            </select>
          </div>
        </div>
      </section>

      {/* Калькулятор цены */}
      <PriceCalculator
        currentPrice={price}
        onApply={(val) => setPrice(String(val))}
      />

      {/* Изображения */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
          Şəkillər
          <button type="button" onClick={() => setImages([...images, ''])}
            className="ml-3 text-xs font-normal text-zinc-400 hover:text-black">+ URL</button>
        </h3>

        {/* Drag & Drop зона */}
        <div
          onDrop={handleFileDrop}
          onDragOver={e => { e.preventDefault(); setUploadDragOver(true); }}
          onDragLeave={() => setUploadDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer transition mb-4 outline-none focus:border-black ${
            uploadDragOver ? 'border-black bg-zinc-50' : 'border-zinc-300 hover:border-zinc-400'
          }`}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-black mb-2" />
          ) : (
            <Upload className={`h-6 w-6 mb-2 ${uploadDragOver ? 'text-black' : 'text-zinc-300'}`} />
          )}
          <p className="text-sm font-medium text-zinc-600">
            {uploading ? 'Yüklənir...' : 'Şəkili buraxın və ya klikləyin'}
          </p>
          <p className="text-xs text-zinc-400 mt-1">JPG, PNG, WebP • max 20 MB</p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />

        {/* Существующие URL + превью */}
        <div className="space-y-2">
          {images.map((url, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border bg-zinc-50 p-2">
              {url ? (
                <img src={url} alt="" className="h-12 w-12 rounded-md object-cover border shrink-0" />
              ) : (
                <div className="h-12 w-12 rounded-md border bg-zinc-100 flex items-center justify-center shrink-0">
                  <Upload className="h-4 w-4 text-zinc-300" />
                </div>
              )}
              <input
                value={url}
                onChange={e => {
                  const next = [...images];
                  next[i] = e.target.value;
                  setImages(next);
                }}
                placeholder="https://... və ya yuxarıdan şəkil yükləyin"
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
              <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}
                className="text-xs text-red-400 hover:text-red-600 shrink-0 p-1">✕</button>
            </div>
          ))}
        </div>
        {images.some(u => u) && (
          <p className="mt-2 text-xs text-zinc-400">
            {images.filter(Boolean).length} şəkil • R2-ə yüklənmiş URL-lər avtomatik saxlanılır
          </p>
        )}
      </section>

      {/* Преимущества */}
      <ArraySection label="Преимущества" items={benefits} setItems={setBenefits} placeholder="Преимущество" />

      {/* Использование */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Использование</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Как использовать</label>
            <textarea value={howToUse} onChange={e => setHowToUse(e.target.value)} rows={5}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Ингредиенты</label>
            <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} rows={5}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
        </div>
      </section>

      {/* Теги */}
      <ArraySection label="Теги" items={tags} setItems={setTags} placeholder="Тег" compact />

      {/* Оттенки */}
      <ShadesSection shades={shades} setShades={setShades} />

      {saveError && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {saveError}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saxlanılır...
            </>
          ) : (
            isEdit ? 'Dəyişiklikləri saxla' : 'Məhsul yarat'
          )}
        </button>
        <a href="/admin/products" className="text-sm text-zinc-400 hover:text-black">Ləğv et</a>
      </div>
    </form>
  );
}

function ArraySection({
  label, items, setItems, placeholder, compact,
}: {
  label: string; items: string[]; setItems: (v: string[]) => void; placeholder: string; compact?: boolean;
}) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
        {label}
        <button type="button" onClick={() => setItems([...items, ''])} className="ml-3 text-xs font-normal text-zinc-400 hover:text-black">+ Добавить</button>
      </h3>
      <div className={compact ? 'flex flex-wrap gap-2' : 'flex flex-col gap-2'}>
        {items.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={v} onChange={e => { const n = [...items]; n[i] = e.target.value; setItems(n); }}
              placeholder={placeholder}
              className={`rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black ${compact ? 'w-40' : 'block w-full'}`} />
            <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))}
              className="text-xs text-red-400 hover:text-red-600">{compact ? '✕' : 'Удалить'}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ShadesSection({ shades, setShades }: {
  shades: typeof emptyShade[]; setShades: (v: typeof emptyShade[]) => void;
}) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
        Оттенки
        <button type="button" onClick={() => setShades([...shades, { ...emptyShade }])}
          className="ml-3 text-xs font-normal text-zinc-400 hover:text-black">+ Добавить</button>
      </h3>
      {shades.map((s, i) => (
        <div key={i} className="mb-3 flex items-end gap-3 rounded-lg border bg-zinc-50 p-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Название</label>
            <input value={s.name} onChange={e => { const n = [...shades]; n[i] = { ...n[i], name: e.target.value }; setShades(n); }}
              placeholder="Mirvari Ağ" className="block w-36 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Цвет</label>
            <input type="color" value={s.colorHex}
              onChange={e => { const n = [...shades]; n[i] = { ...n[i], colorHex: e.target.value }; setShades(n); }}
              className="h-9 w-12 cursor-pointer rounded border" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Label</label>
            <input value={s.label} onChange={e => { const n = [...shades]; n[i] = { ...n[i], label: e.target.value }; setShades(n); }}
              placeholder="Pearl White" className="block w-28 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <label className="flex items-center gap-1 pb-1 text-xs">
            <input type="checkbox" checked={s.isHot}
              onChange={e => { const n = [...shades]; n[i] = { ...n[i], isHot: e.target.checked }; setShades(n); }} />
            Hot
          </label>
          <button type="button" onClick={() => setShades(shades.filter((_, j) => j !== i))}
            className="mb-1 text-xs text-red-400 hover:text-red-600">Удалить</button>
        </div>
      ))}
    </section>
  );
}
