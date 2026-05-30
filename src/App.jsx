import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, MeshTransmissionMaterial, Text, Sparkles, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from '@react-three/postprocessing'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

function WaterBottle({ phase }) {
  const groupRef = useRef()
  const bottleRef = useRef()
  const capRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.4
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      {/* Bottle body */}
      <mesh ref={bottleRef} position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 2.5, 32, 1, true]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={0.3}
          roughness={0.02}
          transmission={1}
          ior={1.45}
          chromaticAberration={0.08}
          anisotropy={0.2}
          distortion={0.3}
          distortionScale={0.2}
          temporalDistortion={0.4}
          color="#a8d8f0"
          attenuationDistance={1}
          attenuationColor="#E0F7FA"
        />
      </mesh>
      {/* Water fill inside */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.32, 0.37, 1.8, 32]} />
        <meshStandardMaterial color="#1a8fd1" transparent opacity={0.4} roughness={0} metalness={0.1} />
      </mesh>
      {/* Cap */}
      <mesh ref={capRef} position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.2, 0.35, 0.25, 32]} />
        <meshStandardMaterial color="#0077B6" metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -1.28, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.06, 32]} />
        <meshStandardMaterial color="#0096C7" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Brand label area */}
      <mesh position={[0, 0, 0.38]}>
        <planeGeometry args={[0.65, 1.2]} />
        <meshStandardMaterial color="#023E8A" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

function WaterDrops() {
  const ref = useRef()
  const count = 40
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i*3] = (Math.random() - 0.5) * 6
    positions[i*3+1] = (Math.random() - 0.5) * 6
    positions[i*3+2] = (Math.random() - 0.5) * 4
  }
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.05
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#90E0EF" transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

function WaterRipple({ radius, speed }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * speed) * 0.15)
    ref.current.material.opacity = 0.3 + Math.sin(clock.getElapsedTime() * speed) * 0.15
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI/2, 0, 0]} position={[0, -2, 0]}>
      <ringGeometry args={[radius - 0.05, radius, 64]} />
      <meshStandardMaterial color="#00B4D8" transparent opacity={0.3} emissive="#00B4D8" emissiveIntensity={0.5} />
    </mesh>
  )
}

const adPhases = [
  { headline: 'PURE.', sub: 'Sourced from Alpine springs', color: '#90E0EF' },
  { headline: 'PRISTINE.', sub: 'Zero additives. Zero compromises.', color: '#48CAE4' },
  { headline: 'AQUA NOVA.', sub: 'Nature\'s finest. Bottled perfectly.', color: '#00B4D8' },
]

export default function App() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % adPhases.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const current = adPhases[phase]

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} style={{ position: 'absolute', inset: 0 }}>
        <color attach="background" args={['#010B18']} />
        <fog attach="fog" args={['#010B18', 10, 20]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 5, 3]} intensity={3} color="#00B4D8" castShadow />
        <pointLight position={[-3, -2, 2]} intensity={1.5} color="#90E0EF" />
        <pointLight position={[0, -3, 0]} intensity={1} color="#0077B6" />
        <Stars radius={40} depth={20} count={1500} factor={2} fade />
        <Float speed={0.5} floatIntensity={0.2}>
          <WaterBottle phase={phase} />
        </Float>
        <WaterDrops />
        <Sparkles count={30} scale={5} size={1} speed={0.2} color="#90E0EF" />
        <WaterRipple radius={1.5} speed={1.2} />
        <WaterRipple radius={2.5} speed={0.8} />
        <WaterRipple radius={3.5} speed={0.5} />
        <Environment preset="night" />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} intensity={2.5} />
          <ChromaticAberration offset={[0.002, 0.002]} />
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={1} />
        </EffectComposer>
      </Canvas>

      {/* Overlay UI */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 60px' }}>
        {/* Logo */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}}>
          <p style={{fontFamily:'Bebas Neue',fontSize:'14px',letterSpacing:'8px',color:'#90E0EF',opacity:0.7}}>AQUA NOVA</p>
        </motion.div>

        {/* Headline */}
        <AnimatePresence mode="wait">
          <motion.div key={phase} initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-40}} transition={{duration:0.6}}>
            <h1 style={{fontFamily:'Bebas Neue',fontSize:'clamp(60px,12vw,140px)',lineHeight:0.9,color:'#fff',textShadow:`0 0 60px ${current.color}`,marginBottom:'16px'}}>{current.headline}</h1>
            <p style={{fontSize:'16px',fontWeight:200,letterSpacing:'4px',color:'#90E0EF',textTransform:'uppercase'}}>{current.sub}</p>
          </motion.div>
        </AnimatePresence>

        {/* Bottom bar */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <div>
            <p style={{fontFamily:'Bebas Neue',fontSize:'36px',color:'#00B4D8',letterSpacing:'3px'}}>TASTE THE MOUNTAIN</p>
            <p style={{fontSize:'11px',letterSpacing:'4px',color:'rgba(255,255,255,0.4)',marginTop:'4px'}}>PREMIUM HYDRATION SINCE 2019</p>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            {adPhases.map((_,i)=>(
              <div key={i} style={{width: i===phase?24:8, height:8, borderRadius:'4px', background: i===phase?'#00B4D8':'rgba(255,255,255,0.2)', transition:'all 0.3s'}}/>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
