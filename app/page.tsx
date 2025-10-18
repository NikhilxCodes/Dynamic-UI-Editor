"use client"

import type React from "react"

import { useReducer, useState } from "react"
import { LivePreview } from "@/components/live-preview"
import { EditorPanel } from "@/components/editor-panel"
import type { UiConfig } from "@/types/ui-config"

const initialConfig: UiConfig = {
  // Typography
  fontFamily: "Inter",
  fontWeight: "500",
  baseFontSize: 16,

  // Button
  buttonBorderRadius: 8,
  buttonShadow: "md",
  buttonBackgroundColor: "#FF6B35",
  buttonTextColor: "#FFFFFF",
  buttonAlignment: "center",

  // Card
  cardBorderRadius: 12,
  cardShadow: "md",
  cardBackgroundColor: "#1A1A1A",

  // Gallery/Images
  galleryAlignment: "center",
  galleryGap: 16,
  imageBorderRadius: 8,

  // General Layout
  layout: "default",
  containerPadding: 24,
  sectionBackgroundColor: "#000000",

  // Stroke/Border
  strokeColor: "#333333",
  strokeWidth: 1,

  // Component Showcase
  componentSpacing: 24,
  componentScale: 1,

  selectedComponent: null,
  selectedChildComponent: null,
  componentStyles: {},
  childComponentImages: {},
  componentLayoutStyles: {},
  childComponentLayoutStyles: {},

  siteName: "5 Minute Website",
  siteDescription: "Build beautiful websites with our powerful UI editor",
  currentPage: "home",

  pages: {
    home: {
      title: "Home",
      description: "Welcome to our website",
      heroTitle: "Welcome to Your Website",
      heroDescription: "Build beautiful websites with our powerful UI editor",
      heroButtonText: "Get Started",
      sections: [
        {
          id: "features",
          type: "features",
          title: "Features",
          description: "Discover what makes us special",
          content: "",
        },
        {
          id: "cta",
          type: "cta",
          title: "Ready to Get Started?",
          description: "Join thousands of users creating amazing websites",
          content: "",
        },
      ],
    },
    about: {
      title: "About",
      description: "Learn more about us",
      heroTitle: "About Our Company",
      heroDescription: "We are dedicated to helping you build amazing websites",
      heroButtonText: "Learn More",
      sections: [
        {
          id: "about-content",
          type: "about",
          title: "Our Story",
          description: "Founded in 2024, we believe in empowering creators",
          content: "Our mission is to make website building accessible to everyone.",
        },
      ],
    },
    services: {
      title: "Services",
      description: "What we offer",
      heroTitle: "Our Services",
      heroDescription: "Comprehensive solutions for your website needs",
      heroButtonText: "Explore Services",
      sections: [
        {
          id: "services-content",
          type: "services",
          title: "What We Offer",
          description: "Professional services tailored to your needs",
          content: "",
        },
      ],
    },
  },
}

type Action =
  | { type: "UPDATE_CONFIG"; payload: Partial<UiConfig> }
  | { type: "SELECT_COMPONENT"; payload: string | null }
  | { type: "SELECT_CHILD_COMPONENT"; payload: string | null }
  | { type: "UPDATE_COMPONENT_STYLE"; payload: { component: string; style: Record<string, any> } }
  | { type: "UPDATE_CHILD_COMPONENT_IMAGES"; payload: { componentId: string; images: string[] } }
  | { type: "RESET_CONFIG" }
  | { type: "NAVIGATE_PAGE"; payload: "home" | "about" | "services" }
  | { type: "UPDATE_COMPONENT_BACKGROUND_IMAGE"; payload: { component: string; image: string } }
  | { type: "UPDATE_COMPONENT_TEXT_CONTENT"; payload: { component: string; text: string } }
  | { type: "UPDATE_COMPONENT_TITLE"; payload: { component: string; title: string } }
  | { type: "UPDATE_COMPONENT_DESCRIPTION"; payload: { component: string; description: string } }
  | { type: "UPDATE_COMPONENT_LAYOUT"; payload: { component: string; layout: Record<string, any> } }
  | { type: "UPDATE_CHILD_COMPONENT_LAYOUT"; payload: { component: string; layout: Record<string, any> } }

