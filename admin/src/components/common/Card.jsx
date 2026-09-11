export default function Card({ children, className = '', padded = true }) {
  return (
    <div
      className={`rounded-2xl border border-black/5 bg-white/70 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-xl ${
        padded ? 'p-5 sm:p-6' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
