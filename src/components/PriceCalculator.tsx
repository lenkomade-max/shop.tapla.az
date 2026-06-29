'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Calculator, ChevronDown, ChevronUp, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import {
  calculatePrice,
  type Seasonality,
  type ProductKind,
  type Competition,
} from '@/lib/price-calculator';

// ============================================================================
// Props
// ============================================================================

interface PriceCalculatorProps {
  /** Текущее значение цены в форме (строка, т.к. из input) */
  currentPrice: string;
  /** Колбэк — проставить рассчитанную цену в форму */
  onApply: (price: number) => void;
}

// ============================================================================
// Константы для селектов
// ============================================================================

const SEASON_OPTIONS: { value: Seasonality; label: string; icon: string }[] = [
  { value: 'high',    label: 'Yüksək',   icon: '🔥' },
  { value: 'normal',  label: 'Normal',    icon: '📊' },
  { value: 'low',     label: 'Aşağı',     icon: '❄️' },
];

const KIND_OPTIONS: { value: ProductKind; label: string }[] = [
  { value: 'impulse',   label: 'İmpulsiv' },
  { value: 'normal',    label: 'Adi' },
  { value: 'expensive', label: 'Bahalı / Premium' },
];

const COMPETITION_OPTIONS: { value: Competition; label: string; icon: string }[] = [
  { value: 'low',    label: 'Aşağı rəqabət',  icon: '🟢' },
  { value: 'medium', label: 'Orta rəqabət',   icon: '🟡' },
  { value: 'high',   label: 'Yüksək rəqabət', icon: '🔴' },
];

// ============================================================================
// Компонент
// ============================================================================

