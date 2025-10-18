import { DashboardComponent } from "./dashboard-component"
import type { UiConfig } from "@/types/ui-config"

interface LivePreviewProps {
  config: UiConfig
  selectedComponent: string | null
  selectedChildComponent: string | null
  onSelectComponent: (component: string | null) => void
  onSelectChildComponent: (component: string | null) => void
  onNavigate: (page: "home" | "about" | "services") => void
  isEditorOpen: boolean
  onToggleEditor: () => void
}

export function LivePreview({
  config,
  selectedComponent,
  selectedChildComponent,
  onSelectComponent,
  onSelectChildComponent,
  onNavigate,
  isEditorOpen,
  onToggleEditor,
}: LivePreviewProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: config.sectionBackgroundColor }}>
      <DashboardComponent
        config={config}
        selectedComponent={selectedComponent}
        selectedChildComponent={selectedChildComponent}
        onSelectComponent={onSelectComponent}
        onSelectChildComponent={onSelectChildComponent}
        onNavigate={onNavigate}
        isEditorOpen={isEditorOpen}
        onToggleEditor={onToggleEditor}
      />
    </div>
  )
}
