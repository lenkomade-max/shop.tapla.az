'use client';

import React, { useState, useEffect } from 'react';
import { saveProduct, fetchActiveCategories } from '@/lib/actions';

interface Props {
  product?: Record<string, unknown>;
  error?: string;
}

const emptyShade = { name: '', colorHex: '#000000', isHot: false, label: '' };

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export function ProductForm({ product, error }: Props) {
  const isEdit = !!product;

  const [name, setName] = useState((product?.name as string) || (product?.title as string) || '');
  const [slug, setSlug] = useState((product?.slug as string) || '');
  const [slugAuto, setSlugAuto] = useState(!product?.slug);
  const [subtitle, setSubtitle] = useState((product?.subtitle as string) || '');
  const [description, setDescription] = useState((product?.description as string) || '');
  const [category, setCategory] = useState((product?.category as string) || '');
  const [categoryId, setCategoryId] = useState((product?.category_id as string) || '');
  const [categories, setCategories] = useState<Array<{ id: string; slug: string; title: string; parent_id: string | null }>>([]);

  useEffect(() => {
    fetchActiveCategories().then(setCategories).catch(() => {})
  }, [])
  const [howToUse, setHowToUse] = useState((product?.how_to_use as string) || '');
  const [ingredients, setIngredients] = useState((product?.ingredients as string) || '');
  const [supplierUrl, setSupplierUrl] = useState((product?.supplier_url as string) || '');

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

  function onNameChange(v: string) {
    setName(v);
    if (slugAuto) setSlug(slugify(v));
  }

  return (
    <form action={saveProduct} className="space-y-8">
      {isEdit && <input type="hidden" name="id" value={product?.id as string} />}

      {/* Основное */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Основное</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium text-zinc-600">Название</label>
            <input name="name" value={name} onChange={e => onNameChange(e.target.value)} required
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Slug{' '}
              <button type="button" onClick={() => setSlugAuto(!slugAuto)} className="ml-2 text-xs text-zinc-400 hover:text-black">
                {slugAuto ? 'авто' : 'вручную'}
              </button>
            </label>
            <input name="slug" value={slug} onChange={e => { setSlug(e.target.value); setSlugAuto(false); }} required
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Категория</label>
            {categories.length > 0 ? (
              <select
                name="category"
                value={categoryId || category}
                onChange={e => {
                  const selected = categories.find(c => c.id === e.target.value)
                  if (selected) {
                    setCategoryId(selected.id)
                    setCategory(selected.title)
                  } else {
                    setCategory(e.target.value)
                  }
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
              <input name="category" value={category} onChange={e => setCategory(e.target.value)}
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
            )}
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium text-zinc-600">Подзаголовок</label>
            <input name="subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium text-zinc-600">Описание</label>
            <textarea name="description" value={description} onChange={e => setDescription(e.target.value)} rows={4}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium text-zinc-600">URL поставщика</label>
            <input name="supplierUrl" value={supplierUrl} onChange={e => setSupplierUrl(e.target.value)}
              placeholder="https://..."
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
        </div>
      </section>

      {/* Цены и рейтинг */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Цены и рейтинг</h3>
        <div className="grid grid-cols-4 gap-4">
          {(['price', 'originalPrice', 'rating', 'reviewsCount'] as const).map(f => (
            <div key={f}>
              <label className="mb-1 block text-xs font-medium text-zinc-600">
                {f === 'price' ? 'Цена' : f === 'originalPrice' ? 'Старая цена' : f === 'rating' ? 'Рейтинг' : 'Кол-во отзывов'}
              </label>
              <input name={f} type="number"
                step={f === 'originalPrice' || f === 'price' ? '0.01' : f === 'rating' ? '0.1' : '1'}
                min={f === 'rating' ? '0' : undefined} max={f === 'rating' ? '5' : undefined}
                defaultValue={f === 'originalPrice' ? (product?.old_price as string ?? '') : (product?.[f] as string ?? '')}
                required={f === 'price'}
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input name="isNew" type="checkbox" value="true" defaultChecked={Boolean(product?.is_new)} /> Новинка
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input name="tryOnEnabled" type="checkbox" value="true" defaultChecked={Boolean(product?.try_on_enabled)} /> Примерка
          </label>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Статус</label>
            <select name="status" defaultValue={(product?.status as string) || 'active'}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black">
              <option value="active">Активный</option>
              <option value="draft">Черновик</option>
              <option value="archived">Архив</option>
            </select>
          </div>
        </div>
      </section>

      {/* Изображения */}
      <ArraySection label="Изображения (URL)" items={images} setItems={setImages} placeholder="https://example.com/photo.jpg" />

      {/* Преимущества */}
      <ArraySection label="Преимущества" items={benefits} setItems={setBenefits} placeholder="Преимущество" />

      {/* Использование */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Использование</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Как использовать</label>
            <textarea name="howToUse" value={howToUse} onChange={e => setHowToUse(e.target.value)} rows={5}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Ингредиенты</label>
            <textarea name="ingredients" value={ingredients} onChange={e => setIngredients(e.target.value)} rows={5}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
        </div>
      </section>

      {/* Теги */}
      <ArraySection label="Теги" items={tags} setItems={setTags} placeholder="Тег" compact />

      {/* Оттенки */}
      <ShadesSection shades={shades} setShades={setShades} />

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="flex items-center gap-4">
        <button type="submit" className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800">
          {isEdit ? 'Сохранить' : 'Создать товар'}
        </button>
        <a href="/admin/products" className="text-sm text-zinc-400 hover:text-black">Отмена</a>
      </div>

      {images.filter(Boolean).map((v, i) => <input key={`img-${i}`} type="hidden" name="images" value={v} />)}
      {benefits.filter(Boolean).map((v, i) => <input key={`ben-${i}`} type="hidden" name="benefits" value={v} />)}
      {tags.filter(Boolean).map((v, i) => <input key={`tag-${i}`} type="hidden" name="tags" value={v} />)}
      <input type="hidden" name="shades" value={JSON.stringify(shades.filter(s => s.name))} />
      <input type="hidden" name="supplierUrl" value={supplierUrl} />
      <input type="hidden" name="categoryId" value={categoryId} />
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