export function PriceCalculator({ currentPrice, onApply }: PriceCalculatorProps) {
  const [open, setOpen] = useState(false);

  // --- inputs ---
  const [purchasePrice, setPurchasePrice] = useState('');
  const [seasonality, setSeasonality] = useState<Seasonality>('normal');
  const [productKind, setProductKind] = useState<ProductKind>('normal');
  const [competition, setCompetition] = useState<Competition>('medium');
  const [deliveryCost, setDeliveryCost] = useState('');
  const [adBudgetPercent, setAdBudgetPercent] = useState('');
  const [adBudgetFixed, setAdBudgetFixed] = useState('');

  // --- calc ---
  const result = useMemo(() => {
    const pp = parseFloat(purchasePrice);
    if (!pp || pp <= 0) return null;
    return calculatePrice({
      purchasePrice: pp,
      seasonality,
      productKind,
      competition,
      deliveryCost: parseFloat(deliveryCost) || 0,
      adBudgetPercent: parseFloat(adBudgetPercent) || 0,
      adBudgetFixed: parseFloat(adBudgetFixed) || 0,
    });
  }, [purchasePrice, seasonality, productKind, competition, deliveryCost, adBudgetPercent, adBudgetFixed]);

  const handleApply = useCallback(() => {
    if (result) onApply(result.recommendedPrice);
  }, [result, onApply]);

  // --- helpers ---
  const inputClass = 'block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black bg-white';
  const labelClass = 'mb-1 block text-xs font-medium text-zinc-600';

  return (
    <section className="rounded-xl border bg-white shadow-sm overflow-hidden">
      {/* Шапка — кликабельная */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <Calculator className="h-4 w-4 text-zinc-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
            Qiymət Kalkulyatoru
          </h3>
          <span className="text-[10px] text-zinc-400 font-normal normal-case tracking-normal">
            — tövsiyə olunan qiyməti hesabla
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-zinc-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-zinc-400" />
        )}
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-zinc-100 pt-5">
          {/* Две колонки: входные данные | результат */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ================================================================ */}
            {/* Левая колонка — входные данные                                  */}
            {/* ================================================================ */}
            <div className="space-y-4">
              {/* Закупочная цена */}
              <div>
                <label className={labelClass}>Alış qiyməti (AZN) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={purchasePrice}
                  onChange={e => setPurchasePrice(e.target.value)}
                  placeholder="Məsələn: 15"
                  className={inputClass}
                />
              </div>

              {/* Сезонность */}
              <div>
                <label className={labelClass}>Mövsümilik</label>
                <div className="flex gap-2">
                  {SEASON_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSeasonality(opt.value)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        seasonality === opt.value
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400'
                      }`}
                    >
                      <span className="mr-1">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Тип товара */}
              <div>
                <label className={labelClass}>Məhsul tipi</label>
                <div className="flex gap-2">
                  {KIND_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setProductKind(opt.value)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        productKind === opt.value
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Конкуренция */}
              <div>
                <label className={labelClass}>Rəqabət səviyyəsi</label>
                <div className="flex gap-2">
                  {COMPETITION_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCompetition(opt.value)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        competition === opt.value
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400'
                      }`}
                    >
                      <span className="mr-1">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Доставка + Реклама в一行 */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Çatdırılma (AZN)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={deliveryCost}
                    onChange={e => setDeliveryCost(e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Reklam (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={adBudgetPercent}
                    onChange={e => setAdBudgetPercent(e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Reklam (AZN)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={adBudgetFixed}
                    onChange={e => setAdBudgetFixed(e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* ================================================================ */}
            {/* Правая колонка — результат                                        */}
            {/* ================================================================ */}
            <div>
              {result ? (
                <div className="space-y-5">
                  {/* Три цены — крупно */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Мин */}
                    <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 text-center">
                      <div className="text-[10px] uppercase tracking-wider text-red-500 font-bold mb-1">
                        Minimal
                      </div>
                      <div className="text-lg font-bold font-mono text-red-700">
                        {result.minPrice.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-red-400 mt-0.5">₼</div>
                    </div>

                    {/* Рекомендуемая */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-center ring-1 ring-emerald-300/50 relative">
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                          <Sparkles className="h-2.5 w-2.5" /> Tövsiyə
                        </span>
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold mb-1 mt-1">
                        Tövsiyə
                      </div>
                      <div className="text-xl font-bold font-mono text-emerald-800">
                        {result.recommendedPrice.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-emerald-500 mt-0.5">₼</div>
                    </div>

                    {/* Макс */}
                    <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-center">
                      <div className="text-[10px] uppercase tracking-wider text-amber-500 font-bold mb-1">
                        Maksimal
                      </div>
                      <div className="text-lg font-bold font-mono text-amber-700">
                        {result.maxPrice.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-amber-400 mt-0.5">₼</div>
                    </div>
                  </div>

                  {/* Визуальная шкала */}
                  <div className="relative h-2 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className="absolute inset-y-0 rounded-full bg-gradient-to-r from-red-400 via-emerald-400 to-amber-400"
                      style={{
                        left: '0%',
                        right: '0%',
                      }}
                    />
                    {/* Маркеры */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-red-500 shadow"
                      style={{ left: '5%' }}
                      title="Minimal"
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-600 shadow ring-2 ring-emerald-200"
                      style={{ left: '48%' }}
                      title="Tövsiyə"
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-amber-500 shadow"
                      style={{ left: '90%' }}
                      title="Maksimal"
                    />
                  </div>

                  {/* Детали: маржа и наценка */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-3 space-y-2">
                      <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                        Marja (AZN)
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-red-500">Min</span>
                        <span className="font-mono font-bold">{result.marginMin.toFixed(2)} ₼</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-600">Tövsiyə</span>
                        <span className="font-mono font-bold">{result.marginRec.toFixed(2)} ₼</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-500">Max</span>
                        <span className="font-mono font-bold">{result.marginMax.toFixed(2)} ₼</span>
                      </div>
                    </div>

                    <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-3 space-y-2">
                      <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                        Qazanc (Nailiyyət %)
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-red-500">Min</span>
                        <span className="font-mono font-bold">{result.markupPercentMin}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-600">Tövsiyə</span>
                        <span className="font-mono font-bold">{result.markupPercentRec}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-500">Max</span>
                        <span className="font-mono font-bold">{result.markupPercentMax}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Прибыль */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold mb-1">
                        1 satışdan qazanc
                      </div>
                      <div className="text-lg font-bold font-mono text-emerald-700">
                        {result.profitPerUnit.toFixed(2)} ₼
                      </div>
                    </div>
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold mb-1">
                        100 satışdan qazanc
                      </div>
                      <div className="text-lg font-bold font-mono text-emerald-700">
                        {result.profitPer100.toFixed(2)} ₼
                      </div>
                    </div>
                  </div>

                  {/* Коэффициенты (отладочная инфа, мелко) */}
                  <div className="text-[10px] text-zinc-400 space-y-0.5 pt-1 border-t border-zinc-100">
                    <div className="flex justify-between">
                      <span>Baza multiplikator</span>
                      <span className="font-mono">
                        {result.baseMultiplierMin} – {result.baseMultiplierMax}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Korreksiya ilə</span>
                      <span className="font-mono">
                        {result.adjustedMultiplierMin} – {result.adjustedMultiplierRec} – {result.adjustedMultiplierMax}
                      </span>
                    </div>
                  </div>

                  {/* Кнопка «Tətbiq et» */}
                  <button
                    type="button"
                    onClick={handleApply}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Qiymətə tətbiq et ({result.recommendedPrice.toFixed(2)} ₼)
                  </button>

                  {currentPrice && parseFloat(currentPrice) > 0 && (
                    <div className="text-center">
                      <span className="text-[10px] text-zinc-400">
                        Hazırkı qiymət: <span className="font-mono font-bold">{parseFloat(currentPrice).toFixed(2)} ₼</span>
                        {result.recommendedPrice !== parseFloat(currentPrice) && (
                          <span className="ml-1">
                            {result.recommendedPrice > parseFloat(currentPrice) ? (
                              <TrendingUp className="h-3 w-3 inline text-red-400" />
                            ) : (
                              <TrendingDown className="h-3 w-3 inline text-emerald-400" />
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* Пустое состояние */
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center text-zinc-400">
                  <Calculator className="h-10 w-10 mb-3 text-zinc-200" />
                  <p className="text-xs font-medium">Alış qiymətini daxil edin</p>
                  <p className="text-[10px] mt-1">
                    Kalkulyator tövsiyə olunan satış qiymətini avtomatik hesablayacaq
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
