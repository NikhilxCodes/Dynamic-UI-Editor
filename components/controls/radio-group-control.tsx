"use client"

interface RadioGroupControlProps {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}

export function RadioGroupControl({ label, value, options, onChange }: RadioGroupControlProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium">{label}</label>
      <div className="flex gap-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 cursor-pointer accent-primary"
            />
            <span className="text-xs">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
