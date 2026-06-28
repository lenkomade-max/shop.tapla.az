'use client';

import React, { useState } from 'react';
import { saveHeroSlide, deleteHeroSlide, reorderHeroSlides } from '@/lib/actions';
import { ImageUp, Trash2, GripVertical, Eye, EyeOff, Sun, Moon, ExternalLink, Plus, X } from 'lucide-react';

interface HeroSlide {
  id: string;
  sort_order: number;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  action_text: string;
  href: string;
  overlay: boolean;
  is_active: boolean;
}

export function AdminHeroClient({ slides: initialSlides }: { slides: HeroSlide[] }) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const handleSaved = () => {
    setEditingId(null);
    setShowNewForm(false);
    window.location.reload();
  };

  const activeSlides = slides.filter(s => s.is_active);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hero — главный слайдер</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {activeSlides.length} активных / {slides.length} всего
          </p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-neutral-950 text-white text-xs px-4 py-2 rounded hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5"
        >
          {showNewForm ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          {showNewForm ? 'Отмена' : 'Новый слайд'}
        </button>
      </div>

      {/* Mini preview */}
      <div className="mb-8 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-950 relative" style={{ height: 180 }}>
        {activeSlides.length > 0 ? (
          <img
            src={activeSlides[0].image || ''}
            alt=""
            className="w-full h-full object-cover opacity-50"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-600 text-sm">
            Нет активных слайдов — Hero скрыт
          </div>
        )}
        {activeSlides.length > 0 && (
          <div className="absolute bottom-3 left-4 text-white">
            <div className="text-[10px] tracking-widest text-neutral-400">
              {activeSlides[0].tag || '—'}
            </div>
            <div className="text-lg font-bold">
              {activeSlides[0].title || '—'}
            </div>
          </div>
        )}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-3 right-4 flex gap-1">
            {activeSlides.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        )}
      </div>

      {/* New slide form */}
      {showNewForm && (
        <div className="mb-8 border border-neutral-200 rounded-lg overflow-hidden bg-white">
          <div className="px-4 py-3 bg-neutral-50 text-sm font-semibold border-b border-neutral-200">
            Новый слайд
          </div>
          <div className="p-4">
            <SlideForm slides={slides} onSaved={handleSaved} />
          </div>
        </div>
      )}

      {/* Slides list */}
      <div className="space-y-3">
        {slides.map((slide) => (
          <div key={slide.id} className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
            {/* Card header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 border-b border-neutral-200">
              <GripVertical className="h-4 w-4 text-neutral-300 flex-shrink-0" />
              <div className="w-14 h-10 rounded overflow-hidden bg-neutral-200 flex-shrink-0">
                {slide.image && (
                  <img src={slide.image} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{slide.title || 'Без заголовка'}</div>
                <div className="text-[10px] text-neutral-400 truncate">{slide.tag}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${
                  slide.overlay
                    ? 'bg-neutral-100 text-neutral-700'
                    : 'bg-amber-50 text-amber-600'
                }`}>
                  {slide.overlay ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${
                  slide.is_active
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {slide.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </span>
              </div>
            </div>

            {/* Edit form or summary */}
            {editingId === slide.id ? (
              <div className="p-4 border-t border-neutral-100">
                <SlideForm slide={slide} slides={slides} onSaved={handleSaved} />
                <button
                  onClick={() => setEditingId(null)}
                  className="mt-2 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  ← Отменить
                </button>
              </div>
            ) : (
              <div className="px-4 py-2 flex items-center justify-between">
                <div className="text-xs text-neutral-500 truncate max-w-[60%]">
                  <span className="font-mono text-xs">{slide.href}</span>
                  <span className="mx-1.5">·</span>
                  &ldquo;{slide.action_text}&rdquo;
                  <span className="mx-1.5">·</span>
                  порядок {slide.sort_order}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEditingId(slide.id)}
                    className="text-xs text-neutral-500 hover:text-neutral-900 px-2 py-1"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('Удалить слайд?')) return;
                      const formData = new FormData();
                      formData.set('id', slide.id);
                      await deleteHeroSlide(formData);
                      window.location.reload();
                    }}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1"
                  >
                    <Trash2 className="h-3 w-3 inline mr-0.5" />
                    Удалить
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {slides.length === 0 && (
          <div className="text-center py-16 text-neutral-400 border border-dashed border-neutral-200 rounded-lg">
            Нет слайдов. Нажмите &laquo;Новый слайд&raquo; чтобы создать первый.
          </div>
        )}
      </div>

      {/* Reorder */}
      {slides.length > 1 && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            await reorderHeroSlides(fd);
            window.location.reload();
          }}
          className="mt-6 p-4 border border-neutral-200 rounded-lg bg-neutral-50"
        >
          <h3 className="text-xs font-semibold tracking-wider text-neutral-500 mb-3">Порядок слайдов</h3>
          <div className="space-y-1.5">
            {slides.map((slide, i) => (
              <div key={slide.id} className="flex items-center gap-3">
                <input type="hidden" name="ids" value={slide.id} />
                <span className="text-xs text-neutral-400 w-5 text-right">{i + 1}.</span>
                <span className="text-xs flex-1 truncate">{slide.title || slide.tag || '(без названия)'}</span>
                <input
                  name="orders"
                  type="number"
                  defaultValue={slide.sort_order}
                  className="w-16 border border-neutral-200 rounded px-2 py-1 text-xs text-center"
                  min={0}
                  max={999}
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-3 bg-neutral-950 text-white text-xs px-4 py-2 rounded hover:bg-neutral-800 transition-colors"
          >
            Обновить порядок
          </button>
        </form>
      )}
    </div>
  );
}

