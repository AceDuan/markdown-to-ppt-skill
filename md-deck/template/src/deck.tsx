import type { ReactElement } from 'react'
import { P01, P02, P03, P04, P05, P06 } from './slides/example'

/**
 * 幻灯片注册表 —— 整个 deck 的唯一事实来源。
 *
 * 每一页一条记录：
 *   id       页面标识（p01、p02……）
 *   chapter  所属章节（对应 chapters 数组下标，页脚/目录用）
 *   title    页面标题（目录总览里显示）
 *   steps    分步 reveal 总步数（0/缺省 = 单步页）
 *   notes    讲稿备注（按 N 呼出的面板内容；来源更正、口误提醒等不上屏的信息放这里）
 *   render   页面组件
 *
 * 新建页面：在 slides/ 下写组件，然后在这里加一条记录。大工程建议按章节分文件。
 */

export const chapters: string[] = ['示例章节']

export interface SlideDef {
  id: string
  chapter: number
  title: string
  steps?: number
  notes?: string
  render: () => ReactElement
}

/** 占位页：大纲确认后、内容实现前，先让全 deck 可翻页预览结构 */
function Placeholder({ chapter, title }: { chapter: number; title: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26 }}>
      <div className="kicker">{chapters[chapter]}</div>
      <h1 className="h1">{title}</h1>
      <div>
        <span className="ghost-tag">🚧 本页内容待填充</span>
      </div>
    </div>
  )
}

function ph(id: string, chapter: number, title: string, notes: string, steps = 0): SlideDef {
  return { id, chapter, title, notes, steps, render: () => <Placeholder chapter={chapter} title={title} /> }
}

export const deck: SlideDef[] = [
  { id: 'p01', chapter: 0, title: '封面', render: () => <P01 />, notes: '示例封面——替换成你的课程/主题名。' },
  { id: 'p02', chapter: 0, title: '章节封面', render: () => <P02 />, notes: '每章以 SectionDivider 开场，给出本章小目录。' },
  { id: 'p03', chapter: 0, title: '概念页（分步 reveal）', steps: 2, render: () => <P03 />, notes: '第一组内容进页即可见（不包 Reveal），从第二组开始分步。' },
  { id: 'p04', chapter: 0, title: '动画页', render: () => <P04 />, notes: 'FigureFrame 统一容器：播放/暂停/重播/进度条；extraControls 放交互按钮。' },
  { id: 'p05', chapter: 0, title: '表格页', steps: 1, render: () => <P05 />, notes: '笔记里的高密度表格要重设计：大字卡 / 标尺图 / 分行出现的表。' },
  { id: 'p06', chapter: 0, title: '小结页', steps: 1, render: () => <P06 />, notes: '每章末尾一张 SummaryCard 收束。' },
]
