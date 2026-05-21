export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center text-white">
      <div className="max-w-lg rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-roseglow-200">404</p>
        <h1 className="mt-3 font-display text-4xl">Page not found</h1>
        <p className="mt-3 text-sm leading-7 text-white/70">The page you requested does not exist. Use the navigation sidebar to return to the portfolio.</p>
        <a href="/" className="btn-primary mt-6 inline-flex">
          Return home
        </a>
      </div>
    </main>
  )
}