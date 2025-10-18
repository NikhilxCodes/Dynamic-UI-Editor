"use client"

interface ColorPickerControlProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorPickerControl({ label, value, onChange }: ColorPickerControlProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border border-border"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}
