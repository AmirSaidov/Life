const variants = {
  accent: 'bg-accent/10 text-accent border border-accent/20',
  accent2: 'bg-accent2/10 text-purple-300 border border-accent2/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  danger: 'bg-danger/10 text-danger border border-danger/20',
  info: 'bg-info/10 text-info border border-info/20',
  neutral: 'bg-white/5 text-muted border border-white/10',
  success: 'bg-green-500/10 text-green-400 border border-green-500/20'
}

export default function Badge({ variant = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.neutral} ${className}`}
    >
      {children}
    </span>
  )
}
