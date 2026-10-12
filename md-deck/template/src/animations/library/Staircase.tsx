import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'

/**
 * 模板 5/7 · Staircase 量化阶梯
 * 用途：任何"连续 → 离散"的演示（测量精度、等级划分、评分档位）。
 * levels 越大台阶越细；下方误差带直观显示"存放值与真实值之差"。
 */

export const Staircase: React.FC<{
  /** 离散等级数（屏幕最多画 256 级，更高级别阶梯已细到不可见） */
  levels?: number
  /** 标题里的等级说明，如 "16 bit" */
  label?: string
  /** 连续信号的形状函数，u∈[0,1]，返回 -1..1 */
  waveFn?: (u: number) => number
  title?: string
}> = ({ levels = 4, label, waveFn = (u) => 0.72 * Math.sin(2 * Math.PI * 1.6 * u) + 0.2 * Math.sin(2 * Math.PI * 3.2 * u + 1.2), title }) => {
  const f = useCurrentFrame()
  const L = Math.min(Math.max(Math.round(levels), 2), 256)
  const q = (w: number) => Math.round(w * (L / 2)) / (L / 2)

  const X0 = 140
  const X1 = 1460
  const YC = 330
  const AMP = 190
  const p = interpolate(f, [0, 70], [0, 1], { extrapolateRight: 'clamp' })
  const errP = interpolate(f, [72, 84], [0, 1], { extrapolateRight: 'clamp' })

  const raw: string[] = []
  const stair: string[] = []
  const xEnd = X0 + (X1 - X0) * p
  for (let x = X0; x <= xEnd; x += 2) {
    const u = (x - X0) / (X1 - X0)
    const w = waveFn(u)
    raw.push(`${x},${YC - w * AMP}`)
    stair.push(`${x},${YC - q(w) * AMP}`)
  }

  const residualAmp = Math.max(9, (AMP / L) * 2.4)
  const errPts: string[] = []
  const Y_E = 620
  for (let x = X0; x <= xEnd; x += 2) {
    const u = (x - X0) / (X1 - X0)
    const r = waveFn(u) - q(waveFn(u))
    errPts.push(`${x},${Y_E - r * residualAmp * 6}`)
  }

  return (
    <AbsoluteFill style={{ background: '#0b0e12' }}>
      <svg viewBox="0 0 1600 900" style={{ width: '100%', height: '100%' }}>
        <text x={40} y={52} fill="#e8eaed" fontSize={32} fontWeight={700}>
          连续 → 离散{label ? `（${label}）` : ''}：{L} 个等级
        </text>

        <rect x={60} y={80} width={1480} height={500} rx={14} fill="#11161d" stroke="#2a323d" strokeWidth={2} />
        <line x1={X0} y1={YC} x2={X1} y2={YC} stroke="#2a323d" strokeWidth={2} />
        <polyline points={raw.join(' ')} fill="none" stroke="#8b95a5" strokeWidth={3} opacity={0.85} />
        <polyline points={stair.join(' ')} fill="none" stroke="var(--accent)" strokeWidth={L <= 4 ? 5 : 3} />
        <text x={X1 - 20} y={YC - AMP - 22} fill="#8b95a5" fontSize={26} textAnchor="end">
          真实值（连续）
        </text>
        <text x={X0 + 20} y={YC + AMP + 44} fill="var(--accent)" fontSize={26}>
          量化后（只能落在 {L} 个等级上）
        </text>

        <g opacity={errP}>
          <text x={40} y={560} fill="#f5a623" fontSize={28} fontWeight={700}>
            误差（真实 − 存放值）：
          </text>
          <rect x={60} y={570} width={1480} height={200} rx={12} fill="#11161d" stroke="#2a323d" strokeWidth={2} />
          <line x1={X0} y1={Y_E} x2={X1} y2={Y_E} stroke="#2a323d" strokeWidth={2} />
          <polyline points={errPts.join(' ')} fill="none" stroke="#f5a623" strokeWidth={2} />
        </g>

        <text x={800} y={878} fill="#6b7480" fontSize={26} textAnchor="middle">
          等级越多 → 台阶越细 → 误差越小
        </text>
      </svg>
    </AbsoluteFill>
  )
}

export const STAIRCASE_FRAMES = 90
