'use client';

import React, { useState, useActionState } from 'react';
import { saveProduct } from '@/lib/actions';

interface Props {
  product?: Record<string, unknown>;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

const emptyShade = { name: '', colorHex: '#000000', isHot: false, label: '' };

export function ProductForm({ product }: Props) {
  const isEdit = !!product;

  // Form state
  const [name, setName] = useState((product?.name as string) || (product?.title as string) || '');
  const [slug, setSlug] = useState((product?.slug as string) || '');
  const [slugAuto, setSlugAuto] = useState(!product?.slug);
  const [subtitle, setSubtitle] = useState((product?.subtitle as string) || '');
  const [description, setDescription] = useState((product?.description as string) || '');
  const [category, setCategory] = useState((product?.category as string) || '');
  const [howToUse, setHowToUse] = useState((product?.how_to_use as string) || '');
  const [ingredients, setIngredients] = useState((product?.ingredients as string) || '');

  // Arrays
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

  // useActionState — стандартный React 19 хук для форм
  const [state, formAction, pending] = useActionState(saveProduct, null);

  function onNameChange(v: string) {
    setName(v);
    if (slugAuto) setSlug(slugify(v));
  }

  return (
    <form action={formAction} className="space-y-8">
      {isEdit && <input type="hidden" name="id" value={product?.id as string} />}

      {/* ===== Основное ===== */}
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
              Slug
              <button type="button" onClick={() => setSlugAuto(!slugAuto)}
                className="ml-2 text-xs text-zinc-400 hover:text-black">{slugAuto ? 'авто' : 'вручную'}</button>
            </label>
            <input name="slug" value={slug} onChange={e => { setSlug(e.target.value); setSlugAuto(false); }} required
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Категория</label>
            <input name="category" value={category} onChange={e => setCategory(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
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
        </div>
      </section>

      {/* ===== Цены и рейтинг ===== */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Цены и рейтинг</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Цена</label>
            <input name="price" type="number" step="0.01" defaultValue={product?.price as string ?? ''} required
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Старая цена</label>
            <input name="originalPrice" type="number" step="0.01" defaultValue={product?.old_price as string ?? ''}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Рейтинг</label>
            <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={product?.rating as string ?? ''}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Кол-во отзывов</label>
            <input name="reviewsCount" type="number" defaultValue={product?.reviews_count as string ?? ''}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
        </div>
        <div className="mt-4 flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input name="isNew" type="checkbox" value="true" defaultChecked={Boolean(product?.is_new)} />
            Новинка
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input name="tryOnEnabled" type="checkbox" value="true" defaultChecked={Boolean(product?.try_on_enabled)} />
            Примерка
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

      {/* ===== Изображения ===== */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
          Изображения (URL)
          <button type="button" onClick={() => setImages([...images, ''])}
            className="ml-3 text-xs font-normal text-zinc-400 hover:text-black">+ Добавить</button>
        </h3>
        {images.map((img, i) => (
          <div key={i} className="mb-2 flex items-center gap-2">
            <input name="images" value={img} onChange={e => { const n = [...images]; n[i] = e.target.value; setImages(n); }}
              placeholder="https://example.com/photo.jpg"
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
            <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}
              className="text-xs text-red-400 hover:text-red-600">Удалить</button>
          </div>
        ))}
      </section>

      {/* ===== Benefits ===== */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
          Преимущества
          <button type="button" onClick={() => setBenefits([...benefits, ''])}
            className="ml-3 text-xs font-normal text-zinc-400 hover:text-black">+ Добавить</button>
        </h3>
        {benefits.map((b, i) => (
          <div key={i} className="mb-2 flex items-center gap-2">
            <input name="benefits" value={b} onChange={e => { const n = [...benefits]; n[i] = e.target.value; setBenefits(n); }}
              placeholder="Преимущество"
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
            <button type="button" onClick={() => setBenefits(benefits.filter((_, j) => j !== i))}
              className="text-xs text-red-400 hover:text-red-600">Удалить</button>
          </div>
        ))}
      </section>

      {/* ===== Использование ===== */}
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

      {/* ===== Теги ===== */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
          Теги
          <button type="button" onClick={() => setTags([...tags, ''])}
            className="ml-3 text-xs font-normal text-zinc-400 hover:text-black">+ Добавить</button>
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <input name="tags" value={t} onChange={e => { const n = [...tags]; n[i] = e.target.value; setTags(n); }}
                placeholder="Тег" className="w-40 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
              <button type="button" onClick={() => setTags(tags.filter((_, j) => j !== i))}
                className="text-xs text-red-400 hover:text-red-600">✕</button>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Оттенки ===== */}
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
                placeholder="Mirvari Ağ"
                className="block w-36 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Цвет</label>
              <input type="color" value={s.colorHex} onChange={e => { const n = [...shades]; n[i] = { ...n[i], colorHex: e.target.value }; setShades(n); }}
                className="h-9 w-12 cursor-pointer rounded border" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Label</label>
              <input value={s.label} onChange={e => { const n = [...shades]; n[i] = { ...n[i], label: e.target.value }; setShades(n); }}
                placeholder="Pearl White"
                className="block w-28 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black" />
            </div>
            <label className="flex items-center gap-1 pb-1 text-xs">
              <input type="checkbox" checked={s.isHot} onChange={e => { const n = [...shades]; n[i] = { ...n[i], isHot: e.target.checked }; setShades(n); }} />
              Hot
            </label>
            <button type="button" onClick={() => setShades(shades.filter((_, j) => j !== i))}
              className="mb-1 text-xs text-red-400 hover:text-red-600">Удалить</button>
          </div>
        ))}
        {/* shades → JSON hidden input */}
        <input type="hidden" name="shades" value={JSON.stringify(shades.filter(s => s.name))} />
      </section>

      {/* ===== Error ===== */}
      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</div>
      )}

      {/* ===== Submit ===== */}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending}
          className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">
          {pending ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать товар'}
        </button>
        <a href="/admin/products" className="text-sm text-zinc-400 hover:text-black">Отмена</a>
      </div>

      {/* Немые поля — синхронизируют массивы с FormData */}
      {images.filter(Boolean).map((v, i) => <input key={`hi-${i}`} type="hidden" name="images" value={v} />)}
      {benefits.filter(Boolean).map((v, i) => <input key={`hb-${i}`} type="hidden" name="benefits" value={v} />)}
      {tags.filter(Boolean).map((v, i) => <input key={`ht-${i}`} type="hidden" name="tags" value={v} />)}
    </form>
  );
}
