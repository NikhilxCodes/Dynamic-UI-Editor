"use client"

import { useState } from "react"
import type { UiConfig } from "@/types/ui-config"
import { ControlGroup } from "./control-group"
import { SliderControl } from "./controls/slider-control"
import { DropdownControl } from "./controls/dropdown-control"
import { ColorPickerControl } from "./controls/color-picker-control"
import { RadioGroupControl } from "./controls/radio-group-control"
import { ImageGalleryControl } from "./controls/image-gallery-control"

interface EditorPanelProps {
  config: UiConfig
  selectedComponent: string | null
  selectedChildComponent: string | null
  onUpdateConfig: (updates: Partial<UiConfig>) => void
  onSelectComponent: (component: string | null) => void
  onSelectChildComponent: (component: string | null) => void
  onUpdateComponentStyle: (component: string, style: Record<string, any>) => void
  onUpdateChildComponentImages: (componentId: string, images: string[]) => void
  onUpdateComponentBackgroundImage: (component: string, image: string) => void
  onUpdateComponentTextContent: (component: string, text: string) => void
  onUpdateComponentTitle: (component: string, title: string) => void
  onUpdateComponentDescription: (component: string, description: string) => void
  onResetConfig: () => void
  onExportConfig: () => void
  onCloseEditor?: () => void
}

