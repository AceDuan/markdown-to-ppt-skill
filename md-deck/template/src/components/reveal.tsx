import { createContext, useContext } from 'react'
import type { CSSProperties, ReactNode } from 'react'

/** 当前页已推进到的分步数（0 = 初始状态），由 App 注入 */
export const SlideCtx = createContext(0)
export const useStep = () => useContext(SlideCtx)

/**
 * 分步显示：order <= 当前 step 时可见。
 * 用透明度+位移过渡，占位不变，版面稳定。
 */
export function Reveal({
  order,
  children,
  style,
}: {
  order: number
  children: ReactNode
  style?: CSSProperties
}) {
  const step = useStep()
  const on = step >= order
  return (
    <div
      style={{
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(14px)',
        transition: 'opacity .4s ease, transform .4s ease',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
