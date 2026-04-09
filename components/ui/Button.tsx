type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'pink'
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export default function Button({ children, variant = 'primary', className = '', onClick, disabled = false }: ButtonProps) {
  const base = 'px-5 py-2 rounded font-semibold text-sm transition-all duration-200'
  const variants = {
    primary: 'bg-[var(--color-primary)] rounded-full  text-black hover:bg-[var(--color-primary-dark)]',
    outline: 'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-black',
    pink: 'bg-[var(--color-pink-accent)] text-white hover:opacity-90',
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {children}
    </button>
  )
}