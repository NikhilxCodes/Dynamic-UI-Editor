"use client"

import type React from "react"

import { useState } from "react"

interface ImageUploadControlProps {
  label: string
  images: string[]
  onImagesChange: (images: string[]) => void
}

export function ImageUploadControl({ label, images, onImagesChange }: ImageUploadControlProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          onImagesChange([...images, result])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const deleteImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
          isDragging ? "border-primary bg-primary/10" : "border-border bg-background/50"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id={`image-upload-${label}`}
        />
        <label htmlFor={`image-upload-${label}`} className="cursor-pointer block">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">Drag images here or click to upload</p>
            <p className="text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
          </div>
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image || "/placeholder.svg"}
                alt={`Feature ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg border border-border"
              />
              <button
                onClick={() => deleteImage(index)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">No images uploaded yet</p>}
    </div>
  )
}
