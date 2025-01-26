import { useEffect, useRef, useState } from 'react'
import WAVES from 'vanta/dist/vanta.waves.min'
import * as THREE from 'three'

export function WaveBackground() {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const vantaRef = useRef(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        WAVES({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x0,
          shininess: 60.00,
          waveHeight: 20.00,
          waveSpeed: 0.75,
          zoom: 0.65
        })
      )
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return <div ref={vantaRef} className="fixed inset-0 -z-10" />
}
