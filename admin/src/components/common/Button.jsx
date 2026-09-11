const VARIANTS = {
  primary: 'bg-neutral-900 text-white hover:bg-neutral-700',
  secondary: 'bg-white/80 text-neutral-900 border border-neutral-200 hover:bg-white',
  ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100',
}

export default function Button({ as: Component = 'button', variant = 'primary', className = '', children, ...props }) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
