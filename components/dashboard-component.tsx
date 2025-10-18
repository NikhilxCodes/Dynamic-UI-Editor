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
          padding: `${config.containerPadding / 2}px ${config.containerPadding}px`,
        }}
        onClick={() => onSelectComponent("header")}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            {config.siteLogo ? (
              <img
                src={config.siteLogo || "/placeholder.svg"}
                alt="Logo"
                className="rounded-lg object-contain"
                style={{
                  height: `${config.siteLogoSize || 40}px`,
                  width: `${config.siteLogoSize || 40}px`,
                }}
              />
            ) : (
              <div
                className="rounded-lg"
                style={{
                  backgroundColor: config.buttonBackgroundColor,
                  height: `${config.siteLogoSize || 40}px`,
                  width: `${config.siteLogoSize || 40}px`,
                }}
              />
            )}
            <span className="text-xl font-bold">{config.siteName}</span>
          </div>
          <nav className="flex gap-6 items-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNavigate("home")
              }}
              className={`hover:opacity-70 transition-opacity ${
                config.currentPage === "home" ? "opacity-100 font-bold" : "opacity-70"
              }`}
            >
              Home
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNavigate("about")
              }}
              className={`hover:opacity-70 transition-opacity ${
                config.currentPage === "about" ? "opacity-100 font-bold" : "opacity-70"
              }`}
            >
              About
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNavigate("services")
              }}
              className={`hover:opacity-70 transition-opacity ${
                config.currentPage === "services" ? "opacity-100 font-bold" : "opacity-70"
              }`}
            >
              Services
            </button>
            <a href="#contact" className="hover:opacity-70 transition-opacity">
              Contact
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleEditor()
              }}
              className="ml-4 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              title={isEditorOpen ? "Close editor" : "Open editor"}
            >
              {isEditorOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          padding: `${config.containerPadding}px`,
        }}
      >
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Section */}
          <section
            className="py-20 text-center rounded-lg"
            style={{
              ...getComponentStyle("hero"),
              backgroundColor: "#1A1A1A",
              borderRadius: `${config.cardBorderRadius}px`,
            }}
            onClick={() => onSelectComponent("hero")}
          >
            <h1
              className="font-bold mb-4"
              style={{
                fontSize: `${config.baseFontSize * 3}px`,
              }}
            >
              {config.componentTitleContent?.["hero"] || currentPageConfig.heroTitle}
            </h1>
            <p
              className="mb-8 opacity-80"
              style={{
                fontSize: `${config.baseFontSize * 1.2}px`,
              }}
            >
              {config.componentDescriptionContent?.["hero"] || currentPageConfig.heroDescription}
            </p>
            <button
              className={`px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90 ${shadowClass}`}
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
                className="text-3xl font-bold mb-8 text-center"
                style={{
                  fontSize: `${config.baseFontSize * 2}px`,
                }}
              >
                Features
              </h2>
              <div
                className="grid grid-cols-1 md:grid-cols-3"
                style={{
                  gap: `${config.galleryGap}px`,
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
                      className="p-6 rounded-lg"
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
                          className="w-full h-32 object-cover rounded-lg mb-4"
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
                          className="w-full h-32 object-cover rounded-lg mb-4"
                          style={{
                            borderRadius: `${galleryStyle.imageBorderRadius || config.imageBorderRadius}px`,
                            width: `${galleryStyle.imageSize || 100}%`,
                            height: `${(galleryStyle.imageSize || 100) * 0.4}px`,
                          }}
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-lg mb-4"
                          style={{
                            backgroundColor: config.buttonBackgroundColor,
                          }}
                        />
                      )}
                      <h3 className="font-bold mb-2">
                        {config.componentTitleContent?.[featureCardId] || `Feature ${i}`}
                      </h3>
                      <p className="text-sm opacity-70">
                        {config.componentDescriptionContent?.[featureCardId] ||
                          "Description of your amazing feature goes here."}
                      </p>
                      {config.componentTextContent?.[featureCardId] && (
                        <p className="text-sm mt-2">{config.componentTextContent[featureCardId]}</p>
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
              className="p-8 rounded-lg"
              style={{
                ...getComponentStyle("about-content"),
                backgroundColor: "#1A1A1A",
                borderRadius: `${config.cardBorderRadius}px`,
              }}
              onClick={() => onSelectComponent("about-content")}
            >
              <h2
                className="font-bold mb-4"
                style={{
                  fontSize: `${config.baseFontSize * 2}px`,
                }}
              >
                Our Story
              </h2>
              <p className="opacity-80 mb-4">
                Founded in 2024, we believe in empowering creators with the tools they need to build amazing websites.
              </p>
              <p className="opacity-80">
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
                className="text-3xl font-bold mb-8 text-center"
                style={{
                  fontSize: `${config.baseFontSize * 2}px`,
                }}
              >
                {config.componentTitleContent?.["services-content"] || "Our Services"}
              </h2>
              <p
                className="text-center mb-8 opacity-80"
                style={{
                  fontSize: `${config.baseFontSize * 1.1}px`,
                }}
              >
                {config.componentDescriptionContent?.["services-content"] ||
                  "Comprehensive solutions for your website needs"}
              </p>
              <div
                className="grid grid-cols-1 md:grid-cols-3"
                style={{
                  gap: `${config.galleryGap}px`,
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
                      className="p-6 rounded-lg text-center"
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
                          className="w-16 h-16 rounded-lg mb-4 mx-auto object-cover"
                          style={{
                            borderRadius: `${galleryStyle.imageBorderRadius || config.imageBorderRadius}px`,
                            width: `${(galleryStyle.imageSize || 100) * 0.16}px`,
                            height: `${(galleryStyle.imageSize || 100) * 0.16}px`,
                          }}
                        />
                      ) : (
                        <div
                          className="w-16 h-16 rounded-lg mb-4 mx-auto"
                          style={{
                            backgroundColor: config.buttonBackgroundColor,
                          }}
                        />
                      )}
                      <h3 className="font-bold mb-2">{config.componentTitleContent?.[serviceCardId] || service}</h3>
                      <p className="text-sm opacity-70">
                        {config.componentDescriptionContent?.[serviceCardId] ||
                          `Professional ${service.toLowerCase()} services tailored to your needs.`}
                      </p>
                      {config.componentTextContent?.[serviceCardId] && (
                        <p className="text-sm mt-2">{config.componentTextContent[serviceCardId]}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Call to Action Section */}
          <section
            className="py-16 text-center rounded-lg"
            style={{
              ...getComponentStyle("cta"),
              backgroundColor: "#1A1A1A",
              borderRadius: `${config.cardBorderRadius}px`,
            }}
            onClick={() => onSelectComponent("cta")}
          >
            <h2
              className="font-bold mb-4"
              style={{
                fontSize: `${config.baseFontSize * 2}px`,
              }}
            >
              {config.componentTitleContent?.["cta"] || "Ready to Get Started?"}
            </h2>
            <p className="mb-6 opacity-80">
              {config.componentDescriptionContent?.["cta"] || "Join thousands of users creating amazing websites"}
            </p>
            <button
              className={`px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90 ${shadowClass}`}
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
            className="p-8 rounded-lg"
            id="contact"
            style={{
              ...getComponentStyle("contact"),
              backgroundColor: "#1A1A1A",
              borderRadius: `${config.cardBorderRadius}px`,
            }}
            onClick={() => onSelectComponent("contact")}
          >
            <h2
              className="font-bold mb-6 text-center"
              style={{
                fontSize: `${config.baseFontSize * 2}px`,
              }}
            >
              Get In Touch
            </h2>
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block mb-2 font-semibold">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-2 rounded-lg bg-black text-white"
                  style={{
                    borderRadius: `${config.buttonBorderRadius}px`,
                    border: `${config.strokeWidth}px solid ${config.strokeColor}`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg bg-black text-white"
                  style={{
                    borderRadius: `${config.buttonBorderRadius}px`,
                    border: `${config.strokeWidth}px solid ${config.strokeColor}`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Message</label>
                <textarea
                  placeholder="Your message..."
                  className="w-full px-4 py-2 rounded-lg bg-black text-white"
                  rows={4}
                  style={{
                    borderRadius: `${config.buttonBorderRadius}px`,
                    border: `${config.strokeWidth}px solid ${config.strokeColor}`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <button
                className={`w-full px-6 py-2 rounded-lg font-medium transition-all hover:opacity-90 ${shadowClass}`}
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
          padding: `${config.containerPadding}px`,
          backgroundColor: `${config.sectionBackgroundColor}cc`,
        }}
        onClick={() => onSelectComponent("footer")}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm opacity-70">
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
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm opacity-70">
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
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm opacity-70">
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
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-70">
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
            className="border-t"
            style={{ borderColor: config.strokeColor, paddingTop: `${config.containerPadding / 2}px` }}
          >
            <p className="text-center text-sm opacity-50">
              © 2025 {config.siteName}. All rights reserved. Click any section to edit it.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