function configReducer(state: UiConfig, action: Action): UiConfig {
  switch (action.type) {
    case "UPDATE_CONFIG":
      return { ...state, ...action.payload }
    case "SELECT_COMPONENT":
      return { ...state, selectedComponent: action.payload, selectedChildComponent: null }
    case "SELECT_CHILD_COMPONENT":
      return { ...state, selectedChildComponent: action.payload }
    case "UPDATE_COMPONENT_STYLE":
      return {
        ...state,
        componentStyles: {
          ...state.componentStyles,
          [action.payload.component]: action.payload.style,
        },
      }
    case "UPDATE_CHILD_COMPONENT_IMAGES":
      return {
        ...state,
        childComponentImages: {
          ...state.childComponentImages,
          [action.payload.componentId]: action.payload.images,
        },
      }
    case "UPDATE_COMPONENT_BACKGROUND_IMAGE":
      return {
        ...state,
        componentBackgroundImages: {
          ...state.componentBackgroundImages,
          [action.payload.component]: action.payload.image,
        },
      }
    case "UPDATE_COMPONENT_TEXT_CONTENT":
      return {
        ...state,
        componentTextContent: {
          ...state.componentTextContent,
          [action.payload.component]: action.payload.text,
        },
      }
    case "UPDATE_COMPONENT_TITLE":
      return {
        ...state,
        componentTitleContent: {
          ...state.componentTitleContent,
          [action.payload.component]: action.payload.title,
        },
      }
    case "UPDATE_COMPONENT_DESCRIPTION":
      return {
        ...state,
        componentDescriptionContent: {
          ...state.componentDescriptionContent,
          [action.payload.component]: action.payload.description,
        },
      }
    case "UPDATE_COMPONENT_LAYOUT":
      return {
        ...state,
        componentLayoutStyles: {
          ...state.componentLayoutStyles,
          [action.payload.component]: action.payload.layout,
        },
      }
    case "UPDATE_CHILD_COMPONENT_LAYOUT":
      return {
        ...state,
        childComponentLayoutStyles: {
          ...state.childComponentLayoutStyles,
          [action.payload.component]: action.payload.layout,
        },
      }
    case "RESET_CONFIG":
      return initialConfig
    case "NAVIGATE_PAGE":
      return { ...state, currentPage: action.payload }
    default:
      return state
  }
}

export default function Home() {
  const [config, dispatch] = useReducer(configReducer, initialConfig)
  const [isEditorOpen, setIsEditorOpen] = useState(true)
  const [editorPosition, setEditorPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const updateConfig = (updates: Partial<UiConfig>) => {
    dispatch({ type: "UPDATE_CONFIG", payload: updates })
  }

  const selectComponent = (component: string | null) => {
    dispatch({ type: "SELECT_COMPONENT", payload: component })
  }

  const selectChildComponent = (component: string | null) => {
    dispatch({ type: "SELECT_CHILD_COMPONENT", payload: component })
  }

  const updateComponentStyle = (component: string, style: Record<string, any>) => {
    dispatch({ type: "UPDATE_COMPONENT_STYLE", payload: { component, style } })
  }

  const updateChildComponentImages = (componentId: string, images: string[]) => {
    dispatch({ type: "UPDATE_CHILD_COMPONENT_IMAGES", payload: { componentId, images } })
  }

  const updateComponentBackgroundImage = (component: string, image: string) => {
    dispatch({ type: "UPDATE_COMPONENT_BACKGROUND_IMAGE", payload: { component, image } })
  }

  const updateComponentTextContent = (component: string, text: string) => {
    dispatch({ type: "UPDATE_COMPONENT_TEXT_CONTENT", payload: { component, text } })
  }

  const updateComponentTitle = (component: string, title: string) => {
    dispatch({ type: "UPDATE_COMPONENT_TITLE", payload: { component, title } })
  }

  const updateComponentDescription = (component: string, description: string) => {
    dispatch({ type: "UPDATE_COMPONENT_DESCRIPTION", payload: { component, description } })
  }

  const resetConfig = () => {
    dispatch({ type: "RESET_CONFIG" })
  }

  const navigatePage = (page: "home" | "about" | "services") => {
    dispatch({ type: "NAVIGATE_PAGE", payload: page })
  }

  const exportConfig = () => {
    const jsonString = JSON.stringify(config, null, 2)
    console.log("Exported Config:", jsonString)
    alert("Config exported to console! Check the browser console for the JSON.")
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-editor-header]")) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - editorPosition.x,
        y: e.clientY - editorPosition.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setEditorPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div
      className="flex h-screen bg-background overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Live Preview - adjusts width based on editor state */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ${isEditorOpen ? "w-2/3" : "w-full"}`}>
        <LivePreview
          config={config}
          selectedComponent={config.selectedComponent}
          selectedChildComponent={config.selectedChildComponent}
          onSelectComponent={selectComponent}
          onSelectChildComponent={selectChildComponent}
          onNavigate={navigatePage}
          isEditorOpen={isEditorOpen}
          onToggleEditor={() => setIsEditorOpen(!isEditorOpen)}
        />
      </div>

      {isEditorOpen && (
        <div className="w-1/3 bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden">
          <EditorPanel
            config={config}
            selectedComponent={config.selectedComponent}
            selectedChildComponent={config.selectedChildComponent}
            onUpdateConfig={updateConfig}
            onSelectComponent={selectComponent}
            onSelectChildComponent={selectChildComponent}
            onUpdateComponentStyle={updateComponentStyle}
            onUpdateChildComponentImages={updateChildComponentImages}
            onUpdateComponentBackgroundImage={updateComponentBackgroundImage}
            onUpdateComponentTextContent={updateComponentTextContent}
            onUpdateComponentTitle={updateComponentTitle}
            onUpdateComponentDescription={updateComponentDescription}
            onResetConfig={resetConfig}
            onExportConfig={exportConfig}
            onCloseEditor={() => setIsEditorOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
