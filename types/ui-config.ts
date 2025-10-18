export interface UiConfig {
  // Typography
  fontFamily: "Inter" | "Roboto" | "Poppins"
  fontWeight: "400" | "500" | "600" | "700"
  baseFontSize: number

  // Button
  buttonBorderRadius: number
  buttonShadow: "none" | "sm" | "md" | "lg"
  buttonBackgroundColor: string
  buttonTextColor: string
  buttonAlignment: "left" | "center" | "right"

  // Card
  cardBorderRadius: number
  cardShadow: "none" | "sm" | "md" | "lg"
  cardBackgroundColor: string

  // Gallery/Images
  galleryAlignment: "left" | "center" | "right"
  galleryGap: number
  imageBorderRadius: number

  // General Layout
  layout: "default" | "compact"
  containerPadding: number
  sectionBackgroundColor: string

  // Stroke/Border
  strokeColor: string
  strokeWidth: number

  // Component Showcase
  componentSpacing: number
  componentScale: number

  selectedComponent: string | null
  selectedChildComponent: string | null
  componentStyles: Record<string, Record<string, any>>
  childComponentImages: Record<string, string[]>
  childComponentGalleryStyles: Record<
    string,
    {
      alignment?: "left" | "center" | "right"
      gap?: number
      imageBorderRadius?: number
      imageSize?: number
    }
  >
  componentBackgroundImages: Record<string, string>
  componentTextContent: Record<string, string>
  componentTitleContent: Record<string, string>
  componentDescriptionContent: Record<string, string>

  componentLayoutStyles: Record<
    string,
    {
      display?: "flex" | "grid" | "block"
      flexDirection?: "row" | "column"
      justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around"
      alignItems?: "flex-start" | "center" | "flex-end" | "stretch"
      gridTemplateColumns?: string
      gap?: number
    }
  >
  childComponentLayoutStyles: Record<
    string,
    {
      display?: "flex" | "grid" | "block"
      flexDirection?: "row" | "column"
      justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around"
      alignItems?: "flex-start" | "center" | "flex-end" | "stretch"
      gridTemplateColumns?: string
      gap?: number
    }
  >

  siteName: string
  siteDescription: string
  currentPage: "home" | "about" | "services"

  siteLogo?: string
  siteLogoPosition?: "left" | "center" | "right"
  siteLogoSize?: number
  gridLayout?: "1" | "2" | "3" | "4"

  pages: {
    home: PageConfig
    about: PageConfig
    services: PageConfig
  }
}

export interface PageConfig {
  title: string
  description: string
  heroTitle: string
  heroDescription: string
  heroButtonText: string
  sections: SectionConfig[]
}

export interface SectionConfig {
  id: string
  type: "hero" | "features" | "cta" | "contact" | "about" | "services"
  title: string
  description: string
  content: string
  images?: string[]
}
