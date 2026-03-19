export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`glass-card p-5 ${hover ? 'glass-card-hover cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
