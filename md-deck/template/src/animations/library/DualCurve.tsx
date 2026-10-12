import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'

/**
 * 模板 4/7 · DualCurve 双曲线对比
 * 用途：两条关系曲线的对照（如线性 vs 对数、两条政策曲线），逐面板画出。
 * panels 支持 1–3 个；每条曲线是一个 (u: 0→1) => 高度(-1..1) 的函数。
 */

export interface CurvePanel {
  title: string
  fn: (u: number) => number
  color?: string
  xLabel?: string
  yLabel?: string
}

export const DualCurve: React.FC<{ panels: CurvePanel[]; durationInFrames?: number }> = ({
  panels,
  durationInFrames = 100,
}) => {
  const f = useCurrentFrame()
  const n = Math.min(Math.max(panels.length, 1), 3)
  const drawP = interpolate(f, [10, durationInFrames - 25], [0, 1], { extrapolateRight: 'clamp' })
  const labelP = interpolate(f, [durationInFrames - 22, durationInFrames - 8], [0, 1], {
    extrapolateRight: 'clamp',
  })

  const panelW = 1380 / n

  return (
    <AbsoluteFill style={{ background: '#0b0e12' }}>
      <svg viewBox="0 0 1600 900" style={{ width: '100%', height: '100%' }}>
        {panels.slice(0, n).map((p, i) => {
          const x0 = 110 + i * (panelW + 40)
          const cx = x0 + 60
          const cy = 640
          const cw = panelW - 120
          const ch = 420
          const pts: string[] = []
          for (let u = 0; u <= drawP; u += 0.01) {
            pts.push(`${cx + u * cw},${cy - p.fn(u) * (ch / 2 - 30)}`)
          }
          return (
            <g key={i}>
              <rect x={x0} y={110} width={panelW - 40} height={640} rx={14} fill="#11161d" stroke="#2a323d" strokeWidth={2} />
              <text x={x0 + 24} y={152} fill="#e8eaed" fontSize={29} fontWeight={700}>
                {p.title}
              </text>
              {/* 坐标轴 */}
              <line x1={cx} y1={cy - ch / 2 + 20} x2={cx} y2={cy + ch / 2 - 20} stroke="#3a434f" strokeWidth={2.5} />
              <line x1={cx} y1={cy} x2={cx + cw} y2={cy} stroke="#3a434f" strokeWidth={2.5} />
              {p.yLabel ? (
                <text x={cx - 16} y={cy - ch / 2 + 60} fill="#9aa3ae" fontSize={24} textAnchor="end">
                  {p.yLabel}
                </text>
              ) : null}
              {p.xLabel ? (
                <text x={cx + cw - 6} y={cy + 38} fill="#9aa3ae" fontSize={24} textAnchor="end">
                  {p.xLabel}
                </text>
              ) : null}
              {pts.length > 1 ? (
                <polyline points={pts.join(' ')} fill="none" stroke={p.color ?? 'var(--accent)'} strokeWidth={4} />
              ) : null}
            </g>
          )
        })}
      </svg>
    </AbsoluteFill>
  )
}

export const dualCurveFrames = () => 100
