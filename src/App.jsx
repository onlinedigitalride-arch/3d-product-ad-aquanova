import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment, MeshTransmissionMaterial, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { getProject, types } from '@theatre/core'
import { motion, AnimatePresence } from 'framer-motion'
import { aquaState } from './theatre/aquaState'
import * as THREE from 'three'

const project = getProject('AquaNova Ad', { state: aquaState })
const sheet = project.sheet('AquaNovaAd')

function TheatreCamera() {
  const { camera } = useThree()
  useEffect(() => {
    const camObj = sheet.object('Camera', {
      position: types.compound({
        x: types.number(0,{range:[-10,10]}), y: types.number(0,{range:[-5,5]}), z: types.number(6,{range:[2,15]}),
      }),
      fov: types.number(50,{range:[20,90]}),
    })
    const unsub = camObj.onValuesChange((v) => {
      camera.position.set(v.position.x, v.position.y, v.position.z)
      camera.fov = v.fov; camera.updateProjectionMatrix()
    })
    return unsub
  }, [camera])
  return null
}

function TheatreBottle() {
  const groupRef = useRef()
  const lightRef = useRef()
  useEffect(() => {
    const bottleObj = sheet.object('Bottle', {
      position: types.compound({ x: types.number(0,{range:[-4,4]}), y: types.number(0,{range:[-8,4]}), z: types.number(0,{range:[-4,4]}) }),
      rotation: types.compound({ y: types.number(0,{range:[-Math.PI*4,Math.PI*4]}) }),
      scale: types.number(1,{range:[0,2]}),
    })
    const lightObj = sheet.object('KeyLight', {
      intensity: types.number(3,{range:[0,10]}), posX: types.number(3,{range:[-8,8]}), posY: types.number(5,{range:[-8,8]}), posZ: types.number(3,{range:[-8,8]}),
    })
    const unsubBottle = bottleObj.onValuesChange((v) => {
      if (!groupRef.current) return
      groupRef.current.position.set(v.position.x, v.position.y, v.position.z)
      groupRef.current.rotation.y = v.rotation.y
      groupRef.current.scale.setScalar(v.scale)
    })
    const unsubLight = lightObj.onValuesChange((v) => {
      if (!lightRef.current) return
      lightRef.current.intensity = v.intensity
      lightRef.current.position.set(v.posX, v.posY, v.posZ)
    })
    sheet.sequence.play({ iterationCount: 1, range: [0, 8] })
    return () => { unsubBottle(); unsubLight() }
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    if (t > 8) { groupRef.current.position.y = Math.sin(t*0.6)*0.12; groupRef.current.rotation.y += 0.004 }
  })

  return (
    <>
      <pointLight ref={lightRef} position={[3,5,3]} intensity={3} color="#4FC3F7" castShadow />
      <group ref={groupRef} position={[0,-6,0]} scale={0.2}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.42, 2.6, 48, 1, false]} />
          <MeshTransmissionMaterial backside samples={8} thickness={0.4} roughness={0.01} transmission={1} ior={1.5} chromaticAberration={0.04} anisotropy={0.2} distortion={0.2} distortionScale={0.1} temporalDistortion={0.2} color="#E0F7FA" attenuationDistance={1.5} attenuationColor="#B2EBF2" />
        </mesh>
        <mesh position={[0,-0.25,0]}>
          <cylinderGeometry args={[0.30, 0.38, 1.9, 32]} />
          <meshStandardMaterial color="#29B6F6" transparent opacity={0.3} roughness={0} />
        </mesh>
        <mesh position={[0,1.45,0]}>
          <cylinderGeometry args={[0.22, 0.35, 0.28, 32]} />
          <meshStandardMaterial color="#0288D1" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0,0.1,0.39]}>
          <planeGeometry args={[0.6,1.4]} />
          <meshStandardMaterial color="#0277BD" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0,-1.32,0]}>
          <cylinderGeometry args={[0.42,0.42,0.07,32]} />
          <meshStandardMaterial color="#0288D1" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </>
  )
}

