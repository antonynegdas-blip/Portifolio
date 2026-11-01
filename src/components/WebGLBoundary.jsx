import { Component, useEffect, useState } from 'react'

function checkWebGLSupport() {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}

export default function WebGLBoundary({ children, fallback = null }) {
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(checkWebGLSupport())
  }, [])

  if (!supported) {
    return fallback
  }

  return <CanvasErrorBoundary fallback={fallback}>{children}</CanvasErrorBoundary>
}
