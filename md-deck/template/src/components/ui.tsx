import katex from 'katex'
import type { CSSProperties, ReactNode } from 'react'

export function Kicker({ children }: { children: ReactNode }) {
  return <div className="kicker">{children}</div>
}

export function H1({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <h1 className="h1" style={style}>
      {children}
    </h1>
  )
}

export function Panel({
  title,
  accent,
  children,
  style,
}: {
  title?: ReactNode
  accent?: string
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <div
      className="card"
      style={{
        flex: 1,
        borderTop: accent ? `4px solid ${accent}` : undefined,
        ...style,
      }}
    >
      {title ? <div className="card-title">{title}</div> : null}
      {children}
    </div>
  )
}

const coColor: Record<string, string> = { tip: 'var(--tip)', warning: 'var(--warn)', info: 'var(--info)' }

export function Callout({
  type = 'info',
  title,
  children,
  style,
}: {
  type?: 'tip' | 'warning' | 'info'
  title?: string
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <div className={`callout ${type}`} style={style}>
      {title ? <div className="co-title">{title}</div> : null}
      <div>{children}</div>
    </div>
  )
}

export function Bullets({ items, size }: { items: ReactNode[]; size?: number }) {
  return (
    <ul className="bullets" style={size ? { gap: 16 } : undefined}>
      {items.map((it, i) => (
        <li key={i} style={size ? { fontSize: size } : undefined}>
          {it}
        </li>
      ))}
    </ul>
  )
}

export function Formula({ tex, display = true, size }: { tex: string; display?: boolean; size?: number }) {
  const html = katex.renderToString(tex, { displayMode: display, throwOnError: false })
  return (
    <div className="formula" style={size ? { fontSize: size } : undefined} dangerouslySetInnerHTML={{ __html: html }} />
  )
}

/** 🖥 讲师切 AU 现场演示的提示徽标 */
export function LabBadge({ label = '🖥 此处切现场演示' }: { label?: string }) {
  return <span className="lab-badge">{label}</span>
}

/** 章节封面 */
export function SectionDivider({
  num,
  title,
  subtitle,
  items,
}: {
  num: string
  title: string
  subtitle?: string
  items?: string[]
}) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 72 }}>
      <div className="divider-num">{num}</div>
      <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: 72 }}>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.2 }}>{title}</div>
        {subtitle ? (
          <div style={{ fontSize: 34, color: 'var(--muted)', marginTop: 18 }}>{subtitle}</div>
        ) : null}
        {items ? (
          <div style={{ marginTop: 40, display: 'flex', flexWrap: 'wrap', gap: 12, maxWidth: 900 }}>
            {items.map((it) => (
              <span key={it} className="pill" style={{ fontSize: 24, padding: '10px 20px' }}>
                {it}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

/** 章末小结卡 */
export function SummaryCard({ items, title = '本节小结' }: { items: ReactNode[]; title?: string }) {
  return (
    <div
      className="card"
      style={{ borderTop: '4px solid var(--tip)', background: 'rgba(52, 211, 153, 0.06)' }}
    >
      <div className="card-title" style={{ color: 'var(--tip)' }}>
        ✓ {title}
      </div>
      <Bullets items={items} />
    </div>
  )
}

/** 横向流程（节点 + 箭头，可换行） */
export function Flow({ nodes, hot = -1 }: { nodes: string[]; hot?: number }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
      {nodes.map((n, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span className={`pill${i === hot ? ' hot' : ''}`}>{n}</span>
          {i < nodes.length - 1 ? <span className="arrow">→</span> : null}
        </span>
      ))}
    </div>
  )
}
