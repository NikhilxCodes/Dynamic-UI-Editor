"use client"

import type React from "react"

import { ChevronDown } from "lucide-react"

interface ControlGroupProps {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function ControlGroup({ title, isExpanded, onToggle, children }: ControlGroupProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-muted hover:bg-muted/80 transition-colors"
      >
        <span className="font-semibold text-sm">{title}</span>
        <ChevronDown size={16} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>
      {isExpanded && <div className="p-3 space-y-3 border-t border-border">{children}</div>}
    </div>
  )
}
