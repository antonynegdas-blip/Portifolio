import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import WebGLBoundary from './WebGLBoundary'

function KineticSculpture({ darkMode, mouseRef }) {
  const rootRef = useRef(null)
  const outerRef = useRef(null)
  const coreRef = useRef(null)
  const ringARef = useRef(null)
  const ringBRef = useRef(null)
  const particlesRef = useRef(null)
  const satARef = useRef(null)
  const satBRef = useRef(null)
  const timeRef = useRef(0)

  const accentColor = darkMode ? '#c7ff4a' : '#8ab816'
  const wireColor = darkMode ? '#4b4b47' : '#bdbdb4'
  const coreFill = darkMode ? '#222220' : '#eaeae3'
  const ringMuted = darkMode ? '#5e5e59' : '#a8a89f'

  const coreEdges = useMemo(() => {
    const base = new THREE.OctahedronGeometry(0.92, 0)
    const edges = new THREE.EdgesGeometry(base)
    base.dispose()
    return edges
  }, [])

  const particlePositions = useMemo(() => {
    const count = 90
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 1.7 + Math.random() * 1.9
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    return positions
  }, [])

  useEffect(() => {
    return () => {
      coreEdges.dispose()
    }
  }, [coreEdges])

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    timeRef.current += delta
    const t = timeRef.current

    const targetX = mouseRef.current.y * 0.38
    const targetY = mouseRef.current.x * 0.48

    if (rootRef.current) {
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        targetX,
        0.06
      )
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        targetY,
        0.06
      )
      rootRef.current.position.y = Math.sin(t * 1.15) * 0.1
    }

    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.16
      outerRef.current.rotation.x = t * 0.09
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.34
      coreRef.current.rotation.z = Math.sin(t * 0.7) * 0.25
    }

    if (ringARef.current) {
      ringARef.current.rotation.z = t * 0.42
    }

    if (ringBRef.current) {
      ringBRef.current.rotation.z = -t * 0.3
    }

    if (satARef.current) {
      satARef.current.position.set(
        Math.cos(t * 0.9) * 1.95,
        Math.sin(t * 0.9) * 1.95,
        0
      )
    }

    if (satBRef.current) {
      satBRef.current.position.set(
        Math.cos(-t * 0.65 + 1.4) * 2.28,
        Math.sin(-t * 0.65 + 1.4) * 2.28,
        0
      )
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.06
      particlesRef.current.rotation.x = Math.sin(t * 0.2) * 0.12
    }
  })

  return (
    <group ref={rootRef}>
      {/* Outer wireframe geodesic cage */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.62, 1]} />
        <meshBasicMaterial
          color={wireColor}
          wireframe
          transparent
          opacity={darkMode ? 0.34 : 0.45}
        />
      </mesh>

      {/* Inner faceted core + crisp lime edges */}
      <group ref={coreRef}>
        <mesh>
          <octahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color={coreFill}
            roughness={0.35}
            metalness={0.25}
          />
        </mesh>
        <lineSegments geometry={coreEdges}>
          <lineBasicMaterial color={accentColor} />
        </lineSegments>
      </group>

      {/* Primary tilted accent orbital ring */}
      <group rotation={[1.08, 0.32, 0.18]}>
        <mesh ref={ringARef}>
          <torusGeometry args={[1.95, 0.011, 16, 120]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.85} />
        </mesh>
        <mesh ref={satARef}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshBasicMaterial color={accentColor} />
        </mesh>
      </group>

      {/* Secondary counter-tilted structural ring */}
      <group rotation={[-0.72, -0.5, 0.4]}>
        <mesh ref={ringBRef}>
          <torusGeometry args={[2.28, 0.009, 16, 120]} />
          <meshBasicMaterial color={ringMuted} transparent opacity={0.55} />
        </mesh>
        <mesh ref={satBRef}>
          <sphereGeometry args={[0.048, 14, 14]} />
          <meshBasicMaterial color={darkMode ? '#f4f4f0' : '#171717'} />
        </mesh>
      </group>

      {/* Floating ambient particle cloud */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={accentColor}
          size={0.036}
          sizeAttenuation
          transparent
          opacity={darkMode ? 0.75 : 0.65}
        />
      </points>
    </group>
  )
}

export default function HeroScene({ darkMode }) {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  return (
    <div className="hero-canvas-wrap" aria-hidden="true">
      <WebGLBoundary
        fallback={
          <div className="hero-fallback-orb">
            <span className="hero-fallback-ring ring-1" />
            <span className="hero-fallback-ring ring-2" />
            <span className="hero-fallback-core" />
          </div>
        }
      >
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 5.4], fov: 44 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={darkMode ? 0.8 : 1.2} />
          <directionalLight position={[4, 5, 4]} intensity={1.4} />
          <pointLight position={[-3, -2, 3]} intensity={0.8} color="#c7ff4a" />
          <KineticSculpture darkMode={darkMode} mouseRef={mouseRef} />
        </Canvas>
      </WebGLBoundary>
    </div>
  )
}
