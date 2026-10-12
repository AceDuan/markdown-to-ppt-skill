import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'

/**
 * 模板 3/7 · RulerChart 横向标尺 / 分布条
 * 用途：把一组数值放到一条轴上建立直觉（如等级标尺、价格带、时间线）。
 * zones 画彩色区段（如安全/危险），marks 打标注点（上下交替防重叠）。
 * log: true 时按对数刻度定位（频率跨度大的场合）。
 */

export interface RulerZone {
  from: number
  to: number
  color: string
  label?: string
}

export interface RulerMark {
  value: number
  label: string
  sub?: string
  /** true = 标注在轴上方（缺省上下交替） */
  up?: boolean
}

export const RulerChart: React.FC<{
  min: number
  max: number
  log?: boolean
  zones?: RulerZone[]
  marks: RulerMark[]
  title?: string
}> = ({ min, max, log = false, zones = [], marks, title }) => {
  const f = useCurrentFrame()
  const X0 = 110
  const X1 = 1430
  const barY = 300

  const xOf = (v: number) => {
    const a = log ? Math.log10(Math.max(v, min)) : v
    const b = log ? Math.log10(max) : max
    const c = log ? Math.log10(min) : min
    return X0 + ((a - c) / (b - c)) * (X1 - X0)
  }

  const barP = interpolate(f, [0, 26], [0, 1], { extrapolateRight: 'clamp' })
  const zoneP = interpolate(f, [20, 34], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ background: '#0b0e12' }}>
      <svg viewBox="0 0 1600 900" style={{ width: '100%', height: '100%' }}>
        {title ? (
          <text x={800} y={110} fill="#e8eaed" fontSize={34} fontWeight={700} textAnchor="middle">
            {title}
          </text>
        ) : null}

        {/* 轴 */}
        <line x1={X0 - 20} y1={barY + 30} x2={X1 + 20} y2={barY + 30} stroke="#3a434f" strokeWidth={4} />

        {/* 区段 */}
        {zones.map((z, i) => (
          <g key={i} opacity={zoneP}>
            <rect
              x={xOf(z.from)}
              y={barY}
              width={Math.max(2, xOf(z.to) - xOf(z.from))}
              height={30}
              fill={z.color}
              opacity={0.55}
              rx={4}
            />
            {z.label ? (
              <text
                x={(xOf(z.from) + xOf(z.to)) / 2}
                y={barY - 14}
                fill={z.color}
                fontSize={26}
                fontWeight={700}
                textAnchor="middle"
              >
                {z.label}
              </text>
            ) : null}
          </g>
        ))}

        {/* 标注点（上下交替） */}
        {marks.map((m, i) => {
          const p = interpolate(f, [36 + i * 7, 48 + i * 7], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const up = m.up ?? i % 2 === 0
          const x = xOf(m.value)
          return (
            <g key={i} opacity={p}>
              <line x1={x} y1={up ? barY - 12 : barY + 30} x2={x} y2={up ? barY - 44 : barY + 62} stroke="#9aa3ae" strokeWidth={2} />
              <text x={x} y={up ? barY - 58 : barY + 96} fill="#e8eaed" fontSize={27} textAnchor="middle">
                {m.label}
              </text>
              {m.sub ? (
                <text x={x} y={up ? barY - 92 : barY + 130} fill="#9aa3ae" fontSize={24} textAnchor="middle">
                  {m.sub}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
    </AbsoluteFill>
  )
}

export const rulerFrames = (n: number) => 50 + n * 7
