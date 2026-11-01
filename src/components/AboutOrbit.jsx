import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import WebGLBoundary from './WebGLBoundary'

function OrbitRingGeometry({ rx, rz, color, opacity = 0.45, dashed = false }) {
  const lineObj = useMemo(() => {
    const segments = 128
    const pts = []
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * rx, 0, Math.sin(a) * rz))
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(pts)
    const material = dashed
      ? new THREE.LineDashedMaterial({
          color,
          transparent: true,
          opacity,
          dashSize: 0.14,
          gapSize: 0.12,
        })
      : new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity,
        })
    const line = new THREE.Line(geometry, material)
    if (dashed) line.computeLineDistances()
    return line
  }, [rx, rz, color, opacity, dashed])

  useEffect(() => {
    return () => {
      lineObj.geometry.dispose()
      lineObj.material.dispose()
    }
  }, [lineObj])

  return <primitive object={lineObj} />
}

function OrbitSystem3D({
  items,
  darkMode,
  isPaused,
  hoveredIndex,
  setHoveredIndex,
  activeIndex,
  setActiveIndex,
  stagePointer,
}) {
  const { viewport } = useThree()
  const systemRef = useRef(null)
  const nodeRefs = useRef([])
  const cardRefs = useRef([])
  const dustRef = useRef(null)
  const angleRef = useRef(0)
  const speedRef = useRef(0.28)
  const targetAngleRef = useRef(null)
  const tempVec = useMemo(() => new THREE.Vector3(), [])

  const rx = Math.min(2.65, Math.max(1.22, viewport.width * 0.34))
  const rz = Math.min(1.58, Math.max(0.92, viewport.width * 0.22))

  const accentColor = darkMode ? '#c7ff4a' : '#8ab816'
  const lineColor = darkMode ? '#4b4b47' : '#c2c2b9'
  const secondaryLine = darkMode ? '#333330' : '#dadad1'

  const dustPositions = useMemo(() => {
    const count = 64
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const rScale = 0.35 + Math.random() * 0.95
      arr[i * 3] = Math.cos(a) * 2.8 * rScale
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.9
      arr[i * 3 + 2] = Math.sin(a) * 1.8 * rScale
    }
    return arr
  }, [])

  const handleSelectNode = (idx) => {
    setActiveIndex(idx)
    // Smoothly align clicked node toward front-center (Math.PI / 2 in Z)
    const baseAngle = (idx / items.length) * Math.PI * 2
    const desiredTotal = Math.PI / 2 - baseAngle
    const current = angleRef.current
    const diff =
      THREE.MathUtils.euclideanModulo(desiredTotal - current + Math.PI, Math.PI * 2) -
      Math.PI
    targetAngleRef.current = current + diff
  }

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)

    // Interactive tilt toward mouse pointer
    if (systemRef.current) {
      const targetRotX = 0.22 + stagePointer.current.y * 0.14
      const targetRotZ = -0.04 - stagePointer.current.x * 0.1
      systemRef.current.rotation.x = THREE.MathUtils.lerp(
        systemRef.current.rotation.x,
        targetRotX,
        0.07
      )
      systemRef.current.rotation.z = THREE.MathUtils.lerp(
        systemRef.current.rotation.z,
        targetRotZ,
        0.07
      )
    }

    if (targetAngleRef.current !== null) {
      const remaining = targetAngleRef.current - angleRef.current
      if (Math.abs(remaining) < 0.004) {
        angleRef.current = targetAngleRef.current
        targetAngleRef.current = null
      } else {
        angleRef.current += remaining * Math.min(1, delta * 5.5)
      }
    } else {
      const shouldPause = isPaused || hoveredIndex !== null
      const desiredSpeed = shouldPause ? 0 : 0.28
      speedRef.current = THREE.MathUtils.lerp(speedRef.current, desiredSpeed, 0.08)
      angleRef.current += delta * speedRef.current
    }

    if (dustRef.current) {
      dustRef.current.rotation.y -= delta * 0.07
    }

    const count = items.length
    for (let i = 0; i < count; i++) {
      const node = nodeRefs.current[i]
      if (!node) continue

      const theta = (i / count) * Math.PI * 2 + angleRef.current
      const x = Math.cos(theta) * rx
      const z = Math.sin(theta) * rz
      const y = Math.sin(theta * 2) * 0.12

      node.position.set(x, y, z)
      node.getWorldPosition(tempVec)

      const cardEl = cardRefs.current[i]
      if (cardEl) {
        const depthNorm = THREE.MathUtils.clamp(
          (tempVec.z + rz) / (2 * rz || 1),
          0,
          1
        )
        const isHighlighted = hoveredIndex === i || activeIndex === i
        const scale = isHighlighted ? 1.07 : 0.82 + depthNorm * 0.22
        const opacity = isHighlighted ? 1 : 0.54 + depthNorm * 0.46
        cardEl.style.transform = `scale(${scale.toFixed(3)})`
        cardEl.style.opacity = opacity.toFixed(3)
      }
    }
  })

  return (
    <group ref={systemRef} position={[0, -0.15, 0]} rotation={[0.22, 0, -0.04]}>
      {/* Main orbital track */}
      <OrbitRingGeometry rx={rx} rz={rz} color={lineColor} opacity={0.7} />

      {/* Outer subtle accent guide track */}
      <OrbitRingGeometry
        rx={rx * 1.12}
        rz={rz * 1.12}
        color={accentColor}
        opacity={darkMode ? 0.22 : 0.3}
        dashed
      />

      {/* Inner minimal shared-center guide ring (no heavy sun, purely orbital center) */}
      <OrbitRingGeometry
        rx={rx * 0.36}
        rz={rz * 0.36}
        color={secondaryLine}
        opacity={0.6}
        dashed
      />

      {/* Minimalist center axis marker */}
      <group position={[0, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.09, 0.115, 32]} />
          <meshBasicMaterial
            color={accentColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.75}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.032, 16, 16]} />
          <meshBasicMaterial color={accentColor} />
        </mesh>
      </group>

      {/* Ambient orbital dust */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={accentColor}
          size={0.03}
          sizeAttenuation
          transparent
          opacity={darkMode ? 0.55 : 0.45}
        />
      </points>

      {/* Orbiting information nodes */}
      {items.map((item, idx) => {
        const isHighlighted = hoveredIndex === idx || activeIndex === idx
        return (
          <group
            key={item.id}
            ref={(el) => {
              nodeRefs.current[idx] = el
            }}
          >
            {/* 3D planet marker on the orbital ring */}
            <mesh>
              <sphereGeometry args={[isHighlighted ? 0.08 : 0.056, 20, 20]} />
              <meshBasicMaterial
                color={
                  isHighlighted
                    ? accentColor
                    : darkMode
                      ? '#f4f4f0'
                      : '#171717'
                }
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry
                args={[
                  isHighlighted ? 0.12 : 0.088,
                  isHighlighted ? 0.145 : 0.104,
                  28,
                ]}
              />
              <meshBasicMaterial
                color={accentColor}
                side={THREE.DoubleSide}
                transparent
                opacity={isHighlighted ? 0.95 : 0.52}
              />
            </mesh>
            {/* Vertical tether connecting the 3D planet to its floating card */}
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.22, 6]} />
              <meshBasicMaterial
                color={isHighlighted ? accentColor : lineColor}
                transparent
                opacity={isHighlighted ? 0.9 : 0.55}
              />
            </mesh>

            {/* Floating editorial info card tethered above the 3D planet */}
            <Html
              center
              position={[0, 0.34, 0]}
              zIndexRange={[30, 1]}
              style={{ pointerEvents: 'none' }}
            >
              <button
                type="button"
                ref={(el) => {
                  cardRefs.current[idx] = el
                }}
                className={`orbit-node-card ${isHighlighted ? 'is-active' : ''}`}
                style={{ pointerEvents: 'auto' }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(idx)}
                onBlur={() => setHoveredIndex(null)}
                onClick={() => handleSelectNode(idx)}
              >
                <span className="orbit-node-top">
                  <span className="orbit-node-index">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="orbit-node-dot" />
                </span>
                <span className="orbit-node-label">{item.label}</span>
                <strong className="orbit-node-value">{item.value}</strong>
              </button>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

function FallbackOrbit2D({
  items,
  isPaused,
  hoveredIndex,
  setHoveredIndex,
  activeIndex,
  setActiveIndex,
}) {
  const cardRefs = useRef([])
  const angleRef = useRef(0)

  useEffect(() => {
    let rafId
    let last = performance.now()

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!isPaused && hoveredIndex === null) {
        angleRef.current += dt * 0.34
      }
      const count = items.length
      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i]
        if (!el) continue
        const theta = (i / count) * Math.PI * 2 + angleRef.current
        const xPct = Math.cos(theta) * 34
        const yPct = Math.sin(theta) * 32
        const depth = (Math.sin(theta) + 1) / 2
        const scale = 0.84 + depth * 0.2
        const opacity = 0.58 + depth * 0.42
        el.style.left = `${50 + xPct}%`
        el.style.top = `${50 + yPct}%`
        el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`
        el.style.opacity = opacity.toFixed(3)
        el.style.zIndex = String(Math.round(depth * 20) + 2)
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [items.length, isPaused, hoveredIndex])

  return (
    <div className="orbit-fallback-stage">
      <div className="orbit-fallback-ring ring-outer" />
      <div className="orbit-fallback-ring ring-inner" />
      <div className="orbit-fallback-center" />
      {items.map((item, idx) => {
        const isHighlighted = hoveredIndex === idx || activeIndex === idx
        return (
          <button
            type="button"
            key={item.id}
            ref={(el) => {
              cardRefs.current[idx] = el
            }}
            className={`orbit-node-card orbit-fallback-card ${isHighlighted ? 'is-active' : ''}`}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setActiveIndex(idx)}
          >
            <span className="orbit-node-top">
              <span className="orbit-node-index">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="orbit-node-dot" />
            </span>
            <span className="orbit-node-label">{item.label}</span>
            <strong className="orbit-node-value">{item.value}</strong>
          </button>
        )
      })}
    </div>
  )
}

export default function AboutOrbit({ items, darkMode, labels }) {
  const [isPaused, setIsPaused] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const stagePointer = useRef({ x: 0, y: 0 })

  const activeItem = items[hoveredIndex ?? activeIndex] ?? items[0]

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    stagePointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    stagePointer.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1
  }

  const handlePointerLeave = () => {
    stagePointer.current.x = 0
    stagePointer.current.y = 0
  }

  return (
    <div
      className="about-orbit-wrapper"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="about-orbit-topbar">
        <span className="orbit-hint">
          <span className="orbit-live-pulse" />
          {labels.orbitHint}
        </span>
        <button
          type="button"
          className="orbit-pause-btn"
          onClick={() => setIsPaused((prev) => !prev)}
          aria-pressed={isPaused}
        >
          {isPaused ? `▶ ${labels.resume}` : `⏸ ${labels.pause}`}
        </button>
      </div>

      <div className="about-orbit-canvas">
        <WebGLBoundary
          fallback={
            <FallbackOrbit2D
              items={items}
              isPaused={isPaused}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          }
        >
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [0, 1.85, 5.9], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={1} />
            <OrbitSystem3D
              items={items}
              darkMode={darkMode}
              isPaused={isPaused}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              stagePointer={stagePointer}
            />
          </Canvas>
        </WebGLBoundary>
      </div>

      {/* Focused orbital item detail bar underneath */}
      {activeItem && (
        <div className="about-orbit-detail" key={activeItem.id}>
          <div className="orbit-detail-header">
            <span className="orbit-detail-tag">{activeItem.label}</span>
            <strong>{activeItem.value}</strong>
          </div>
          <p>{activeItem.detail}</p>
        </div>
      )}
    </div>
  )
}