// ——— Slide Form ———

function SlideForm({
  slide,
  slides,
  onSaved,
}: {
  slide?: HeroSlide;
  slides: HeroSlide[];
  onSaved: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(slide?.image || '');

  const uploadImage = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'hero');
    try {
      const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      return data.success ? data.url : null;
    } catch {
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setImagePreview(url);
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (slide) formData.set('id', slide.id);
        await saveHeroSlide(formData);
        onSaved();
      }}
      className="space-y-4"
    >
      {slide && <input type="hidden" name="id" value={slide.id} />}
      <input type="hidden" name="sort_order" value={String(slide?.sort_order ?? slides.length)} />

      {/* Image */}
      <div>
        <label className="block text-[10px] tracking-wider font-semibold text-neutral-500 mb-1.5">
          Изображение
        </label>
        <div className="flex gap-3">
          <div className="w-32 h-20 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0">
            {imagePreview ? (
              <img src={imagePreview} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-300 text-[10px]">Нет фото</div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input
              name="image"
              value={imagePreview}
              onChange={(e) => setImagePreview(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs font-mono"
            />
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 border border-neutral-200 rounded px-3 py-1.5">
                <ImageUp className="h-3 w-3" />
                {uploading ? 'Загрузка...' : 'Загрузить фото'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <span className="text-[10px] text-neutral-400">или вставьте URL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tag + Title */}
      <div>
        <label className="block text-[10px] tracking-wider font-semibold text-neutral-500 mb-1">Тэг (микро-лейбл сверху)</label>
        <input
          name="tag"
          defaultValue={slide?.tag || ''}
          placeholder="ELEKTRONIKADA ƏN YAXŞI SEÇİMLƏR"
          className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs"
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-wider font-semibold text-neutral-500 mb-1">Заголовок</label>
        <input
          name="title"
          defaultValue={slide?.title || ''}
          required
          placeholder="TAPLA MARKETPLACE"
          className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs"
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-wider font-semibold text-neutral-500 mb-1">Подзаголовок</label>
        <input
          name="subtitle"
          defaultValue={slide?.subtitle || ''}
          placeholder="RƏSMİ ZƏMANƏT, ƏN UCUZ QİYMƏTLƏR"
          className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs"
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-wider font-semibold text-neutral-500 mb-1">Описание</label>
        <textarea
          name="description"
          defaultValue={slide?.description || ''}
          rows={2}
          placeholder="Notebook, telefon, planşet və aksesuarlar..."
          className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-wider font-semibold text-neutral-500 mb-1">Текст кнопки</label>
          <input
            name="action_text"
            defaultValue={slide?.action_text || 'MƏHSULLARI GÖR'}
            className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs"
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-wider font-semibold text-neutral-500 mb-1">Ссылка (URL)</label>
          <div className="relative">
            <input
              name="href"
              defaultValue={slide?.href || '/#products'}
              placeholder="/products/..."
              className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs font-mono pr-7"
            />
            <ExternalLink className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-300" />
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6 pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="overlay" defaultChecked={slide?.overlay ?? true} className="rounded border-neutral-300" />
          <span className="text-xs text-neutral-600">Затенение (оверлей)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_active" defaultChecked={slide?.is_active ?? true} className="rounded border-neutral-300" />
          <span className="text-xs text-neutral-600">Активен (показывать)</span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-neutral-950 text-white text-xs py-2.5 rounded hover:bg-neutral-800 transition-colors font-semibold"
      >
        {slide ? 'Сохранить изменения' : 'Создать слайд'}
      </button>
    </form>
  );
}
