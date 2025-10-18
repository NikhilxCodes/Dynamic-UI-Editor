"use client"

interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  unit?: string
}

export function SliderControl({ label, value, min, max, onChange, unit = "" }: SliderControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium">{label}</label>
        <span className="text-xs bg-muted px-2 py-1 rounded">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  )
}
