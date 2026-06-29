// ============================================================================
// Qiymət Kalkulyatoru — логика расчёта рекомендуемой цены
// ============================================================================

export type Seasonality = 'high' | 'normal' | 'low';
export type ProductKind = 'impulse' | 'normal' | 'expensive';
export type Competition = 'low' | 'medium' | 'high';

export interface PriceInput {
  purchasePrice: number;
  seasonality: Seasonality;
  productKind: ProductKind;
  competition: Competition;
  deliveryCost: number;
  adBudgetPercent: number;
  adBudgetFixed: number;
}

export interface PriceResult {
  baseMultiplierMin: number;
  baseMultiplierMax: number;
  baseMultiplierRec: number;
  adjustedMultiplierMin: number;
  adjustedMultiplierMax: number;
  adjustedMultiplierRec: number;
  minPrice: number;
  recommendedPrice: number;
  maxPrice: number;
  marginMin: number;
  marginRec: number;
  marginMax: number;
  markupPercentMin: number;
  markupPercentRec: number;
  markupPercentMax: number;
  profitPerUnit: number;
  profitPer100: number;
}

// ---- базовый мультипликатор по диапазону закупки ----

interface Bracket {
  min: number;
  max: number;
  multMin: number;
  multMax: number;
}

const BRACKETS: Bracket[] = [
  { min: 0,    max: 10,   multMin: 2.2, multMax: 2.6 },
  { min: 10,   max: 20,   multMin: 2.0, multMax: 2.3 },
  { min: 20,   max: 50,   multMin: 1.8, multMax: 2.0 },
  { min: 50,   max: 100,  multMin: 1.6, multMax: 1.8 },
  { min: 100,  max: Infinity, multMin: 1.4, multMax: 1.6 },
];

function getBaseMultiplier(purchasePrice: number): { min: number; rec: number; max: number } {
  const bracket = BRACKETS.find(b => purchasePrice >= b.min && purchasePrice < b.max)
    ?? BRACKETS[BRACKETS.length - 1];
  const rec = (bracket.multMin + bracket.multMax) / 2;
  return { min: bracket.multMin, rec, max: bracket.multMax };
}

// ---- коэффициенты ----

const SEASONALITY_COEFF: Record<Seasonality, number> = {
  high:   0.15,
  normal: 0.00,
  low:   -0.10,
};

const PRODUCT_KIND_COEFF: Record<ProductKind, number> = {
  impulse:   0.10,
  normal:    0.00,
  expensive: 0.25,
};

const COMPETITION_COEFF: Record<Competition, number> = {
  low:    0.12,
  medium: 0.00,
  high:  -0.12,
};

// ---- главная функция ----

export function calculatePrice(input: PriceInput): PriceResult {
  const { purchasePrice, seasonality, productKind, competition, deliveryCost, adBudgetPercent, adBudgetFixed } = input;

  const base = getBaseMultiplier(purchasePrice);

  const coeff = SEASONALITY_COEFF[seasonality]
              + PRODUCT_KIND_COEFF[productKind]
              + COMPETITION_COEFF[competition];

  const adjMin = base.min + coeff;
  const adjRec = base.rec + coeff;
  const adjMax = base.max + coeff;

  // цена товара = закупка × мультипликатор + доставка + реклама (фикс)
  const adPerUnit = purchasePrice * (adBudgetPercent / 100) + adBudgetFixed;

  const minPrice = round2(purchasePrice * adjMin + deliveryCost + adPerUnit);
  const recommendedPrice = round2(purchasePrice * adjRec + deliveryCost + adPerUnit);
  const maxPrice = round2(purchasePrice * adjMax + deliveryCost + adPerUnit);

  const marginMin = round2(minPrice - purchasePrice);
  const marginRec = round2(recommendedPrice - purchasePrice);
  const marginMax = round2(maxPrice - purchasePrice);

  const markupPercentMin = purchasePrice > 0 ? round1((marginMin / purchasePrice) * 100) : 0;
  const markupPercentRec = purchasePrice > 0 ? round1((marginRec / purchasePrice) * 100) : 0;
  const markupPercentMax = purchasePrice > 0 ? round1((marginMax / purchasePrice) * 100) : 0;

  const profitPerUnit = marginRec;
  const profitPer100 = round2(profitPerUnit * 100);

  return {
    baseMultiplierMin: base.min,
    baseMultiplierMax: base.max,
    baseMultiplierRec: base.rec,
    adjustedMultiplierMin: round2(adjMin),
    adjustedMultiplierMax: round2(adjMax),
    adjustedMultiplierRec: round2(adjRec),
    minPrice,
    recommendedPrice,
    maxPrice,
    marginMin,
    marginRec,
    marginMax,
    markupPercentMin,
    markupPercentRec,
    markupPercentMax,
    profitPerUnit,
    profitPer100,
  };
}

// ============================================================================
// Помощники
// ============================================================================

export function formatAzN(value: number): string {
  return value.toFixed(2) + ' ₼';
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
