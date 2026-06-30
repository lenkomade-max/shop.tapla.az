/**
 * Авто-цвета для категорий.
 * По sort_order циклически → палитра из 8 цветов.
 * Новые категории автоматически получают цвет без обновления кода.
 * Повторов нет пока категорий ≤ 8, дальше цикл.
 */

const PALETTE: { active: string; inactive: string }[] = [
  {
    active: 'text-emerald-600 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-emerald-600',
    inactive: 'text-emerald-600',
  },
  {
    active: 'text-blue-600 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600',
    inactive: 'text-blue-600',
  },
  {
    active: 'text-amber-600 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-amber-500',
    inactive: 'text-amber-600',
  },
  {
    active: 'text-violet-600 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-violet-600',
    inactive: 'text-violet-600',
  },
  {
    active: 'text-rose-600 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-rose-600',
    inactive: 'text-rose-600',
  },
  {
    active: 'text-teal-600 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-teal-600',
    inactive: 'text-teal-600',
  },
  {
    active: 'text-cyan-600 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-cyan-600',
    inactive: 'text-cyan-600',
  },
  {
    active: 'text-fuchsia-600 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-fuchsia-600',
    inactive: 'text-fuchsia-600',
  },
];

/**
 * Выдаёт цвет по sortOrder.
 * sortOrder 1..8 → цвета без повторов, 9+ → цикл сначала.
 */
export function getCategoryTabColors(sortOrder: number): { active: string; inactive: string } {
  return PALETTE[(sortOrder - 1) % PALETTE.length];
}
