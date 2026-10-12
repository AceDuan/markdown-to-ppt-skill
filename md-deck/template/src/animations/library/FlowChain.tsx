import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'

/**
 * 模板 2/7 · FlowChain 流程链逐节点点亮
 * 用途：链路/流程/因果链——节点逐个出现、箭头跟随、最后高亮关键节点。
 * 页面内的静态流程用 components/ui.tsx 的 <Flow /> + <Reveal />；
 * 这个动画版本适合"链路本身就是本页主角"的场合。
 */

export const FlowChain: React.FC<{
  nodes: string[]
  /** 最后高亮的节点下标（缺省最后一个） */
  accent?: number
  title?: string
}> = ({ nodes, accent, title }) => {
  const f = useCurrentFrame()
  const hot = accent ?? nodes.length - 1
  const step = 12

  return (
    <AbsoluteFill style={{ background: '#0b0e12', justifyContent: 'center', padding: '0 100px' }}>
      <svg viewBox="0 0 1600 900" style={{ width: '100%', height: '100%' }}>
        {title ? (
          <text x={800} y={120} fill="#e8eaed" fontSize={34} fontWeight={700} textAnchor="middle">
            {title}
          </text>
        ) : null}
        {nodes.map((n, i) => {
          const p = interpolate(f, [20 + i * step, 34 + i * step], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const y = 420
          const nodeW = Math.min(340, 1280 / nodes.length - 24)
          const x = 160 + (1280 / nodes.length) * i + nodeW / 2
          const isHot = i === hot && f > 30 + nodes.length * step
          return (
            <g key={i} opacity={p}>
              <rect
                x={x - nodeW / 2}
                y={y - 52}
                width={nodeW}
                height={104}
                rx={26}
                fill={isHot ? 'rgba(34,211,238,0.12)' : '#1d242d'}
                stroke={isHot ? 'var(--accent)' : '#2a323d'}
                strokeWidth={isHot ? 3 : 2}
              />
              <text
                x={x}
                y={y + 10}
                fill={isHot ? 'var(--accent)' : '#e8eaed'}
                fontSize={Math.min(30, 560 / Math.max(n.length, 6))}
                fontWeight={isHot ? 700 : 400}
                textAnchor="middle"
              >
                {n}
              </text>
              {i < nodes.length - 1 ? (
                <text x={x + nodeW / 2 + (1280 / nodes.length - nodeW) / 2} y={y + 10} fill="#9aa3ae" fontSize={30} textAnchor="middle">
                  →
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
    </AbsoluteFill>
  )
}

export const flowChainFrames = (n: number) => 40 + n * 12
