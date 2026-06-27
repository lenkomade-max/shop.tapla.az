Создай React компонент для безопасной онлайн-оплаты через PASHA Bank.

СТЕК: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion

КОМПОНЕНТ:
'use client' компонент. Два состояния:

1) isRedirecting=false — ЖИВАЯ ЦИКЛИЧНАЯ АНИМАЦИЯ:
- Показывает что оплата реальная и безопасная
- Анимированная банковская карта (тёмно-синяя) с пульсирующим золотым чипом, бесконтактными волнами, номером карты, sweep-бликом
- Парящие зелёные частицы вокруг
- Текст "Təhlükəsiz onlayn ödəniş" и "128-bit SSL • PCI DSS"
- ВСЁ в бесконечном цикле (loop)

2) isRedirecting=true — ПЕРЕХОД К ОПЛАТЕ:
- Текст "Təhlükəsiz ödənişə yönləndirilirsiniz"
- Прогресс-бар (зелёный градиент, 2 секунды заполнения)
- Через 2.5 секунды: window.location.href = redirectUrl

ИНТЕРФЕЙС:
interface Props { isRedirecting: boolean; redirectUrl?: string }

ВАЖНО:
- Этот компонент вставляется ВНУТРИ <label> карточки (у которой уже есть border/padding). У самого компонента НЕ ДОЛЖНО быть border, shadow, или внешних отступов
- Никаких GIF, видео, Lottie — только Framer Motion + CSS
- Мобильная адаптация (от 375px)
- Только Tailwind классы, inline styles только для градиентов
- Логотип PASHA Bank НЕ НУЖЕН — просто текст "PASHA Bank"
- Использовать framer-motion (import { motion } from 'framer-motion')

СДЕЛАЙ 3 РАЗНЫХ ВАРИАНТА ДИЗАЙНА в разных файлах:
1) PashaBankCardV1.tsx — классический (тёмная карта, чип, зелёный акцент)
2) PashaBankCardV2.tsx — минималистичный (светлый, воздушный, акцент на безопасность)
3) PashaBankCardV3.tsx — футуристичный (неоновые эффекты, более агрессивная анимация)

Каждый вариант — полностью самостоятельный файл. Только код, без объяснений.
