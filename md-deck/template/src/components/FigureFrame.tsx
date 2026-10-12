import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Player, type PlayerRef } from '@remotion/player'

/**
 * 动画统一容器：Remotion Player + 播放/暂停/重播/进度条。
 * 所有 Remotion 动画都包在这里，保证全课交互一致。
 */
export function FigureFrame({
  title,
  durationInFrames,
  fps = 30,
  compositionWidth = 1600,
  compositionHeight = 900,
  loop = true,
  autoPlay = true,
  component,
  inputProps,
  extraControls,
  style,
}: {
  title?: ReactNode
  durationInFrames: number
  fps?: number
  compositionWidth?: number
  compositionHeight?: number
  loop?: boolean
  autoPlay?: boolean
  component: React.ComponentType<Record<string, unknown>> | React.ComponentType<any>
  inputProps?: Record<string, unknown>
  /** 追加到控件行的自定义控件（如频率切换按钮） */
  extraControls?: ReactNode
  style?: CSSProperties
}) {
  const ref = useRef<PlayerRef>(null)
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const p = ref.current
    if (!p) return
    const onFrame = (e: { detail: { frame: number } }) => setFrame(e.detail.frame)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    p.addEventListener('frameupdate', onFrame)
    p.addEventListener('play', onPlay)
    p.addEventListener('pause', onPause)
    return () => {
      p.removeEventListener('frameupdate', onFrame)
      p.removeEventListener('play', onPlay)
      p.removeEventListener('pause', onPause)
    }
  }, [])

  const toggle = () => ref.current?.toggle()
  const restart = () => {
    ref.current?.seekTo(0)
    ref.current?.play()
  }

  return (
    <div
      className="card"
      style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, ...style }}
    >
      {title ? (
        <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 10, color: 'var(--accent)' }}>
          {title}
        </div>
      ) : null}
      <div style={{ flex: 1, minHeight: 0 }}>
        <Player
          ref={ref}
          component={component as React.ComponentType<Record<string, unknown>>}
          inputProps={inputProps}
          durationInFrames={durationInFrames}
          compositionWidth={compositionWidth}
          compositionHeight={compositionHeight}
          fps={fps}
          loop={loop}
          autoPlay={autoPlay}
          style={{ width: '100%', height: '100%', borderRadius: 10, background: '#0b0e12' }}
        />
      </div>
      <div className="fig-controls">
        <button className="fig-btn" onClick={toggle} style={{ minWidth: 64 }}>
          {playing ? '⏸' : '▶'}
        </button>
        <button className="fig-btn" onClick={restart}>
          ↺ 重播
        </button>
        <input
          className="fig-slider"
          type="range"
          min={0}
          max={durationInFrames - 1}
          value={frame}
          onChange={(e) => ref.current?.seekTo(Number(e.target.value))}
        />
        <span className="fig-time">
          {(frame / fps).toFixed(1)}s / {(durationInFrames / fps).toFixed(1)}s
        </span>
        {extraControls}
      </div>
    </div>
  )
}
