import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 text-center">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        TAPLA
      </h1>
      <p className="text-lg opacity-60 max-w-md">
        Beauty & Wellness — Tezliklə
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/landing/lash-serum"
          className="px-6 py-3 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors"
        >
          Lash Serum
        </Link>
        <Link
          href="/landing/collagen-mask"
          className="px-6 py-3 rounded-xl bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition-colors"
        >
          Collagen Mask
        </Link>
        <Link
          href="/landing/essential-lash-serum"
          className="px-6 py-3 rounded-xl bg-stone-800 text-white font-medium hover:bg-stone-700 transition-colors"
        >
          Essential Lash Serum
        </Link>
      </div>
    </div>
  )
}
