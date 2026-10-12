import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'

/**
 * 模板 1/7 · GrowBars 增长条形对比
 * 用途：几个方案的量化对比、动态范围/容量等"谁大谁小"一目了然的场景。
 * props.bars 换数据即可复用；配合 FigureFrame.extraControls 可加排序/切换按钮。
 */

export interface GrowBar {
  label: string
  value: number
  /** 条上显示的文字（默认取 value） */
  display?: string
  color?: string
}

export const GrowBars: React.FC<{
  bars: GrowBar[]
  /** 满刻度（缺省取最大值 ×1.15） */
  max?: number
  unit?: string
  title?: string
}> = ({ bars, max, unit = '', title }) => {
  const f = useCurrentFrame()
  const maxValue = max ?? Math.max(...bars.map((b) => b.value)) * 1.15
  const labelW = 320

  return (
    <AbsoluteFill style={{ background: '#0b0e12' }}>
      <svg viewBox="0 0 1600 900" style={{ width: '100%', height: '100%' }}>
        {title ? (
          <text x={800} y={70} fill="#e8eaed" fontSize={32} fontWeight={700} textAnchor="middle">
            {title}
          </text>
        ) : null}
        {bars.map((b, i) => {
          const p = interpolate(f, [10 + i * 10, 30 + i * 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const y = 170 + i * (560 / Math.max(bars.length, 1))
          const w = Math.max(4, (b.value / maxValue) * 1050 * p)
          return (
            <g key={i}>
              <text x={labelW - 24} y={y + 34} fill="#e8eaed" fontSize={30} textAnchor="end">
                {b.label}
              </text>
              <rect x={labelW} y={y} width={1050} height={58} rx={10} fill="#171c23" stroke="#2a323d" strokeWidth={1.5} />
              <rect x={labelW} y={y} width={w} height={58} rx={10} fill={b.color ?? 'var(--accent)'} opacity={0.8} />
              <text x={labelW + w + 20} y={y + 40} fill={b.color ?? 'var(--accent)'} fontSize={30} fontWeight={700} opacity={p}>
                {b.display ?? `${(b.value * p).toFixed(b.value % 1 === 0 ? 0 : 1)}${unit}`}
              </text>
            </g>
          )
        })}
      </svg>
    </AbsoluteFill>
  )
}

export const growBarsFrames = (n: number) => 40 + n * 10