function WaterRipple({ radius, speed, delay=0 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + delay
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(t*speed)*0.1)
      ref.current.material.opacity = 0.15 + Math.sin(t*speed)*0.08
    }
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI/2,0,0]} position={[0,-2.2,0]}>
      <ringGeometry args={[radius-0.04, radius, 80]} />
      <meshStandardMaterial color="#29B6F6" transparent opacity={0.15} />
    </mesh>
  )
}

const adPhases = [
  { headline:'PURE.',     sub:'Sourced from Alpine springs at 3200m',   color:'#0288D1' },
  { headline:'PRISTINE.', sub:'Zero additives. Zero compromises.',       color:'#0277BD' },
  { headline:'ALIVE.',    sub:'Naturally mineralised. pH balanced 7.4', color:'#01579B' },
  { headline:'AQUA NOVA.',sub:"Nature's finest. Bottled perfectly.",    color:'#0288D1' },
]

export default function App() {
  const [phase, setPhase] = useState(0)
  useEffect(() => { const id = setInterval(()=>setPhase(p=>(p+1)%adPhases.length),2800); return ()=>clearInterval(id) }, [])
  const cur = adPhases[phase]

  return (
    <div style={{width:'100vw',height:'100vh',position:'relative',overflow:'hidden'}}>
      <Canvas camera={{position:[0,0,10],fov:50}} shadows style={{position:'absolute',inset:0}}>
        <color attach="background" args={['#E0F7FA']} />
        <fog attach="fog" args={['#E0F7FA',12,25]} />
        <ambientLight intensity={2} />
        <directionalLight position={[5,10,5]} intensity={2} color="#FFF8E1" castShadow />
        <pointLight position={[-4,-2,2]} intensity={1} color="#B2EBF2" />
        <TheatreCamera />
        <TheatreBottle />
        <Sparkles count={30} scale={6} size={1} speed={0.2} color="#29B6F6" />
        <WaterRipple radius={1.5} speed={1.4} delay={0} />
        <WaterRipple radius={2.6} speed={1.0} delay={1} />
        <WaterRipple radius={3.8} speed={0.7} delay={2} />
        <mesh rotation={[-Math.PI/2,0,0]} position={[0,-2.5,0]}>
          <planeGeometry args={[20,20]}/>
          <meshStandardMaterial color="#B2EBF2" roughness={0.8} transparent opacity={0.5}/>
        </mesh>
        <Environment preset="dawn" />
        <EffectComposer>
          <Bloom luminanceThreshold={0.9} intensity={0.3} />
        </EffectComposer>
      </Canvas>

      {/* Light UI overlay */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'44px 64px'}}>
        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{delay:0.5}}>
          <p style={{fontFamily:'Bebas Neue',fontSize:'13px',letterSpacing:'10px',color:'#0277BD',opacity:0.7}}>AQUA NOVA</p>
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={phase} initial={{opacity:0,y:50,filter:'blur(8px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} exit={{opacity:0,y:-30,filter:'blur(4px)'}} transition={{duration:0.7}}>
            <h1 style={{fontFamily:'Bebas Neue',fontSize:'clamp(64px,13vw,160px)',lineHeight:0.88,color:cur.color,marginBottom:'18px'}}>{cur.headline}</h1>
            <p style={{fontSize:'15px',fontWeight:300,letterSpacing:'5px',color:'#0288D1',textTransform:'uppercase',opacity:0.85}}>{cur.sub}</p>
          </motion.div>
        </AnimatePresence>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <div>
            <p style={{fontFamily:'Bebas Neue',fontSize:'32px',color:'#0277BD',letterSpacing:'4px'}}>TASTE THE MOUNTAIN</p>
            <p style={{fontSize:'10px',letterSpacing:'5px',color:'rgba(2,119,189,0.5)',marginTop:'5px'}}>PREMIUM HYDRATION — ALPINE SOURCED</p>
          </div>
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            {adPhases.map((_,i)=>(
              <div key={i} style={{height:6,borderRadius:3,background:i===phase?'#0288D1':'rgba(2,136,209,0.2)',width:i===phase?28:8,transition:'all 0.4s ease'}}/>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