export function EditorPanel({
  config,
  selectedComponent,
  selectedChildComponent,
  onUpdateConfig,
  onSelectComponent,
  onSelectChildComponent,
  onUpdateComponentStyle,
  onUpdateChildComponentImages,
  onUpdateComponentBackgroundImage,
  onUpdateComponentTextContent,
  onUpdateComponentTitle,
  onUpdateComponentDescription,
  onResetConfig,
  onExportConfig,
  onCloseEditor,
}: EditorPanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set([
      "Site Settings",
      "Typography",
      "Button",
      "Gallery",
      "Layout",
      "Stroke",
      "Component Styling",
      "Background",
      "Spacing",
      "Border",
    ]),
  )
  const [editMode, setEditMode] = useState<"site" | "component">("site")

  const toggleGroup = (group: string) => {
    const newGroups = new Set(expandedGroups)
    if (newGroups.has(group)) {
      newGroups.delete(group)
    } else {
      newGroups.add(group)
    }
    setExpandedGroups(newGroups)
  }

  const componentStyle = selectedComponent ? config.componentStyles[selectedComponent] || {} : {}
  const childComponentStyle = selectedChildComponent ? config.componentStyles[selectedChildComponent] || {} : {}
  const childComponentGalleryStyle = selectedChildComponent
    ? config.childComponentGalleryStyles?.[selectedChildComponent] || {}
    : {}

  const getChildComponentImages = (componentId: string) => {
    return config.childComponentImages?.[componentId] || []
  }

  const updateChildComponentImages = (componentId: string, images: string[]) => {
    onUpdateChildComponentImages(componentId, images)
  }

  const updateChildComponentGalleryStyle = (componentId: string, style: Record<string, any>) => {
    const updatedGalleryStyles = { ...config.childComponentGalleryStyles }
    updatedGalleryStyles[componentId] = { ...updatedGalleryStyles[componentId], ...style }
    onUpdateConfig({ childComponentGalleryStyles: updatedGalleryStyles })
  }

  const updateFeatureImages = (images: string[]) => {
    const updatedPages = { ...config.pages }
    const currentPage = updatedPages[config.currentPage]
    const featureSection = currentPage.sections.find((s) => s.id === "features")
    if (featureSection) {
      featureSection.images = images
      onUpdateConfig({ pages: updatedPages })
    }
  }

  const getFeatureImages = () => {
    const currentPage = config.pages[config.currentPage]
    const featureSection = currentPage.sections.find((s) => s.id === "features")
    return featureSection?.images || []
  }

  const getChildComponentName = () => {
    if (!selectedChildComponent) return ""
    if (selectedChildComponent.startsWith("feature-card-")) {
      const cardNum = selectedChildComponent.split("-")[2]
      return `Feature Card ${cardNum}`
    }
    if (selectedChildComponent.startsWith("service-card-")) {
      const cardNum = selectedChildComponent.split("-")[2]
      return `Service Card ${cardNum}`
    }
    if (selectedChildComponent.startsWith("footer-link-")) {
      return `Footer Link`
    }
    if (selectedChildComponent === "hero-button") return "Hero Button"
    if (selectedChildComponent === "cta-button") return "CTA Button"
    return selectedChildComponent
  }

  return (
    <div className="flex flex-col h-full bg-card">
      <div
        className="sticky top-0 bg-card border-b border-border p-2 lg:p-4 z-10 flex items-center justify-between flex-shrink-0"
        data-editor-header
      >
        <h2 className="text-sm lg:text-lg font-bold">Editor Controls</h2>
        {onCloseEditor && (
          <button
            onClick={onCloseEditor}
            className="p-1 hover:bg-secondary rounded transition-colors"
            title="Close editor"
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex gap-1 lg:gap-2 px-2 lg:px-4 pt-2 lg:pt-4 flex-shrink-0">
        <button
          onClick={() => setEditMode("site")}
          className={`flex-1 px-2 lg:px-3 py-1 lg:py-2 rounded text-xs lg:text-sm font-medium transition-colors ${
            editMode === "site"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:opacity-80"
          }`}
        >
          Site Settings
        </button>
        <button
          onClick={() => setEditMode("component")}
          className={`flex-1 px-2 lg:px-3 py-1 lg:py-2 rounded text-xs lg:text-sm font-medium transition-colors ${
            editMode === "component"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:opacity-80"
          }`}
        >
          Component
        </button>
      </div>

      <p className="text-xs px-2 lg:px-4 pt-2 lg:pt-3 pb-1 lg:pb-2 flex-shrink-0 text-muted-foreground">
        {editMode === "site"
          ? "Edit site-wide settings"
          : selectedChildComponent
            ? `Editing: ${getChildComponentName()}`
            : selectedComponent
              ? `Editing: ${selectedComponent}`
              : "Click a component to edit"}
      </p>

      {selectedComponent && selectedChildComponent && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 lg:px-4 pb-1 lg:pb-2 flex-shrink-0">
          <button onClick={() => onSelectChildComponent(null)} className="text-primary hover:underline">
            {selectedComponent}
          </button>
          <span>/</span>
          <span className="text-primary-foreground font-medium">{getChildComponentName()}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 lg:p-4 space-y-3 lg:space-y-4 min-h-0">
        {editMode === "site" && (
          <>
            <ControlGroup
              title="Site Settings"
              isExpanded={expandedGroups.has("Site Settings")}
              onToggle={() => toggleGroup("Site Settings")}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs lg:text-sm font-medium mb-1">Site Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          const imageData = event.target?.result as string
                          onUpdateConfig({ siteLogo: imageData })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-background border border-border rounded text-xs lg:text-sm"
                  />
                </div>
                {config.siteLogo && (
                  <div className="space-y-2">
                    <img
                      src={config.siteLogo || "/placeholder.svg"}
                      alt="Logo preview"
                      className="w-full h-12 lg:h-16 object-contain rounded"
                    />
                    <button
                      onClick={() => onUpdateConfig({ siteLogo: undefined })}
                      className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-red-500/20 text-red-500 rounded text-xs lg:text-sm hover:bg-red-500/30 transition-colors"
                    >
                      Remove Logo
                    </button>
                  </div>
                )}
                <RadioGroupControl
                  label="Logo Position"
                  value={config.siteLogoPosition || "left"}
                  options={[
                    { value: "left", label: "Left" },
                    { value: "center", label: "Center" },
                    { value: "right", label: "Right" },
                  ]}
                  onChange={(value) => onUpdateConfig({ siteLogoPosition: value as "left" | "center" | "right" })}
                />
                <SliderControl
                  label="Logo Size"
                  value={config.siteLogoSize || 40}
                  min={20}
                  max={100}
                  onChange={(value) => onUpdateConfig({ siteLogoSize: value })}
                  unit="px"
                />
                <div>
                  <label className="block text-xs lg:text-sm font-medium mb-1">Site Name</label>
                  <input
                    type="text"
                    value={config.siteName}
                    onChange={(e) => onUpdateConfig({ siteName: e.target.value })}
                    className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-background border border-border rounded text-xs lg:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs lg:text-sm font-medium mb-1">Site Description</label>
                  <textarea
                    value={config.siteDescription}
                    onChange={(e) => onUpdateConfig({ siteDescription: e.target.value })}
                    className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-background border border-border rounded text-xs lg:text-sm"
                    rows={2}
                  />
                </div>
                <DropdownControl
                  label="Grid Layout"
                  value={config.gridLayout || "3"}
                  options={[
                    { value: "1", label: "1 Column" },
                    { value: "2", label: "2 Columns" },
                    { value: "3", label: "3 Columns" },
                    { value: "4", label: "4 Columns" },
                  ]}
                  onChange={(value) => onUpdateConfig({ gridLayout: value as "1" | "2" | "3" | "4" })}
                />
              </div>
            </ControlGroup>

            {/* Typography */}
            <ControlGroup
              title="Typography"
              isExpanded={expandedGroups.has("Typography")}
              onToggle={() => toggleGroup("Typography")}
            >
              <DropdownControl
                label="Font Family"
                value={config.fontFamily}
                options={[
                  { value: "Inter", label: "Inter" },
                  { value: "Roboto", label: "Roboto" },
                  { value: "Poppins", label: "Poppins" },
                ]}
                onChange={(value) => onUpdateConfig({ fontFamily: value as UiConfig["fontFamily"] })}
              />
              <DropdownControl
                label="Font Weight"
                value={config.fontWeight}
                options={[
                  { value: "400", label: "Regular (400)" },
                  { value: "500", label: "Medium (500)" },
                  { value: "600", label: "Semibold (600)" },
                  { value: "700", label: "Bold (700)" },
                ]}
                onChange={(value) => onUpdateConfig({ fontWeight: value as UiConfig["fontWeight"] })}
              />
              <SliderControl
                label="Base Font Size"
                value={config.baseFontSize}
                min={10}
                max={60}
                onChange={(value) => onUpdateConfig({ baseFontSize: value })}
                unit="px"
              />
            </ControlGroup>

            {/* Button */}
            <ControlGroup
              title="Button"
              isExpanded={expandedGroups.has("Button")}
              onToggle={() => toggleGroup("Button")}
            >
              <SliderControl
                label="Border Radius"
                value={config.buttonBorderRadius}
                min={0}
                max={20}
                onChange={(value) => onUpdateConfig({ buttonBorderRadius: value })}
                unit="px"
              />
              <DropdownControl
                label="Shadow"
                value={config.buttonShadow}
                options={[
                  { value: "none", label: "None" },
                  { value: "sm", label: "Small" },
                  { value: "md", label: "Medium" },
                  { value: "lg", label: "Large" },
                ]}
                onChange={(value) => onUpdateConfig({ buttonShadow: value as UiConfig["buttonShadow"] })}
              />
              <RadioGroupControl
                label="Alignment"
                value={config.buttonAlignment}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
                onChange={(value) => onUpdateConfig({ buttonAlignment: value as UiConfig["buttonAlignment"] })}
              />
              <ColorPickerControl
                label="Background Color"
                value={config.buttonBackgroundColor}
                onChange={(value) => onUpdateConfig({ buttonBackgroundColor: value })}
              />
              <ColorPickerControl
                label="Text Color"
                value={config.buttonTextColor}
                onChange={(value) => onUpdateConfig({ buttonTextColor: value })}
              />
            </ControlGroup>

            {/* Gallery/Images */}
            <ControlGroup
              title="Gallery"
              isExpanded={expandedGroups.has("Gallery")}
              onToggle={() => toggleGroup("Gallery")}
            >
              <RadioGroupControl
                label="Alignment"
                value={config.galleryAlignment}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
                onChange={(value) => onUpdateConfig({ galleryAlignment: value as UiConfig["galleryAlignment"] })}
              />
              <SliderControl
                label="Gap Between Cards"
                value={config.galleryGap}
                min={8}
                max={32}
                onChange={(value) => onUpdateConfig({ galleryGap: value })}
                unit="px"
              />
              <SliderControl
                label="Image Border Radius"
                value={config.imageBorderRadius}
                min={0}
                max={16}
                onChange={(value) => onUpdateConfig({ imageBorderRadius: value })}
                unit="px"
              />
            </ControlGroup>

            {/* General Layout */}
            <ControlGroup
              title="Layout"
              isExpanded={expandedGroups.has("Layout")}
              onToggle={() => toggleGroup("Layout")}
            >
              <DropdownControl
                label="Layout Type"
                value={config.layout}
                options={[
                  { value: "default", label: "Default (Grid)" },
                  { value: "compact", label: "Compact (List)" },
                ]}
                onChange={(value) => onUpdateConfig({ layout: value as UiConfig["layout"] })}
              />
              <SliderControl
                label="Card Border Radius"
                value={config.cardBorderRadius}
                min={0}
                max={16}
                onChange={(value) => onUpdateConfig({ cardBorderRadius: value })}
                unit="px"
              />
              <SliderControl
                label="Container Padding"
                value={config.containerPadding}
                min={16}
                max={64}
                onChange={(value) => onUpdateConfig({ containerPadding: value })}
                unit="px"
              />
              <ColorPickerControl
                label="Background Color"
                value={config.sectionBackgroundColor}
                onChange={(value) => onUpdateConfig({ sectionBackgroundColor: value })}
              />
            </ControlGroup>

            {/* Stroke/Border */}
            <ControlGroup
              title="Stroke"
              isExpanded={expandedGroups.has("Stroke")}
              onToggle={() => toggleGroup("Stroke")}
            >
              <ColorPickerControl
                label="Border Color"
                value={config.strokeColor}
                onChange={(value) => onUpdateConfig({ strokeColor: value })}
              />
              <SliderControl
                label="Border Width"
                value={config.strokeWidth}
                min={0}
                max={4}
                onChange={(value) => onUpdateConfig({ strokeWidth: value })}
                unit="px"
              />
            </ControlGroup>
          </>
        )}

        {editMode === "component" && !selectedComponent && (
          <div className="p-2 lg:p-4 bg-secondary/20 rounded-lg border border-border text-center">
            <p className="text-xs lg:text-sm text-muted-foreground">Click a section in the preview to edit it</p>
          </div>
        )}

        {editMode === "component" && selectedChildComponent && (
          <>
            <ControlGroup
              title="Component Info"
              isExpanded={expandedGroups.has("Component Info")}
              onToggle={() => toggleGroup("Component Info")}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs lg:text-sm font-medium mb-1">
                    Component: {getChildComponentName()}
                  </label>
                  <button
                    onClick={() => onSelectChildComponent(null)}
                    className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-secondary text-secondary-foreground rounded text-xs lg:text-sm hover:opacity-80 transition-opacity"
                  >
                    Back to Parent
                  </button>
                </div>
              </div>
            </ControlGroup>

            <ControlGroup
              title="Text Content"
              isExpanded={expandedGroups.has("Text Content")}
              onToggle={() => toggleGroup("Text Content")}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs lg:text-sm font-medium mb-1">Edit Title</label>
                  <input
                    type="text"
                    value={config.componentTitleContent?.[selectedChildComponent] || ""}
                    onChange={(e) => onUpdateComponentTitle(selectedChildComponent, e.target.value)}
                    className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-background border border-border rounded text-xs lg:text-sm"
                    placeholder="Enter title text"
                  />
                </div>
                <div>
                  <label className="block text-xs lg:text-sm font-medium mb-1">Edit Description</label>
                  <textarea
                    value={config.componentDescriptionContent?.[selectedChildComponent] || ""}
                    onChange={(e) => onUpdateComponentDescription(selectedChildComponent, e.target.value)}
                    className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-background border border-border rounded text-xs lg:text-sm"
                    rows={3}
                    placeholder="Enter description text"
                  />
                </div>
              </div>
            </ControlGroup>

            {(selectedChildComponent.startsWith("feature-card-") ||
              selectedChildComponent.startsWith("service-card-")) && (
              <>
                <ControlGroup
                  title="Background Image"
                  isExpanded={expandedGroups.has("Background Image")}
                  onToggle={() => toggleGroup("Background Image")}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs lg:text-sm font-medium mb-2">Upload Background Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const imageData = event.target?.result as string
                              onUpdateComponentBackgroundImage(selectedChildComponent, imageData)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-background border border-border rounded text-xs lg:text-sm"
                      />
                    </div>
                    {config.componentBackgroundImages?.[selectedChildComponent] && (
                      <div className="space-y-2">
                        <img
                          src={config.componentBackgroundImages[selectedChildComponent] || "/placeholder.svg"}
                          alt="Background preview"
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          onClick={() => onUpdateComponentBackgroundImage(selectedChildComponent, "")}
                          className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-red-500/20 text-red-500 rounded text-xs lg:text-sm hover:bg-red-500/30 transition-colors"
                        >
                          Remove Background Image
                        </button>
                      </div>
                    )}
                  </div>
                </ControlGroup>

                <ControlGroup
                  title="Component Image"
                  isExpanded={expandedGroups.has("Component Image")}
                  onToggle={() => toggleGroup("Component Image")}
                >
                  <ImageGalleryControl
                    label="Upload Image"
                    images={getChildComponentImages(selectedChildComponent)}
                    onImagesChange={(images) => updateChildComponentImages(selectedChildComponent, images)}
                    componentName={getChildComponentName()}
                  />
                </ControlGroup>

                <ControlGroup
                  title="Gallery Options"
                  isExpanded={expandedGroups.has("Gallery Options")}
                  onToggle={() => toggleGroup("Gallery Options")}
                >
                  <RadioGroupControl
                    label="Gallery Alignment"
                    value={childComponentGalleryStyle.alignment || "left"}
                    options={[
                      { value: "left", label: "Left" },
                      { value: "center", label: "Center" },
                      { value: "right", label: "Right" },
                    ]}
                    onChange={(value) => updateChildComponentGalleryStyle(selectedChildComponent, { alignment: value })}
                  />
                  <SliderControl
                    label="Gap Between Cards"
                    value={childComponentGalleryStyle.gap || 16}
                    min={8}
                    max={32}
                    onChange={(value) => updateChildComponentGalleryStyle(selectedChildComponent, { gap: value })}
                    unit="px"
                  />
                  <SliderControl
                    label="Image Border Radius"
                    value={childComponentGalleryStyle.imageBorderRadius || 8}
                    min={0}
                    max={16}
                    onChange={(value) =>
                      updateChildComponentGalleryStyle(selectedChildComponent, { imageBorderRadius: value })
                    }
                    unit="px"
                  />
                  <SliderControl
                    label="Image Size"
                    value={childComponentGalleryStyle.imageSize || 100}
                    min={50}
                    max={150}
                    onChange={(value) => updateChildComponentGalleryStyle(selectedChildComponent, { imageSize: value })}
                    unit="%"
                  />
                </ControlGroup>
              </>
            )}

            <ControlGroup
              title="Typography"
              isExpanded={expandedGroups.has("Typography")}
              onToggle={() => toggleGroup("Typography")}
            >
              <SliderControl
                label="Font Size"
                value={childComponentStyle.fontSize || config.baseFontSize}
                min={10}
                max={60}
                onChange={(value) =>
                  onUpdateComponentStyle(selectedChildComponent, { ...childComponentStyle, fontSize: value })
                }
                unit="px"
              />
              <ColorPickerControl
                label="Text Color"
                value={childComponentStyle.color || "#FFFFFF"}
                onChange={(value) =>
                  onUpdateComponentStyle(selectedChildComponent, { ...childComponentStyle, color: value })
                }
              />
            </ControlGroup>

            <ControlGroup
              title="Background"
              isExpanded={expandedGroups.has("Background")}
              onToggle={() => toggleGroup("Background")}
            >
              <ColorPickerControl
                label="Background Color"
                value={childComponentStyle.backgroundColor || "#1A1A1A"}
                onChange={(value) =>
                  onUpdateComponentStyle(selectedChildComponent, { ...childComponentStyle, backgroundColor: value })
                }
              />
            </ControlGroup>

            <ControlGroup
              title="Spacing"
              isExpanded={expandedGroups.has("Spacing")}
              onToggle={() => toggleGroup("Spacing")}
            >
              <SliderControl
                label="Padding"
                value={childComponentStyle.padding || 16}
                min={0}
                max={64}
                onChange={(value) =>
                  onUpdateComponentStyle(selectedChildComponent, { ...childComponentStyle, padding: value })
                }
                unit="px"
              />
              <SliderControl
                label="Margin"
                value={childComponentStyle.margin || 0}
                min={0}
                max={64}
                onChange={(value) =>
                  onUpdateComponentStyle(selectedChildComponent, { ...childComponentStyle, margin: value })
                }
                unit="px"
              />
            </ControlGroup>

            <ControlGroup
              title="Border"
              isExpanded={expandedGroups.has("Border")}
              onToggle={() => toggleGroup("Border")}
            >
              <SliderControl
                label="Border Radius"
                value={childComponentStyle.borderRadius || 8}
                min={0}
                max={20}
                onChange={(value) =>
                  onUpdateComponentStyle(selectedChildComponent, { ...childComponentStyle, borderRadius: value })
                }
                unit="px"
              />
              <ColorPickerControl
                label="Border Color"
                value={childComponentStyle.borderColor || config.strokeColor}
                onChange={(value) =>
                  onUpdateComponentStyle(selectedChildComponent, { ...childComponentStyle, borderColor: value })
                }
              />
              <SliderControl
                label="Border Width"
                value={childComponentStyle.borderWidth || 1}
                min={0}
                max={4}
                onChange={(value) =>
                  onUpdateComponentStyle(selectedChildComponent, { ...childComponentStyle, borderWidth: value })
                }
                unit="px"
              />
            </ControlGroup>

            <ControlGroup
              title="Layout (Grid/Flex)"
              isExpanded={expandedGroups.has("Layout (Grid/Flex)")}
              onToggle={() => toggleGroup("Layout (Grid/Flex)")}
            >
              <div className="space-y-3">
                <DropdownControl
                  label="Display Type"
                  value={config.childComponentLayoutStyles?.[selectedChildComponent]?.display || "flex"}
                  options={[
                    { value: "flex", label: "Flexbox" },
                    { value: "grid", label: "Grid" },
                    { value: "block", label: "Block" },
                  ]}
                  onChange={(value) => {
                    const updatedLayouts = { ...config.childComponentLayoutStyles }
                    updatedLayouts[selectedChildComponent] = {
                      ...updatedLayouts[selectedChildComponent],
                      display: value as "flex" | "grid" | "block",
                    }
                    onUpdateConfig({ childComponentLayoutStyles: updatedLayouts })
                  }}
                />

                {config.childComponentLayoutStyles?.[selectedChildComponent]?.display === "flex" && (
                  <>
                    <DropdownControl
                      label="Flex Direction"
                      value={config.childComponentLayoutStyles?.[selectedChildComponent]?.flexDirection || "row"}
                      options={[
                        { value: "row", label: "Row" },
                        { value: "column", label: "Column" },
                      ]}
                      onChange={(value) => {
                        const updatedLayouts = { ...config.childComponentLayoutStyles }
                        updatedLayouts[selectedChildComponent] = {
                          ...updatedLayouts[selectedChildComponent],
                          flexDirection: value as "row" | "column",
                        }
                        onUpdateConfig({ childComponentLayoutStyles: updatedLayouts })
                      }}
                    />
                    <DropdownControl
                      label="Justify Content"
                      value={config.childComponentLayoutStyles?.[selectedChildComponent]?.justifyContent || "center"}
                      options={[
                        { value: "flex-start", label: "Start" },
                        { value: "center", label: "Center" },
                        { value: "flex-end", label: "End" },
                        { value: "space-between", label: "Space Between" },
                        { value: "space-around", label: "Space Around" },
                      ]}
                      onChange={(value) => {
                        const updatedLayouts = { ...config.childComponentLayoutStyles }
                        updatedLayouts[selectedChildComponent] = {
                          ...updatedLayouts[selectedChildComponent],
                          justifyContent: value as any,
                        }
                        onUpdateConfig({ childComponentLayoutStyles: updatedLayouts })
                      }}
                    />
                    <DropdownControl
                      label="Align Items"
                      value={config.childComponentLayoutStyles?.[selectedChildComponent]?.alignItems || "center"}
                      options={[
                        { value: "flex-start", label: "Start" },
                        { value: "center", label: "Center" },
                        { value: "flex-end", label: "End" },
                        { value: "stretch", label: "Stretch" },
                      ]}
                      onChange={(value) => {
                        const updatedLayouts = { ...config.childComponentLayoutStyles }
                        updatedLayouts[selectedChildComponent] = {
                          ...updatedLayouts[selectedChildComponent],
                          alignItems: value as any,
                        }
                        onUpdateConfig({ childComponentLayoutStyles: updatedLayouts })
                      }}
                    />
                  </>
                )}

                {config.childComponentLayoutStyles?.[selectedChildComponent]?.display === "grid" && (
                  <div>
                    <label className="block text-xs lg:text-sm font-medium mb-1">Grid Columns</label>
                    <input
                      type="text"
                      value={
                        config.childComponentLayoutStyles?.[selectedChildComponent]?.gridTemplateColumns ||
                        "repeat(3, 1fr)"
                      }
                      onChange={(value) => {
                        const updatedLayouts = { ...config.childComponentLayoutStyles }
                        updatedLayouts[selectedChildComponent] = {
                          ...updatedLayouts[selectedChildComponent],
                          gridTemplateColumns: value,
                        }
                        onUpdateConfig({ childComponentLayoutStyles: updatedLayouts })
                      }}
                      className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-background border border-border rounded text-xs lg:text-sm"
                      placeholder="e.g., repeat(3, 1fr)"
                    />
                  </div>
                )}

                <SliderControl
                  label="Gap"
                  value={config.childComponentLayoutStyles?.[selectedChildComponent]?.gap || 16}
                  min={0}
                  max={32}
                  onChange={(value) => {
                    const updatedLayouts = { ...config.childComponentLayoutStyles }
                    updatedLayouts[selectedChildComponent] = {
                      ...updatedLayouts[selectedChildComponent],
                      gap: value,
                    }
                    onUpdateConfig({ childComponentLayoutStyles: updatedLayouts })
                  }}
                  unit="px"
                />
              </div>
            </ControlGroup>
          </>
        )}

        {editMode === "component" && selectedComponent && !selectedChildComponent && (
          <>
            <ControlGroup
              title="Component Styling"
              isExpanded={expandedGroups.has("Component Styling")}
              onToggle={() => toggleGroup("Component Styling")}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs lg:text-sm font-medium mb-1">Component: {selectedComponent}</label>
                  <button
                    onClick={() => onSelectComponent(null)}
                    className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-secondary text-secondary-foreground rounded text-xs lg:text-sm hover:opacity-80 transition-opacity"
                  >
                    Deselect Component
                  </button>
                </div>
              </div>
            </ControlGroup>

            <ControlGroup
              title="Text Content"
              isExpanded={expandedGroups.has("Text Content")}
              onToggle={() => toggleGroup("Text Content")}
            >
              <div className="space-y-3">
                {(selectedComponent === "hero" ||
                  selectedComponent === "services-content" ||
                  selectedComponent === "about-content" ||
                  selectedComponent === "cta") && (
                  <>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium mb-1">Edit Title</label>
                      <input
                        type="text"
                        value={config.componentTitleContent?.[selectedComponent] || ""}
                        onChange={(e) => onUpdateComponentTitle(selectedComponent, e.target.value)}
                        className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-background border border-border rounded text-xs lg:text-sm"
                        placeholder="Enter title text"
                      />
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium mb-1">Edit Description</label>
                      <textarea
                        value={config.componentDescriptionContent?.[selectedComponent] || ""}
                        onChange={(e) => onUpdateComponentDescription(selectedComponent, e.target.value)}
                        className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-background border border-border rounded text-xs lg:text-sm"
                        rows={3}
                        placeholder="Enter description text"
                      />
                    </div>
                  </>
                )}
              </div>
            </ControlGroup>

            <ControlGroup
              title="Background Image"
              isExpanded={expandedGroups.has("Background Image")}
              onToggle={() => toggleGroup("Background Image")}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs lg:text-sm font-medium mb-2">Upload Background Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          const imageData = event.target?.result as string
                          onUpdateComponentBackgroundImage(selectedComponent, imageData)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-background border border-border rounded text-xs lg:text-sm"
                  />
                </div>
                {config.componentBackgroundImages?.[selectedComponent] && (
                  <div className="space-y-2">
                    <img
                      src={config.componentBackgroundImages[selectedComponent] || "/placeholder.svg"}
                      alt="Background preview"
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      onClick={() => onUpdateComponentBackgroundImage(selectedComponent, "")}
                      className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-red-500/20 text-red-500 rounded text-xs lg:text-sm hover:bg-red-500/30 transition-colors"
                    >
                      Remove Background Image
                    </button>
                  </div>
                )}
              </div>
            </ControlGroup>

            {selectedComponent === "features" && (
              <ControlGroup
                title="Feature Images"
                isExpanded={expandedGroups.has("Feature Images")}
                onToggle={() => toggleGroup("Feature Images")}
              >
                <ImageGalleryControl
                  label="Upload Feature Images"
                  images={getFeatureImages()}
                  onImagesChange={updateFeatureImages}
                  componentName="Features Section"
                />
              </ControlGroup>
            )}

            <ControlGroup
              title="Typography"
              isExpanded={expandedGroups.has("Typography")}
              onToggle={() => toggleGroup("Typography")}
            >
              <SliderControl
                label="Font Size"
                value={componentStyle.fontSize || config.baseFontSize}
                min={10}
                max={60}
                onChange={(value) => onUpdateComponentStyle(selectedComponent, { ...componentStyle, fontSize: value })}
                unit="px"
              />
              <ColorPickerControl
                label="Text Color"
                value={componentStyle.color || "#FFFFFF"}
                onChange={(value) => onUpdateComponentStyle(selectedComponent, { ...componentStyle, color: value })}
              />
            </ControlGroup>

            <ControlGroup
              title="Background"
              isExpanded={expandedGroups.has("Background")}
              onToggle={() => toggleGroup("Background")}
            >
              <ColorPickerControl
                label="Background Color"
                value={componentStyle.backgroundColor || "#1A1A1A"}
                onChange={(value) =>
                  onUpdateComponentStyle(selectedComponent, { ...componentStyle, backgroundColor: value })
                }
              />
            </ControlGroup>

            <ControlGroup
              title="Spacing"
              isExpanded={expandedGroups.has("Spacing")}
              onToggle={() => toggleGroup("Spacing")}
            >
              <SliderControl
                label="Padding"
                value={componentStyle.padding || 16}
                min={0}
                max={64}
                onChange={(value) => onUpdateComponentStyle(selectedComponent, { ...componentStyle, padding: value })}
                unit="px"
              />
              <SliderControl
                label="Margin"
                value={componentStyle.margin || 0}
                min={0}
                max={64}
                onChange={(value) => onUpdateComponentStyle(selectedComponent, { ...componentStyle, margin: value })}
                unit="px"
              />
            </ControlGroup>

            <ControlGroup
              title="Border"
              isExpanded={expandedGroups.has("Border")}
              onToggle={() => toggleGroup("Border")}
            >
              <SliderControl
                label="Border Radius"
                value={componentStyle.borderRadius || 8}
                min={0}
                max={20}
                onChange={(value) =>
                  onUpdateComponentStyle(selectedComponent, { ...componentStyle, borderRadius: value })
                }
                unit="px"
              />
              <ColorPickerControl
                label="Border Color"
                value={componentStyle.borderColor || config.strokeColor}
                onChange={(value) =>
                  onUpdateComponentStyle(selectedComponent, { ...componentStyle, borderColor: value })
                }
              />
              <SliderControl
                label="Border Width"
                value={componentStyle.borderWidth || 1}
                min={0}
                max={4}
                onChange={(value) =>
                  onUpdateComponentStyle(selectedComponent, { ...componentStyle, borderWidth: value })
                }
                unit="px"
              />
            </ControlGroup>

            <ControlGroup
              title="Layout (Grid/Flex)"
              isExpanded={expandedGroups.has("Layout (Grid/Flex)")}
              onToggle={() => toggleGroup("Layout (Grid/Flex)")}
            >
              <div className="space-y-3">
                <DropdownControl
                  label="Display Type"
                  value={config.componentLayoutStyles?.[selectedComponent]?.display || "flex"}
                  options={[
                    { value: "flex", label: "Flexbox" },
                    { value: "grid", label: "Grid" },
                    { value: "block", label: "Block" },
                  ]}
                  onChange={(value) => {
                    const updatedLayouts = { ...config.componentLayoutStyles }
                    updatedLayouts[selectedComponent] = {
                      ...updatedLayouts[selectedComponent],
                      display: value as "flex" | "grid" | "block",
                    }
                    onUpdateConfig({ componentLayoutStyles: updatedLayouts })
                  }}
                />

                {config.componentLayoutStyles?.[selectedComponent]?.display === "flex" && (
                  <>
                    <DropdownControl
                      label="Flex Direction"
                      value={config.componentLayoutStyles?.[selectedComponent]?.flexDirection || "row"}
                      options={[
                        { value: "row", label: "Row" },
                        { value: "column", label: "Column" },
                      ]}
                      onChange={(value) => {
                        const updatedLayouts = { ...config.componentLayoutStyles }
                        updatedLayouts[selectedComponent] = {
                          ...updatedLayouts[selectedComponent],
                          flexDirection: value as "row" | "column",
                        }
                        onUpdateConfig({ componentLayoutStyles: updatedLayouts })
                      }}
                    />
                    <DropdownControl
                      label="Justify Content"
                      value={config.componentLayoutStyles?.[selectedComponent]?.justifyContent || "center"}
                      options={[
                        { value: "flex-start", label: "Start" },
                        { value: "center", label: "Center" },
                        { value: "flex-end", label: "End" },
                        { value: "space-between", label: "Space Between" },
                        { value: "space-around", label: "Space Around" },
                      ]}
                      onChange={(value) => {
                        const updatedLayouts = { ...config.componentLayoutStyles }
                        updatedLayouts[selectedComponent] = {
                          ...updatedLayouts[selectedComponent],
                          justifyContent: value as any,
                        }
                        onUpdateConfig({ componentLayoutStyles: updatedLayouts })
                      }}
                    />
                    <DropdownControl
                      label="Align Items"
                      value={config.componentLayoutStyles?.[selectedComponent]?.alignItems || "center"}
                      options={[
                        { value: "flex-start", label: "Start" },
                        { value: "center", label: "Center" },
                        { value: "flex-end", label: "End" },
                        { value: "stretch", label: "Stretch" },
                      ]}
                      onChange={(value) => {
                        const updatedLayouts = { ...config.componentLayoutStyles }
                        updatedLayouts[selectedComponent] = {
                          ...updatedLayouts[selectedComponent],
                          alignItems: value as any,
                        }
                        onUpdateConfig({ componentLayoutStyles: updatedLayouts })
                      }}
                    />
                  </>
                )}

                {config.componentLayoutStyles?.[selectedComponent]?.display === "grid" && (
                  <div>
                    <label className="block text-xs lg:text-sm font-medium mb-1">Grid Columns</label>
                    <input
                      type="text"
                      value={config.componentLayoutStyles?.[selectedComponent]?.gridTemplateColumns || "repeat(3, 1fr)"}
                      onChange={(value) => {
                        const updatedLayouts = { ...config.componentLayoutStyles }
                        updatedLayouts[selectedComponent] = {
                          ...updatedLayouts[selectedComponent],
                          gridTemplateColumns: value,
                        }
                        onUpdateConfig({ componentLayoutStyles: updatedLayouts })
                      }}
                      className="w-full px-2 lg:px-3 py-1 lg:py-2 bg-background border border-border rounded text-xs lg:text-sm"
                      placeholder="e.g., repeat(3, 1fr)"
                    />
                  </div>
                )}

                <SliderControl
                  label="Gap"
                  value={config.componentLayoutStyles?.[selectedComponent]?.gap || 16}
                  min={0}
                  max={32}
                  onChange={(value) => {
                    const updatedLayouts = { ...config.componentLayoutStyles }
                    updatedLayouts[selectedComponent] = {
                      ...updatedLayouts[selectedComponent],
                      gap: value,
                    }
                    onUpdateConfig({ componentLayoutStyles: updatedLayouts })
                  }}
                  unit="px"
                />
              </div>
            </ControlGroup>
          </>
        )}
      </div>

      <div className="bg-card border-t border-border p-2 lg:p-3 space-y-1 lg:space-y-2 flex-shrink-0">
        {(selectedComponent || selectedChildComponent) && (
          <div className="mb-1 p-1 lg:p-2 bg-secondary/20 rounded border border-border text-xs text-muted-foreground text-center">
            <span className="font-medium text-xs">
              {selectedChildComponent
                ? `Editing: ${getChildComponentName()}`
                : selectedComponent
                  ? `Editing: ${selectedComponent}`
                  : "No component selected"}
            </span>
          </div>
        )}
        <button
          onClick={onExportConfig}
          className="w-full px-2 lg:px-3 py-1.5 lg:py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity text-xs lg:text-sm"
        >
          Export Config
        </button>
        <button
          onClick={onResetConfig}
          className="w-full px-2 lg:px-3 py-1.5 lg:py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity text-xs lg:text-sm"
        >
          Reset to Default
        </button>
      </div>
    </div>
  )
}
