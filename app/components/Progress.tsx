import { useNavigation } from '@remix-run/react'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useSpinDelay } from 'spin-delay'

export function Progress() {
  const transition = useNavigation()
  const busy = transition.state !== 'idle'
  const delayedPending = useSpinDelay(busy, {
    delay: 300,
    minDuration: 500,
  })
  const ref = useRef<HTMLDivElement>(null)
  const [animationComplete, setAnimationComplete] = useState(true)

  useEffect(() => {
    if (!ref.current) return
    if (delayedPending) setAnimationComplete(false)

    const animationPromises = ref.current.getAnimations().map(({ finished }) => finished)

    Promise.allSettled(animationPromises).then(() => {
      if (!delayedPending) setAnimationComplete(true)
    })
  }, [delayedPending])

  return (
    <div
      role="progressbar"
      aria-hidden={delayedPending ? undefined : true}
      aria-valuetext={delayedPending ? 'Loading' : undefined}
      className="fixed inset-x-0 left-0 top-0 z-50 h-[0.25rem] animate-pulse"
    >
      <div
        ref={ref}
        className={clsx(
          'h-full w-0 bg-gradient-to-r from-blue-500 to-purple-500 duration-500 ease-in-out',
          transition.state === 'idle' && (animationComplete ? 'transition-none' : 'w-full opacity-0 transition-all'),
          delayedPending && transition.state === 'submitting' && 'w-5/12',
          delayedPending && transition.state === 'loading' && 'w-9/12'
        )}
      />
    </div>
  )
}
