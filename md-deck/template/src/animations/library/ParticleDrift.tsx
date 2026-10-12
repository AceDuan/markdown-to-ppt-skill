import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'

/**
 * 模板 6/7 · ParticleDrift 粒子漂移聚散
 * 用途："沙粒归位"类演示——大量粒子在某个场里迁移、最终聚成稳定图案
 * （如共振节线、吸引域、概率分布）。换 field 函数即换图案。
 * fields 数组：每段一个场函数，段与段之间图案重组，体现"条件变了、稳态变了"。
 * 确定性：位置全部按帧预算（useRef 里一次算完），纯帧函数渲染，循环无缝。
 */

const SEG = 110
const WARMUP = 150

function mulberry32(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const ParticleDrift: React.FC<{
  N?: number
  /** 每段一个场函数 m(u,v)，u/v∈[0,1]；粒子迁往 |m| 小处（场的"节线"） */
  fields: Array<(u: number, v: number) => number>
  /** 每段标签（与 fields 等长） */
  labels?: string[]
  title?: string
}> = ({ N = 420, fields, labels, title }) => {
  const f = useCurrentFrame()
  const segs = Math.max(1, fields.length)
  const DUR = segs * SEG

  // 一次性预算所有帧的粒子位置（挂 useRef，组件重渲染不重算）
  const posRef = React.useRef<Float32Array | null>(null)
  if (!posRef.current) {
    const rnd = mulberry32(20260101)
    const xs = new Float32Array(N)
    const ys = new Float32Array(N)
    const pos = new Float32Array((DUR + 1) * N * 2)
    for (let i = 0; i < N; i++) {
      xs[i] = rnd()
      ys[i] = rnd()
    }
    const step = (seg: number) => {
      const field = fields[Math.min(segs - 1, seg)]
      for (let i = 0; i < N; i++) {
        const m = field(xs[i], ys[i])
        const h = 0.001
        const dmx = (field(xs[i] + h, ys[i]) - field(xs[i] - h, ys[i])) / (2 * h)
        const dmy = (field(xs[i], ys[i] + h) - field(xs[i], ys[i] - h)) / (2 * h)
        let dx = -0.06 * 2 * m * dmx + (rnd() - 0.5) * 0.0035
        let dy = -0.06 * 2 * m * dmy + (rnd() - 0.5) * 0.0035
        const len = Math.hypot(dx, dy)
        const cap = 2.5 / 1000
        if (len > cap) {
          dx = (dx / len) * cap
          dy = (dy / len) * cap
        }
        xs[i] = Math.min(0.99, Math.max(0.01, xs[i] + dx))
        ys[i] = Math.min(0.99, Math.max(0.01, ys[i] + dy))
      }
    }
    for (let w = 0; w < WARMUP; w++) step(0) // 预热：开场即是成形图案
    const store = (fr: number) => {
      for (let i = 0; i < N; i++) {
        pos[(fr * N + i) * 2] = xs[i]
        pos[(fr * N + i) * 2 + 1] = ys[i]
      }
    }
    store(0)
    for (let fr = 1; fr <= DUR; fr++) {
      step(fr - 1)
      store(fr)
    }
    posRef.current = pos
  }
  const pos = posRef.current
  const fi = Math.min(DUR, f)
  const segIdx = Math.min(segs - 1, Math.floor(f / SEG))

  const PX0 = 320
  const PY0 = 130
  const PW = 960
  const PH = 620

  const dots: React.ReactElement[] = []
  for (let i = 0; i < N; i++) {
    dots.push(
      <circle
        key={i}
        cx={PX0 + pos[(fi * N + i) * 2] * PW}
        cy={PY0 + pos[(fi * N + i) * 2 + 1] * PH}
        r={2.8}
        fill="#e6c87a"
        opacity={0.92}
      />,
    )
  }

  return (
    <AbsoluteFill style={{ background: '#0b0e12' }}>
      <svg viewBox="0 0 1600 900" style={{ width: '100%', height: '100%' }}>
        {title ? (
          <text x={800} y={64} fill="#e8eaed" fontSize={34} fontWeight={700} textAnchor="middle">
            {title}
          </text>
        ) : null}
        <rect x={PX0} y={PY0} width={PW} height={PH} rx={14} fill="#141a21" stroke="#3a434f" strokeWidth={3} />
        {dots}
        {labels ? (
          <text x={PX0 - 30} y={PY0 - 30} fill="var(--accent)" fontSize={28} fontWeight={700}>
            {labels[segIdx]}
          </text>
        ) : null}
      </svg>
    </AbsoluteFill>
  )
}

export const particleDriftFrames = (fields: number) => fields * SEG
