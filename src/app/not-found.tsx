import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-lg opacity-60">Səhifə tapılmadı</p>
      <Link href="/" className="px-6 py-3 rounded-xl bg-black text-white font-medium hover:opacity-80 transition-opacity">
        Ana səhifə
      </Link>
    </div>
  )
}
