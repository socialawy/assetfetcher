'use client'

import { useEffect, useRef } from 'react'

interface ModelViewerProps {
  src?: string
  alt?: string
  autoRotate?: boolean
  cameraControls?: boolean
  style?: React.CSSProperties
  className?: string
}

export function ModelViewer({ 
  src, 
  alt, 
  autoRotate = false, 
  cameraControls = false, 
  style, 
  className 
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      import('@google/model-viewer').then(() => {
        const modelViewer = document.createElement('model-viewer')
        modelViewer.setAttribute('src', src || '')
        if (alt) modelViewer.setAttribute('alt', alt)
        if (autoRotate) modelViewer.setAttribute('auto-rotate', '')
        if (cameraControls) modelViewer.setAttribute('camera-controls', '')
        if (style) Object.assign(modelViewer.style, style)
        if (className) modelViewer.className = className
        
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
          containerRef.current.appendChild(modelViewer)
        }
      })
    }
  }, [src, alt, autoRotate, cameraControls, style, className])

  return <div ref={containerRef} style={style} className={className} />
}
