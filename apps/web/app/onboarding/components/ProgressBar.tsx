interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i + 1 <= current ? 'bg-primary' : 'bg-muted'
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-2 shrink-0">
        {current}/{total}
      </span>
    </div>
  )
}
