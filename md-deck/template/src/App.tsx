import { useEffect, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { deck, chapters, type SlideDef } from './deck'
import { SlideCtx } from './components/reveal'

function parseHash(): number {
  const m = window.location.hash.match(/#\/(\d+)/)
  const n = m ? parseInt(m[1], 10) : 1
  return Math.min(Math.max(n, 1), deck.length) - 1
}

export default function App() {
  const [idx, setIdx] = useState(parseHash)
  const [step, setStep] = useState(0)
  const [overview, setOverview] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [scale, setScale] = useState(1)

  const slide: SlideDef = deck[idx]

  useEffect(() => {
    try {
      history.replaceState(null, '', `#/${idx + 1}`)
    } catch {
      // file:// 协议下部分浏览器不允许 replaceState，退化为同文档 hash 替换
      location.replace(`#/${idx + 1}`)
    }
  }, [idx])

  // 支持地址栏 hash 直接跳页 / 浏览器前进后退
  useEffect(() => {
    const onHash = () => {
      setIdx(parseHash())
      setStep(0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const onResize = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080))
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const next = () => {
    if (step < (slide.steps ?? 0)) setStep(step + 1)
    else if (idx < deck.length - 1) {
      setIdx(idx + 1)
      setStep(0)
    }
  }
  const prev = () => {
    if (step > 0) setStep(step - 1)
    else if (idx > 0) {
      const p = idx - 1
      setIdx(p)
      setStep(deck[p].steps ?? 0) // 回退时显示上一页的完整状态
    }
  }
  const jump = (i: number) => {
    setIdx(i)
    setStep(0)
    setOverview(false)
  }

  // 点击翻页（翻页笔/触屏兜底）：点在按钮、滑条等交互控件上不翻页
  const onStageClick = (e: ReactMouseEvent) => {
    const t = e.target as HTMLElement
    if (t.closest('button, input, a, .fig-controls')) return
    if (e.detail > 1) return
    next()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
        case 'PageDown':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault()
          prev()
          break
        case 'f':
        case 'F':
          if (document.fullscreenElement) void document.exitFullscreen()
          else void document.documentElement.requestFullscreen()
          break
        case 'g':
        case 'G':
        case 'o':
        case 'O':
          setOverview((v) => !v)
          break
        case 'n':
        case 'N':
          setNotesOpen((v) => !v)
          break
        case 'Home':
          jump(0)
          break
        case 'End':
          jump(deck.length - 1)
          break
        case 'Escape':
          setOverview(false)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <>
      <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }} onClick={onStageClick}>
        <SlideCtx.Provider value={step}>
          <div className="slide" key={slide.id}>
            {slide.render()}
          </div>
        </SlideCtx.Provider>
        <div className="footer">
          <span>
            第 {idx + 1} / {deck.length} 页 · {chapters[slide.chapter]}
          </span>
          <span>← → / 点击 翻页 · 空格 分步 · F 全屏 · G 目录 · N 备注</span>
        </div>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${((idx + 1) / deck.length) * 100}%` }} />
        </div>
      </div>

      {overview ? (
        <div className="overlay" onClick={() => setOverview(false)}>
          <h2>目录总览（共 {deck.length} 页 · 点击跳转 · Esc 关闭）</h2>
          {chapters.map((name, ci) => {
            const items = deck.map((s, i) => ({ s, i })).filter((x) => x.s.chapter === ci)
            if (!items.length) return null
            return (
              <div key={ci} className="ov-chapter" onClick={(e) => e.stopPropagation()}>
                <div className="ov-chapter-name">{name}</div>
                <div className="ov-grid">
                  {items.map(({ s, i }) => (
                    <button key={s.id} className={`ov-item${i === idx ? ' current' : ''}`} onClick={() => jump(i)}>
                      <span className="no">{i + 1}</span>
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}

      {notesOpen ? (
        <div className="notes-panel">
          <h3>
            当前页 · {idx + 1} {slide.title}
          </h3>
          <div className="note-block">{slide.notes ?? '（无备注）'}</div>
          {idx < deck.length - 1 ? (
            <>
              <h3>下一页 · {deck[idx + 1].title}</h3>
              <div className="note-block">{deck[idx + 1].notes ?? '（无备注）'}</div>
            </>
          ) : null}
          <h3>提示</h3>
          <div>
            按 <b>N</b> 关闭备注 · <b>G</b> 目录 · <b>F</b> 全屏
            <br />
            <span className="next-title">下一页：{idx < deck.length - 1 ? deck[idx + 1].title : '（已到末页）'}</span>
          </div>
        </div>
      ) : null}
    </>
  )
}
