'use client';

import React, { useState } from 'react';
import { saveProduct } from '@/lib/actions';

interface Props {
  product?: Record<string, unknown>;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export function ProductForm({ product }: Props) {
  const isEdit = !!product;
  const id = product?.id as string | undefined;

  const [name, setName] = useState((product?.name as string) || (product?.title as string) || '');
  const [slug, setSlug] = useState((product?.slug as string) || '');
  const [slugAuto, setSlugAuto] = useState(!product?.slug);
  const [subtitle, setSubtitle] = useState((product?.subtitle as string) || '');
  const [description, setDescription] = useState((product?.description as string) || '');
  const [price, setPrice] = useState(String(product?.price ?? ''));
  const [originalPrice, setOriginalPrice] = useState(String(product?.old_price ?? ''));
  const [rating, setRating] = useState(String(product?.rating ?? ''));
  const [reviewsCount, setReviewsCount] = useState(String(product?.reviews_count ?? ''));
  const [category, setCategory] = useState((product?.category as string) || '');
  const [status, setStatus] = useState((product?.status as string) || 'active');
  const [howToUse, setHowToUse] = useState((product?.how_to_use as string) || '');
  const [ingredients, setIngredients] = useState((product?.ingredients as string) || '');
  const [isNew, setIsNew] = useState(Boolean(product?.is_new));
  const [tryOnEnabled, setTryOnEnabled] = useState(Boolean(product?.try_on_enabled));

  const [images, setImages] = useState<string[]>(
    Array.isArray(product?.images) ? product!.images as string[] : ['']
  );
  const [benefits, setBenefits] = useState<string[]>(
    Array.isArray(product?.benefits) ? product!.benefits as string[] : ['']
  );
  const [tags, setTags] = useState<string[]>(
    Array.isArray(product?.tags) ? product!.tags as string[] : ['']
  );
  const [shades, setShades] = useState<{ name: string; colorHex: string; isHot: boolean; label: string }[]>(
    Array.isArray(product?.shades) ? product!.shades as any[] : [{ name: '', colorHex: '#000000', isHot: false, label: '' }]
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleNameChange(v: string) {
    setName(v);
    if (slugAuto) setSlug(slugify(v));
  }

  function addItem<T>(arr: T[], setter: (v: T[]) => void, empty: T) {
    setter([...arr, empty]);
  }
  function removeItem<T>(arr: T[], setter: (v: T[]) => void, idx: number) {
    const next = arr.filter((_, i) => i !== idx);
    setter(next.length ? next : [arr[0]]);
  }
  function updateItem(arr: string[], setter: (v: string[]) => void, idx: number, val: string) {
    const next = [...arr]; next[idx] = val; setter(next);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!slug) { setError('Slug обязателен'); return; }
    setSaving(true);
    setError('');

    const form = new FormData(e.currentTarget);
    form.set('id', id || '');
    form.set('name', name);
    form.set('slug', slug);
    form.set('subtitle', subtitle);
    form.set('description', description);
    form.set('price', price);
    form.set('originalPrice', originalPrice);
    form.set('rating', rating);
    form.set('reviewsCount', reviewsCount);
    form.set('category', category);
    form.set('status', status);
    form.set('howToUse', howToUse);
    form.set('ingredients', ingredients);
    form.set('isNew', String(isNew));
    form.set('tryOnEnabled', String(tryOnEnabled));
    form.set('shades', JSON.stringify(shades.filter(s => s.name)));

    // Replace array fields
    form.delete('images[]');
    images.filter(Boolean).forEach(v => form.append('images[]', v));
    form.delete('benefits[]');
    benefits.filter(Boolean).forEach(v => form.append('benefits[]', v));
    form.delete('tags[]');
    tags.filter(Boolean).forEach(v => form.append('tags[]', v));

    const result = await saveProduct(form);
    if (result?.error) {
      setError(result.error);
      setSaving(false);
    }
    // success → redirect happens in server action
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Основное */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Основное</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium text-zinc-600">Название *</label>
            <input value={name} onChange={e => handleNameChange(e.target.value)} required
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Slug
              <button type="button" onClick={() => setSlugAuto(!slugAuto)}
                className="ml-2 text-xs text-zinc-400 hover:text-black">{slugAuto ? 'авто' : 'вручную'}</button>
            </label>
            <input value={slug} onChange={e => { setSlug(e.target.value); setSlugAuto(false); }} required
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Категория</label>
            <input value={category} onChange={e => setCategory(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
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
        </div>
      </section>

      {/* Цены и рейтинг */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Цены и рейтинг</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Цена *</label>
            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Старая цена</label>
            <input type="number" step="0.01" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Рейтинг</label>
            <input type="number" step="0.1" min="0" max="5" value={rating} onChange={e => setRating(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Кол-во отзывов</label>
            <input type="number" value={reviewsCount} onChange={e => setReviewsCount(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
        </div>
        <div className="mt-4 flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isNew} onChange={e => setIsNew(e.target.checked)} />
            Новинка (is_new)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={tryOnEnabled} onChange={e => setTryOnEnabled(e.target.checked)} />
            Примерка (try_on_enabled)
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

      {/* Изображения */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
          Изображения (URL)
          <button type="button" onClick={() => addItem(images, setImages, '')}
            className="ml-3 text-xs font-normal text-zinc-400 hover:text-black">+ Добавить</button>
        </h3>
        <div className="flex flex-col gap-2">
          {images.map((img, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={img} onChange={e => updateItem(images, setImages, i, e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
              <button type="button" onClick={() => removeItem(images, setImages, i)}
                className="text-xs text-red-400 hover:text-red-600">Удалить</button>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
          Преимущества (benefits)
          <button type="button" onClick={() => addItem(benefits, setBenefits, '')}
            className="ml-3 text-xs font-normal text-zinc-400 hover:text-black">+ Добавить</button>
        </h3>
        <div className="flex flex-col gap-2">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={b} onChange={e => updateItem(benefits, setBenefits, i, e.target.value)}
                placeholder="Преимущество"
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
              <button type="button" onClick={() => removeItem(benefits, setBenefits, i)}
                className="text-xs text-red-400 hover:text-red-600">Удалить</button>
            </div>
          ))}
        </div>
      </section>

      {/* Использование / Ингредиенты */}
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

      {/* Tags */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
          Теги (tags)
          <button type="button" onClick={() => addItem(tags, setTags, '')}
            className="ml-3 text-xs font-normal text-zinc-400 hover:text-black">+ Добавить</button>
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={t} onChange={e => updateItem(tags, setTags, i, e.target.value)}
                placeholder="Тег" className="w-40 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
              <button type="button" onClick={() => removeItem(tags, setTags, i)}
                className="text-xs text-red-400 hover:text-red-600">✕</button>
            </div>
          ))}
        </div>
      </section>

      {/* Оттенки */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
          Оттенки (shades)
          <button type="button" onClick={() => addItem(shades, setShades as any, { name: '', colorHex: '#000000', isHot: false, label: '' })}
            className="ml-3 text-xs font-normal text-zinc-400 hover:text-black">+ Добавить</button>
        </h3>
        <div className="flex flex-col gap-3">
          {shades.map((s, i) => (
            <div key={i} className="flex items-end gap-3 rounded-lg border bg-zinc-50 p-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Название</label>
                <input value={s.name} onChange={e => {
                  const n = [...shades]; n[i] = { ...n[i], name: e.target.value }; setShades(n);
                }} placeholder="Mirvari Ağ" className="block w-36 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Цвет</label>
                <input type="color" value={s.colorHex} onChange={e => {
                  const n = [...shades]; n[i] = { ...n[i], colorHex: e.target.value }; setShades(n);
                }} className="h-9 w-12 cursor-pointer rounded border" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Label</label>
                <input value={s.label} onChange={e => {
                  const n = [...shades]; n[i] = { ...n[i], label: e.target.value }; setShades(n);
                }} placeholder="Pearl White" className="block w-28 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
              </div>
              <label className="flex items-center gap-1 pb-1 text-xs">
                <input type="checkbox" checked={s.isHot} onChange={e => {
                  const n = [...shades]; n[i] = { ...n[i], isHot: e.target.checked }; setShades(n);
                }} />
                Hot
              </label>
              <button type="button" onClick={() => removeItem(shades, setShades as any, i)}
                className="mb-1 text-xs text-red-400 hover:text-red-600">Удалить</button>
            </div>
          ))}
        </div>
      </section>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving}
          className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">
          {saving ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать товар'}
        </button>
        <a href="/admin/products" className="text-sm text-zinc-400 hover:text-black">Отмена</a>
      </div>
    </form>
  );
}
