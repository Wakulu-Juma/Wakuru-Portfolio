const BackgroundEffects = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-roseglow-400/30 blur-[120px] animate-blob" />
      <div className="absolute top-1/3 -left-24 h-[320px] w-[320px] rounded-full bg-roseglow-500/20 blur-[110px] animate-blob" />
      <div className="absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-roseglow-300/25 blur-[120px] animate-blob" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(32,10,24,0.7),rgba(10,5,10,0.95))]" />
    </div>
  )
}

export default BackgroundEffects
