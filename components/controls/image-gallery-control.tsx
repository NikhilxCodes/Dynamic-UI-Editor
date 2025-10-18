"use client"

import type React from "react"
import { useState } from "react"
import { GripVertical, Trash2, Plus } from "lucide-react"

interface ImageGalleryControlProps {
  label: string
  images: string[]
  onImagesChange: (images: string[]) => void
  componentName?: string
}

export function ImageGalleryControl({ label, images, onImagesChange, componentName }: ImageGalleryControlProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [imageSizes, setImageSizes] = useState<Record<number, number>>({})

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
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    const newSizes = { ...imageSizes }
    delete newSizes[index]
    setImageSizes(newSizes)
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null)
    }
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
    setSelectedImageIndex(toIndex)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOverItem = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      moveImage(draggedIndex, index)
      setDraggedIndex(index)
    }
  }

  const updateImageSize = (index: number, size: number) => {
    setImageSizes({ ...imageSizes, [index]: size })
  }

  const getImageSize = (index: number) => {
    return imageSizes[index] || 100
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">{label}</label>
        {componentName && <span className="text-xs text-muted-foreground">{componentName}</span>}
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragging ? "border-primary bg-primary/10" : "border-border bg-background/50"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id={`image-gallery-upload-${label}`}
        />
        <label htmlFor={`image-gallery-upload-${label}`} className="cursor-pointer block">
          <Plus className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">Drag images here or click to upload</p>
            <p className="text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
          </div>
        </label>
      </div>

      {/* Gallery View */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">{images.length} image(s) uploaded</p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 gap-3">
            {images.map((image, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={() => handleDragOverItem(index)}
                onDragEnd={() => setDraggedIndex(null)}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative group cursor-move rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index
                    ? "border-primary ring-2 ring-primary/50"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-24 object-cover"
                  style={{
                    opacity: getImageSize(index) / 100,
                  }}
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1 text-white text-xs bg-black/50 px-2 py-1 rounded">
                    <GripVertical className="w-3 h-3" />
                    <span>Drag</span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteImage(index)
                  }}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                  title="Delete image"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                {/* Image Index Badge */}
                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Image Details Panel */}
          {selectedImageIndex !== null && (
            <div className="p-3 bg-secondary/20 rounded-lg border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">Image {selectedImageIndex + 1}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag to reorder • Click to select • Hover to delete
                  </p>
                </div>
                <button
                  onClick={() => deleteImage(selectedImageIndex)}
                  className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-xs hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium">Image Size</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={getImageSize(selectedImageIndex)}
                    onChange={(e) => updateImageSize(selectedImageIndex, Number(e.target.value))}
                    className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-medium w-12 text-right">{getImageSize(selectedImageIndex)}%</span>
                </div>
                <p className="text-xs text-muted-foreground">Adjust image size from 50% to 150%</p>
              </div>
            </div>
          )}
        </div>
      )}

      {images.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No images uploaded yet</p>}
    </div>
  )
}
