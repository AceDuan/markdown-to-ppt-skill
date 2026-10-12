import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'

/**
 * 模板 7/7 · DualView 双视角（组合 ↔ 分解）
 * 用途："几样东西叠加成一条曲线 / 一个整体" ⇄ "拆开看各占多少"。
 * 左侧：成分波逐个画出 → 叠加成一条复合曲线；右侧：频谱式分量杆。
 * 经典用法：时域 ↔ 频域；也适用于成本构成、信号合成、配方比例等。
 */

export interface DualViewComponent {
  label: string
  color?: string
  /** 空间频率（窗口内周期数） */
  freq: number
  /** 幅度 0..1（同时决定右杆高度） */
  amp: number
  /** 相位（缺省各不相同） */
  phase?: number
}

export const DualView: React.FC<{
  components: DualViewComponent[]
  leftTitle?: string
  rightTitle?: string
  sumLabel?: string
}> = ({ components, leftTitle = '时域：一条波形', rightTitle = '转 90° 从侧面看 → 频域', sumLabel = '叠加 ＝ 你平时看到的那条「波形」' }) => {
  const f = useCurrentFrame()
  const n = components.length
  const draw = (i: number) =>
    interpolate(f, [10 + i * 26, 34 + i * 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const sumP = interpolate(f, [16 + n * 26, 50 + n * 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const specP = interpolate(f, [56 + n * 26, 88 + n * 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const X0 = 110
  const X1 = 830
  const comp = (i: number, t: number) =>
    components[i].amp * Math.sin(2 * Math.PI * components[i].freq * t + (components[i].phase ?? i * 1.1))
  const sum = (t: number) => components.reduce((acc, _, i) => acc + comp(i, t), 0)

  const wavePath = (fn: (t: number) => number, yC: number, amp: number, p: number) => {
    const pts: string[] = []
    for (let t = 0; t <= p; t += 0.004) pts.push(`${X0 + t * (X1 - X0)},${yC - fn(t) * amp}`)
    return pts.join(' ')
  }

  const ROW_GAP = 120
  const ROWS = components.map((_, i) => 190 + i * ROW_GAP)
  const SUM_Y = 190 + n * ROW_GAP + 60
  const SUM_AMP = 110
  const barsBase = 800
  const barsX = components.map((_, i) => 1080 + i * 170)

  return (
    <AbsoluteFill style={{ background: '#0b0e12' }}>
      <svg viewBox="0 0 1600 900" style={{ width: '100%', height: '100%' }}>
        <text x={X0} y={70} fill="#e8eaed" fontSize={32} fontWeight={700}>
          {leftTitle}
        </text>
        <text x={1020} y={70} fill="#e8eaed" fontSize={32} fontWeight={700}>
          {rightTitle}
        </text>

        {components.map((c, i) => (
          <g key={i}>
            <line x1={X0} y1={ROWS[i]} x2={X1} y2={ROWS[i]} stroke="#232b34" strokeWidth={1.5} />
            <polyline
              points={wavePath((t) => comp(i, t), ROWS[i], 52, draw(i))}
              fill="none"
              stroke={c.color ?? 'var(--accent)'}
              strokeWidth={3}
            />
            <text x={X1 + 16} y={ROWS[i] + 8} fill={c.color ?? 'var(--accent)'} fontSize={25}>
              {c.label}（{c.amp}）
            </text>
          </g>
        ))}

        <text x={X0} y={SUM_Y - SUM_AMP - 18} fill="#e8eaed" fontSize={26} opacity={sumP}>
          {sumLabel}
        </text>
        <line x1={X0} y1={SUM_Y} x2={X1} y2={SUM_Y} stroke="#232b34" strokeWidth={1.5} />
        <polyline points={wavePath(sum, SUM_Y, SUM_AMP, sumP)} fill="none" stroke="#e8eaed" strokeWidth={4.5} />

        <line x1={1000} y1={barsBase + 20} x2={1540} y2={barsBase + 20} stroke="#3a434f" strokeWidth={2} />
        {components.map((c, i) => {
          const h = specP * c.amp * 620
          return (
            <g key={i}>
              <rect x={barsX[i] - 26} y={barsBase - h} width={52} height={h} fill={c.color ?? 'var(--accent)'} opacity={0.8} rx={5} />
              <text x={barsX[i]} y={barsBase - h - 14} fill={c.color ?? 'var(--accent)'} fontSize={25} textAnchor="middle" opacity={specP}>
                {c.amp}
              </text>
              <text x={barsX[i]} y={barsBase + 52} fill="#9aa3ae" fontSize={24} textAnchor="middle">
                {c.label}
              </text>
            </g>
          )
        })}
      </svg>
    </AbsoluteFill>
  )
}

export const dualViewFrames = (n: number) => 90 + n * 26
