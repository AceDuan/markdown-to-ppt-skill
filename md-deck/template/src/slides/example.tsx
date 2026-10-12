import { useState } from 'react'
import { Reveal } from '../components/reveal'
import { FigureFrame } from '../components/FigureFrame'
import { Bullets, Callout, Flow, Panel, SectionDivider, SummaryCard } from '../components/ui'
import { GrowBars, growBarsFrames, type GrowBar } from '../animations/library/GrowBars'

/* 示例：每一页就是一个普通 React 组件。替换成你的真实内容即可。 */

/* P01 封面 */
export const P01 = () => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div className="kicker">md-deck · 示例演示文稿</div>
    <h1 style={{ fontSize: 96, fontWeight: 800, letterSpacing: 4 }}>你的主题标题</h1>
    <div style={{ fontSize: 34, color: 'var(--muted)', marginTop: 20 }}>
      一句话副标题：这份演示解决什么问题
    </div>
    <div style={{ fontSize: 26, color: 'var(--muted)', marginTop: 48 }}>
      理解导向 · 全程演示环境：XXX
    </div>
  </div>
)

/* P02 章节封面 */
export const P02 = () => (
  <SectionDivider
    num="01"
    title="第一章标题"
    subtitle="本章一句话概述"
    items={['要点一', '要点二', '要点三']}
  />
)

/* P03 概念页：第一组内容进页即可见，第二组起用 Reveal 分步 */
export const P03 = () => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'center' }}>
    <Flow nodes={['输入', '处理', '输出']} hot={1} />
    <Reveal order={1}>
      <div style={{ display: 'flex', gap: 24 }}>
        <Panel title="概念 A" accent="var(--accent-1)">
          <Bullets items={[<>要点一</>, <>要点二</>]} />
        </Panel>
        <Panel title="概念 B" accent="var(--accent-2)">
          <div style={{ fontSize: 28, lineHeight: 1.7 }}>支持性说明文字，一页只讲一个观点。</div>
        </Panel>
      </div>
    </Reveal>
    <Reveal order={2}>
      <Callout type="tip" title="一句话小结">
        把本页最重要的认知用一句加粗的话收尾。
      </Callout>
    </Reveal>
  </div>
)

/* P04 动画页：FigureFrame 包裹 Remotion 组件，extraControls 放交互按钮 */
const DEMO_BARS: GrowBar[] = [
  { label: '方案 A', value: 82, display: '82%', color: 'var(--accent-1)' },
  { label: '方案 B', value: 54, display: '54%', color: 'var(--accent-2)' },
  { label: '方案 C', value: 31, display: '31%', color: 'var(--accent-3)' },
]

export const P04 = () => {
  const [sort, setSort] = useState(false)
  const bars = sort ? [...DEMO_BARS].sort((a, b) => b.value - a.value) : DEMO_BARS
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <FigureFrame
        title="🎬 动画标题：一句话说明它演示什么"
        durationInFrames={growBarsFrames(bars.length)}
        component={GrowBars}
        inputProps={{ bars, unit: '%' }}
        extraControls={
          <button className="fig-btn" onClick={() => setSort(!sort)}>
            {sort ? '原始顺序' : '按数值排序'}
          </button>
        }
        style={{ flex: 1 }}
      />
    </div>
  )
}

/* P05 表格页：笔记里的表格要重新设计，直接贴会字太小 */
export const P05 = () => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, justifyContent: 'center' }}>
    <table className="kv">
      <thead>
        <tr>
          <th style={{ width: 380 }}>场景</th>
          <th style={{ width: 420 }}>推荐做法</th>
          <th>依据</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>场景一</td><td><b>关键设置加粗</b></td><td>依据写简短</td></tr>
        <tr><td>场景二</td><td><b>关键设置加粗</b></td><td>依据写简短</td></tr>
        <tr><td>场景三</td><td><b>关键设置加粗</b></td><td>依据写简短</td></tr>
      </tbody>
    </table>
    <Reveal order={1}>
      <Callout type="warning" title="⚠ 常见误区">
        误区内容 + 正确做法。
      </Callout>
    </Reveal>
  </div>
)

/* P06 小结页 */
export const P06 = () => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'center' }}>
    <SummaryCard
      title="本章小结"
      items={[
        <>第一句：本章最重要的认知</>,
        <>第二句：第二重要的认知</>,
        <>第三句：行动指引（落到实操）</>,
      ]}
    />
  </div>
)
