# 已知坑与解法（全部来自实战，遇到对应症状直接查这里）

## 布局

- **SVG 内容溢出画布/舞台**
  症状：SVG 按 `width:100%` 等比缩放，高度爆炸（如 580:130 的图渲染出 370px 高），页面底部被裁。
  解法：给 svg 显式 `height` + `preserveAspectRatio="xMidYMid meet"`；先算好所有元素坐标在 viewBox 内。
- **动画卡片把页面撑爆、控件条被挤出画面**
  解法：FigureFrame 已内置——外层 card `flex:1 + minHeight:0`，Player 包一层
  `flex:1 + minHeight:0` 的 div，Player `style={{width:'100%', height:'100%'}}`。不要改回 width-only。
- **页面进页全黑**
  原因：所有内容都包在 `<Reveal>` 里，step=0 时全部透明。
  解法：第一组内容不包 Reveal；分步从第二组开始；deck 里 steps 数 = Reveal 最大 order。
- **标签重叠（相邻数值的标注）**
  场景：对数轴上相近的刻度、同一条参考线的两条标签。
  解法：上下错开 y、改 textAnchor（一个 start 一个 end）、或左右分置。
- **卡片底部大量留白**
  原因：Panel `flex:1` 拉伸而内容少。属化妆级问题，统一不处理；要收紧就让内容页组件不铺满。

## 动画

- **循环首尾跳变**
  解法：周期参数满足 `speed × durationInFrames ≡ 0 (mod 波长/周期)`；循环末帧状态 = 首帧状态。
- **模拟/粒子类动画每帧卡顿**
  解法：位置/状态全部预计算（固定种子 PRNG + 一次性算完存 Float32Array，渲染按帧查表）；
  重计算放模块层或 useRef 初始化，不要放进每帧。
- **开场几秒是纯噪点/未成形**
  解法：加 WARMUP 预热（正式帧之前先跑 N 步让图案成形）。
- **JSX 文本里的 `<` 报 "Identifier expected"**
  解法：写成 `&lt;`（如 `通常 &lt; 1 ms`）。
- **const 变量二次赋值 / 先用后算**
  解法：需要重赋值用 let；注意计算顺序（先算 maxX 再 xOf(maxX)）。
- **多参考线动画的线条重合**
  设计期就要保证关键线彼此分开（信号不满幅，让最高参考线与满量程线留出可见间隙）。

## 构建 / 运行

- **单文件构建**：`vite-plugin-singlefile` + `build.assetsInlineLimit` 调大（见 template/vite.config.ts），
  产物只有一个 dist/index.html（全部 JS/CSS/字体内联，~2.3MB）。
- **file:// 协议下 hash 页码记忆失效**
  原因：部分浏览器在 file:// 禁止 `history.replaceState`。
  解法：App.tsx 已内置 try/catch，失败时退化为 `location.replace('#/n')`。不要删掉这段。
- **file:// 下不能用 dev 特性**：单文件是静态快照，改内容后必须重新 `npm run build` 并替换。
- **PowerShell 处理 UTF-8 中文文件会乱码**（Get-Content 默认按 ANSI 读）：
  处理含中文的源码一律用 Node 脚本或 Edit 工具，不要用 PowerShell 改写。
- **PowerShell Set-Content 给 UTF-8 文件加 BOM** →
  Vite 解析 package.json 报 `Unexpected token '﻿'`（JSON 前有 U+FEFF）：
  用 Node 读文件剥掉行首 BOM 再写回；根因是上面那条——含中文路径/内容的改写全走 Node 或 Edit。
- **cmd 同一行 `set X=...` 后 `%X%` 不展开**（解析期展开）；含中文/空格路径时直接写全字面路径
  或用 `set "X=..."` + 下一行再引用。

## QA / 自动化截图

- **合成键盘事件（CDP keypress / locator.press）进不了页面**
  解法：在页面内派发——`window.dispatchEvent(new KeyboardEvent('keydown', {key:'ArrowRight'}))`。
  产品侧要保留键盘 + 点击两种翻页（点击用 cua.click 是好用的）。
- **截图截到翻页淡入中途（半透明/全黑帧）或旧帧**
  解法：goto 后等 ≥650ms，每次分步后等 ≥430ms；仍可疑就重截一次对比。
- **批量截图**：按 deck 的 steps 表逐页"goto → 派发按键 × steps → 截图"，每批 ≤25 页防超时；
  产物存 `.qa/full/` 逐张人工/代理检查。
- **Player 内动画截关键帧**：按帧数换算等待 `waitMs ≈ frame/30*1000`，注意 autoPlay 从挂载起算。
- **浏览器标签丢失**（报 Cannot read properties of undefined (reading 'id')）：
  先 `browser.tabs.list()`，没有就 `browser.tabs.new()` 重建，别复用旧 id。

## 流程

- **先斩后奏**：跳过大纲确认直接写页面 = 高概率大返工。门 1 必须等用户。
- **内容页直接翻译笔记**：必然字号小、密度大、没节奏。按 content-rules.md 重设计。
