"use client"

import type { UiConfig } from "@/types/ui-config"

interface DashboardComponentProps {
  config: UiConfig
  selectedComponent: string | null
  selectedChildComponent: string | null
  onSelectComponent: (component: string | null) => void
  onSelectChildComponent: (component: string | null) => void
  onNavigate: (page: "home" | "about" | "services") => void
  isEditorOpen: boolean
  onToggleEditor: () => void
}

const shadowMap = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
}

const fontFamilyMap = {
  Inter: "font-sans",
  Roboto: "font-roboto",
  Poppins: "font-poppins",
}

export function DashboardComponent({
  config,
  selectedComponent,
  selectedChildComponent,
  onSelectComponent,
  onSelectChildComponent,
  onNavigate,
  isEditorOpen,
  onToggleEditor,
}: DashboardComponentProps) {
  const shadowClass = shadowMap[config.buttonShadow]
  const fontClass = fontFamilyMap[config.fontFamily]
  const currentPageConfig = config.pages[config.currentPage]

  const getComponentStyle = (componentId: string) => {
    const isSelected = selectedComponent === componentId || selectedChildComponent === componentId
    const customStyle = config.componentStyles[componentId] || {}

    return {
      borderTopWidth: isSelected ? 3 : customStyle.borderWidth || config.strokeWidth,
      borderTopColor: isSelected ? config.buttonBackgroundColor : customStyle.borderColor || config.strokeColor,
      borderRightWidth: isSelected ? 3 : customStyle.borderWidth || config.strokeWidth,
      borderRightColor: isSelected ? config.buttonBackgroundColor : customStyle.borderColor || config.strokeColor,
      borderLeftWidth: isSelected ? 3 : customStyle.borderWidth || config.strokeWidth,
      borderLeftColor: isSelected ? config.buttonBackgroundColor : customStyle.borderColor || config.strokeColor,
      borderBottomWidth: isSelected ? 3 : customStyle.borderWidth || config.strokeWidth,
      borderBottomColor: isSelected ? config.buttonBackgroundColor : customStyle.borderColor || config.strokeColor,
      borderStyle: "solid",
      boxShadow: isSelected ? `0 0 0 3px ${config.buttonBackgroundColor}33` : "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      ...customStyle,
    }
  }

  const getChildComponentStyle = (componentId: string) => {
    const customStyle = config.componentStyles[componentId] || {}
    const isSelected = selectedChildComponent === componentId
    const backgroundImage = config.componentBackgroundImages?.[componentId]

    return {
      backgroundColor: customStyle.backgroundColor || "#1A1A1A",
      color: customStyle.color || "#FFFFFF",
      fontSize: customStyle.fontSize ? `${customStyle.fontSize}px` : undefined,
      padding: customStyle.padding ? `${customStyle.padding}px` : "24px",
      margin: customStyle.margin ? `${customStyle.margin}px` : undefined,
      borderRadius: customStyle.borderRadius ? `${customStyle.borderRadius}px` : `${config.cardBorderRadius}px`,
      border: `${customStyle.borderWidth || config.strokeWidth}px solid ${
        isSelected ? config.buttonBackgroundColor : customStyle.borderColor || config.strokeColor
      }`,
      boxShadow: isSelected ? `0 0 0 3px ${config.buttonBackgroundColor}33` : "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }
  }

  const getChildComponentImages = (componentId: string) => {
    return config.childComponentImages?.[componentId] || []
  }

  const getChildComponentGalleryStyle = (componentId: string) => {
    return config.childComponentGalleryStyles?.[componentId] || {}
  }

  const getFeatureImages = () => {
    const featureSection = currentPageConfig.sections.find((s) => s.id === "features")
    return featureSection?.images || []
  }

  return (
    <div
      className={`${fontClass} min-h-screen`}
      style={{
        fontSize: `${config.baseFontSize}px`,
        fontWeight: config.fontWeight,
        backgroundColor: config.sectionBackgroundColor,
        color: "#FFFFFF",
      }}
    >
      {/* Header/Navigation */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          ...getComponentStyle("header"),
          backgroundColor: `${config.sectionBackgroundColor}dd`,
          padding: `${config.containerPadding / 4}px ${config.containerPadding / 2}px`,
        }}
        onClick={() => onSelectComponent("header")}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto px-1 sm:px-4">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {config.siteLogo ? (
              <img
                src={config.siteLogo || "/placeholder.svg"}
                alt="Logo"
                className="rounded-lg object-contain flex-shrink-0"
                style={{
                  height: `${config.siteLogoSize ? config.siteLogoSize * 0.75 : 30}px`,
                  width: `${config.siteLogoSize ? config.siteLogoSize * 0.75 : 30}px`,
                }}
              />
            ) : (
              <div
                className="rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: config.buttonBackgroundColor,
                  height: `${config.siteLogoSize ? config.siteLogoSize * 0.75 : 30}px`,
                  width: `${config.siteLogoSize ? config.siteLogoSize * 0.75 : 30}px`,
                }}
              />
            )}
            <span className="text-sm sm:text-xl font-bold truncate">{config.siteName}</span>
          </div>
          <nav className="flex gap-1 sm:gap-6 items-center ml-1 sm:ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNavigate("home")
              }}
              className={`text-xs sm:text-base hover:opacity-70 transition-opacity whitespace-nowrap ${
                config.currentPage === "home" ? "opacity-100 font-bold" : "opacity-70"
              }`}
            >
              <span className="hidden sm:inline">Home</span>
              <span className="sm:hidden">H</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNavigate("about")
              }}
              className={`text-xs sm:text-base hover:opacity-70 transition-opacity whitespace-nowrap ${
                config.currentPage === "about" ? "opacity-100 font-bold" : "opacity-70"
              }`}
            >
              <span className="hidden sm:inline">About</span>
              <span className="sm:hidden">A</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNavigate("services")
              }}
              className={`text-xs sm:text-base hover:opacity-70 transition-opacity whitespace-nowrap ${
                config.currentPage === "services" ? "opacity-100 font-bold" : "opacity-70"
              }`}
            >
              <span className="hidden sm:inline">Services</span>
              <span className="sm:hidden">S</span>
            </button>
            <a
              href="#contact"
              className="text-xs sm:text-base hover:opacity-70 transition-opacity whitespace-nowrap hidden sm:inline"
            >
              Contact
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleEditor()
              }}
              className="ml-1 sm:ml-4 p-1 sm:p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex-shrink-0"
              title={isEditorOpen ? "Close editor" : "Open editor"}
            >
              {isEditorOpen ? (
                <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 11-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0m-9.75 0h9.75"
                  />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          padding: `${config.containerPadding / 2}px ${config.containerPadding / 3}px`,
        }}
      >
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-12">
          {/* Hero Section */}
          <section
            className="py-6 sm:py-20 text-center rounded-lg"
            style={{
              ...getComponentStyle("hero"),
              backgroundColor: "#1A1A1A",
              borderRadius: `${config.cardBorderRadius}px`,
            }}
            onClick={() => onSelectComponent("hero")}
          >
            <h1
              className="font-bold mb-2 sm:mb-4 text-xl sm:text-4xl md:text-5xl px-2 sm:px-4"
              style={{
                fontSize: `clamp(1.25rem, 5vw, ${config.baseFontSize * 3}px)`,
              }}
            >
              {config.componentTitleContent?.["hero"] || currentPageConfig.heroTitle}
            </h1>
            <p
              className="mb-3 sm:mb-8 opacity-80 px-2 sm:px-4 text-xs sm:text-base"
              style={{
                fontSize: `clamp(0.75rem, 3vw, ${config.baseFontSize * 1.2}px)`,
              }}
            >
              {config.componentDescriptionContent?.["hero"] || currentPageConfig.heroDescription}
            </p>
            <button
              className={`px-4 sm:px-8 py-1.5 sm:py-3 rounded-lg font-semibold transition-all hover:opacity-90 text-xs sm:text-base ${shadowClass}`}
              style={{
                backgroundColor: config.buttonBackgroundColor,
                color: config.buttonTextColor,
                borderRadius: `${config.buttonBorderRadius}px`,
              }}
              onClick={(e) => {
                e.stopPropagation()
                onNavigate("services")
              }}
            >
              {currentPageConfig.heroButtonText}
            </button>
          </section>

          {/* Features Section (Home Page) */}
          {config.currentPage === "home" && (
            <section
              style={{
                ...getComponentStyle("features"),
                borderRadius: `${config.cardBorderRadius}px`,
              }}
              onClick={() => onSelectComponent("features")}
            >
              <h2
                className="text-lg sm:text-3xl font-bold mb-3 sm:mb-8 text-center px-2 sm:px-4"
                style={{
                  fontSize: `clamp(1.125rem, 5vw, ${config.baseFontSize * 2}px)`,
                }}
              >
                Features
              </h2>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0"
                style={{
                  gap: `${config.galleryGap / 2}px`,
                  justifyItems:
                    config.galleryAlignment === "center"
                      ? "center"
                      : config.galleryAlignment === "right"
                        ? "end"
                        : "start",
                }}
              >
                {[1, 2, 3].map((i) => {
                  const featureImages = getFeatureImages()
                  const featureImage = featureImages[i - 1]
                  const featureCardId = `feature-card-${i}`
                  const isFeatureSelected = selectedChildComponent === featureCardId
                  const cardImages = getChildComponentImages(featureCardId)
                  const cardImage = cardImages[0]
                  const galleryStyle = getChildComponentGalleryStyle(featureCardId)

                  return (
                    <div
                      key={i}
                      className="p-2 sm:p-6 rounded-lg"
                      style={getChildComponentStyle(featureCardId)}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectComponent("features")
                        onSelectChildComponent(featureCardId)
                      }}
                    >
                      {cardImage ? (
                        <img
                          src={cardImage || "/placeholder.svg"}
                          alt={`Feature ${i}`}
                          className="w-full h-16 sm:h-32 object-cover rounded-lg mb-2 sm:mb-4"
                          style={{
                            borderRadius: `${galleryStyle.imageBorderRadius || config.imageBorderRadius}px`,
                            width: `${galleryStyle.imageSize || 100}%`,
                            height: `${(galleryStyle.imageSize || 100) * 0.4}px`,
                          }}
                        />
                      ) : featureImage ? (
                        <img
                          src={featureImage || "/placeholder.svg"}
                          alt={`Feature ${i}`}
                          className="w-full h-16 sm:h-32 object-cover rounded-lg mb-2 sm:mb-4"
                          style={{
                            borderRadius: `${galleryStyle.imageBorderRadius || config.imageBorderRadius}px`,
                            width: `${galleryStyle.imageSize || 100}%`,
                            height: `${(galleryStyle.imageSize || 100) * 0.4}px`,
                          }}
                        />
                      ) : (
                        <div
                          className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg mb-2 sm:mb-4"
                          style={{
                            backgroundColor: config.buttonBackgroundColor,
                          }}
                        />
                      )}
                      <h3 className="font-bold mb-1 sm:mb-2 text-xs sm:text-base">
                        {config.componentTitleContent?.[featureCardId] || `Feature ${i}`}
                      </h3>
                      <p className="text-xs sm:text-sm opacity-70">
                        {config.componentDescriptionContent?.[featureCardId] ||
                          "Description of your amazing feature goes here."}
                      </p>
                      {config.componentTextContent?.[featureCardId] && (
                        <p className="text-xs sm:text-sm mt-1 sm:mt-2">{config.componentTextContent[featureCardId]}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* About Page Content */}
          {config.currentPage === "about" && (
            <section
              className="p-3 sm:p-8 rounded-lg"
              style={{
                ...getComponentStyle("about-content"),
                backgroundColor: "#1A1A1A",
                borderRadius: `${config.cardBorderRadius}px`,
              }}
              onClick={() => onSelectComponent("about-content")}
            >
              <h2
                className="font-bold mb-2 sm:mb-4 text-lg sm:text-3xl px-2 sm:px-0"
                style={{
                  fontSize: `clamp(1.125rem, 5vw, ${config.baseFontSize * 2}px)`,
                }}
              >
                Our Story
              </h2>
              <p className="opacity-80 mb-2 sm:mb-4 px-2 sm:px-0 text-xs sm:text-base">
                Founded in 2024, we believe in empowering creators with the tools they need to build amazing websites.
              </p>
              <p className="opacity-80 px-2 sm:px-0 text-xs sm:text-base">
                Our mission is to make website building accessible to everyone, regardless of their technical
                background.
              </p>
            </section>
          )}

          {/* Services Page Content */}
          {config.currentPage === "services" && (
            <section
              style={{
                ...getComponentStyle("services-content"),
                borderRadius: `${config.cardBorderRadius}px`,
              }}
              onClick={() => onSelectComponent("services-content")}
            >
              <h2
                className="text-lg sm:text-3xl font-bold mb-3 sm:mb-8 text-center px-2 sm:px-4"
                style={{
                  fontSize: `clamp(1.125rem, 5vw, ${config.baseFontSize * 2}px)`,
                }}
              >
                {config.componentTitleContent?.["services-content"] || "Our Services"}
              </h2>
              <p
                className="text-center mb-3 sm:mb-8 opacity-80 px-2 sm:px-4 text-xs sm:text-base"
                style={{
                  fontSize: `clamp(0.75rem, 3vw, ${config.baseFontSize * 1.1}px)`,
                }}
              >
                {config.componentDescriptionContent?.["services-content"] ||
                  "Comprehensive solutions for your website needs"}
              </p>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0"
                style={{
                  gap: `${config.galleryGap / 2}px`,
                  justifyItems:
                    config.galleryAlignment === "center"
                      ? "center"
                      : config.galleryAlignment === "right"
                        ? "end"
                        : "start",
                }}
              >
                {["Web Design", "Development", "Consulting"].map((service, i) => {
                  const serviceCardId = `service-card-${i}`
                  const isServiceSelected = selectedChildComponent === serviceCardId
                  const cardImages = getChildComponentImages(serviceCardId)
                  const cardImage = cardImages[0]
                  const galleryStyle = getChildComponentGalleryStyle(serviceCardId)

                  return (
                    <div
                      key={i}
                      className="p-2 sm:p-6 rounded-lg text-center"
                      style={getChildComponentStyle(serviceCardId)}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectComponent("services-content")
                        onSelectChildComponent(serviceCardId)
                      }}
                    >
                      {cardImage ? (
                        <img
                          src={cardImage || "/placeholder.svg"}
                          alt={service}
                          className="w-8 h-8 sm:w-16 sm:h-16 rounded-lg mb-2 sm:mb-4 mx-auto object-cover"
                          style={{
                            borderRadius: `${galleryStyle.imageBorderRadius || config.imageBorderRadius}px`,
                            width: `${(galleryStyle.imageSize || 100) * 0.16}px`,
                            height: `${(galleryStyle.imageSize || 100) * 0.16}px`,
                          }}
                        />
                      ) : (
                        <div
                          className="w-8 h-8 sm:w-16 sm:h-16 rounded-lg mb-2 sm:mb-4 mx-auto"
                          style={{
                            backgroundColor: config.buttonBackgroundColor,
                          }}
                        />
                      )}
                      <h3 className="font-bold mb-1 sm:mb-2 text-xs sm:text-base">
                        {config.componentTitleContent?.[serviceCardId] || service}
                      </h3>
                      <p className="text-xs sm:text-sm opacity-70">
                        {config.componentDescriptionContent?.[serviceCardId] ||
                          `Professional ${service.toLowerCase()} services tailored to your needs.`}
                      </p>
                      {config.componentTextContent?.[serviceCardId] && (
                        <p className="text-xs sm:text-sm mt-1 sm:mt-2">{config.componentTextContent[serviceCardId]}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Call to Action Section */}
          <section
            className="py-6 sm:py-16 text-center rounded-lg"
            style={{
              ...getComponentStyle("cta"),
              backgroundColor: "#1A1A1A",
              borderRadius: `${config.cardBorderRadius}px`,
            }}
            onClick={() => onSelectComponent("cta")}
          >
            <h2
              className="font-bold mb-2 sm:mb-4 text-lg sm:text-3xl px-2 sm:px-4"
              style={{
                fontSize: `clamp(1.125rem, 5vw, ${config.baseFontSize * 2}px)`,
              }}
            >
              {config.componentTitleContent?.["cta"] || "Ready to Get Started?"}
            </h2>
            <p className="mb-3 sm:mb-6 opacity-80 px-2 sm:px-4 text-xs sm:text-base">
              {config.componentDescriptionContent?.["cta"] || "Join thousands of users creating amazing websites"}
            </p>
            <button
              className={`px-4 sm:px-8 py-1.5 sm:py-3 rounded-lg font-semibold transition-all hover:opacity-90 text-xs sm:text-base ${shadowClass}`}
              style={{
                backgroundColor: config.buttonBackgroundColor,
                color: config.buttonTextColor,
                borderRadius: `${config.buttonBorderRadius}px`,
              }}
              onClick={(e) => {
                e.stopPropagation()
                onNavigate("home")
              }}
            >
              Start Building Now
            </button>
          </section>

          {/* Contact Form Section */}
          <section
            className="p-3 sm:p-8 rounded-lg"
            id="contact"
            style={{
              ...getComponentStyle("contact"),
              backgroundColor: "#1A1A1A",
              borderRadius: `${config.cardBorderRadius}px`,
            }}
            onClick={() => onSelectComponent("contact")}
          >
            <h2
              className="font-bold mb-3 sm:mb-6 text-center text-lg sm:text-3xl px-2 sm:px-4"
              style={{
                fontSize: `clamp(1.125rem, 5vw, ${config.baseFontSize * 2}px)`,
              }}
            >
              Get In Touch
            </h2>
            <div className="max-w-md mx-auto space-y-2 sm:space-y-4 px-2 sm:px-0">
              <div>
                <label className="block mb-1 sm:mb-2 font-semibold text-xs sm:text-base">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-black text-white text-xs sm:text-base"
                  style={{
                    borderRadius: `${config.buttonBorderRadius}px`,
                    border: `${config.strokeWidth}px solid ${config.strokeColor}`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                <label className="block mb-1 sm:mb-2 font-semibold text-xs sm:text-base">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-black text-white text-xs sm:text-base"
                  style={{
                    borderRadius: `${config.buttonBorderRadius}px`,
                    border: `${config.strokeWidth}px solid ${config.strokeColor}`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                <label className="block mb-1 sm:mb-2 font-semibold text-xs sm:text-base">Message</label>
                <textarea
                  placeholder="Your message..."
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-black text-white text-xs sm:text-base"
                  rows={3}
                  style={{
                    borderRadius: `${config.buttonBorderRadius}px`,
                    border: `${config.strokeWidth}px solid ${config.strokeColor}`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <button
                className={`w-full px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-medium transition-all hover:opacity-90 text-xs sm:text-base ${shadowClass}`}
                style={{
                  backgroundColor: config.buttonBackgroundColor,
                  color: config.buttonTextColor,
                  borderRadius: `${config.buttonBorderRadius}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  alert("Message sent! We'll get back to you soon.")
                }}
              >
                Send Message
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t"
        style={{
          ...getComponentStyle("footer"),
          borderColor: config.strokeColor,
          padding: `${config.containerPadding / 2}px ${config.containerPadding / 3}px`,
          backgroundColor: `${config.sectionBackgroundColor}cc`,
        }}
        onClick={() => onSelectComponent("footer")}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-8 mb-4 sm:mb-8 px-1 sm:px-0">
            <div>
              <h4 className="font-bold mb-2 sm:mb-4 text-xs sm:text-base">Product</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-70">
                <li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectComponent("footer")
                      onSelectChildComponent("footer-link-1")
                    }}
                    className="hover:opacity-100"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectComponent("footer")
                      onSelectChildComponent("footer-link-2")
                    }}
                    className="hover:opacity-100"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectComponent("footer")
                      onSelectChildComponent("footer-link-3")
                    }}
                    className="hover:opacity-100"
                  >
                    Security
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2 sm:mb-4 text-xs sm:text-base">Company</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-70">
                <li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onNavigate("about")
                    }}
                    className="hover:opacity-100"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectComponent("footer")
                      onSelectChildComponent("footer-link-5")
                    }}
                    className="hover:opacity-100"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectComponent("footer")
                      onSelectChildComponent("footer-link-6")
                    }}
                    className="hover:opacity-100"
                  >
                    Careers
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2 sm:mb-4 text-xs sm:text-base">Resources</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-70">
                <li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectComponent("footer")
                      onSelectChildComponent("footer-link-7")
                    }}
                    className="hover:opacity-100"
                  >
                    Docs
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectComponent("footer")
                      onSelectChildComponent("footer-link-8")
                    }}
                    className="hover:opacity-100"
                  >
                    Support
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectComponent("footer")
                      onSelectChildComponent("footer-link-9")
                    }}
                    className="hover:opacity-100"
                  >
                    Community
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2 sm:mb-4 text-xs sm:text-base">Legal</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-70">
                <li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectComponent("footer")
                      onSelectChildComponent("footer-link-10")
                    }}
                    className="hover:opacity-100"
                  >
                    Privacy
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectComponent("footer")
                      onSelectChildComponent("footer-link-11")
                    }}
                    className="hover:opacity-100"
                  >
                    Terms
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectComponent("footer")
                      onSelectChildComponent("footer-link-12")
                    }}
                    className="hover:opacity-100"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div
            className="border-t px-1 sm:px-0"
            style={{ borderColor: config.strokeColor, paddingTop: `${config.containerPadding / 4}px` }}
          >
            <p className="text-center text-xs sm:text-sm opacity-50">
              © 2025 {config.siteName}. All rights reserved. Click any section to edit it.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
