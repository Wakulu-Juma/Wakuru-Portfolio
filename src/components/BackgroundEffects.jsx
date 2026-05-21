"use client"

const BackgroundEffects = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_30%),linear-gradient(180deg,rgba(15,10,31,0.2),rgba(15,10,31,0.76))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(183,153,255,0.16),transparent_24%),radial-gradient(circle_at_85%_12%,rgba(255,182,193,0.14),transparent_22%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_18%)]" />
      <div className="absolute inset-0 opacity-60 mix-blend-screen">
        <div className="absolute -top-36 left-10 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,182,193,0.34)_0%,rgba(255,182,193,0.08)_38%,transparent_72%)] blur-[90px] animate-float-slow" />
        <div className="absolute right-[-5rem] top-32 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(183,153,255,0.32)_0%,rgba(183,153,255,0.1)_38%,transparent_72%)] blur-[100px] animate-float-slow [animation-delay:-4s]" />
        <div className="absolute bottom-[-8rem] left-1/3 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,rgba(255,182,193,0.06)_35%,transparent_70%)] blur-[110px] animate-float-slow [animation-delay:-7s]" />
      </div>
      <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(transparent_0%,transparent_95%,rgba(255,255,255,0.18)_100%)] bg-[size:100%_4px] animate-grain" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,10,31,0.15)_55%,rgba(15,10,31,0.5)_100%)]" />
    </div>
  )
}

export default BackgroundEffects
