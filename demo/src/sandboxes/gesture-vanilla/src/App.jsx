import React from 'react'
import { DragGesture } from '@use-gesture/vanilla'
import { a, useSpring } from '@react-spring/web'
import { useControls, button } from 'leva'

import styles from './styles.module.css'

function Draggable() {
  const ref = React.useRef()
  const target = React.useRef()
  const [coords, set] = React.useState({ x: 0, y: 0 })
  const [style, api] = useSpring(() => ({ scale: 1, x: 0, y: 0 }))
  const { boundToParent, ...options } = useControls({
    enabled: true,
    gesture: { options: ['offset', 'movement'] },
    touch: false,
    capture: true,
    lock: false,
    boundToParent: false
  })

  React.useEffect(() => {
    const gesture = new DragGesture(
      target.current,
      ({ active, ...state }) => {
        let [x, y] = state[options.gesture]
        // set({ x, y })

        if (options.lock) {
          const dx = window.innerWidth / 2 - 40
          const dy = window.innerHeight / 2 - 40
          x = ((x + Math.sign(x) * dx) % window.innerWidth) - Math.sign(x) * dx
          y = ((y + Math.sign(y) * dy) % window.innerHeight) - Math.sign(y) * dy
        }
        api.start({
          scale: active ? 1.2 : 1,
          x: active || options.gesture === 'offset' ? x : 0,
          y: active || options.gesture === 'offset' ? y : 0,
          immediate: options.lock
        })
      },
      { ...options, ...(boundToParent && { bounds: ref.current }) }
    )
    return () => gesture.destroy()
  }, [api, boundToParent, options])

  return (
    <>
      <a.div ref={target} tabIndex="-1" className={styles.drag} style={style}>
        <div>
          <span>vanilla</span>
          <span>
            x:{Math.round(coords.x)}, y:{Math.round(coords.y)}
          </span>
        </div>
      </a.div>
      <div ref={ref} className={styles.hover} />
    </>
  )
}

export default function App() {
  const [shown, show] = React.useState(true)
  useControls({ [shown ? 'Hide' : 'Show']: button(() => show((s) => !s)) }, [shown])
  return (
    <div className="flex fill center">
      <Draggable />
    </div>
  )
}