# 动画模板目录（7 个通用模式）+ 自研动画编写模式

> 所有模板在 `template/src/animations/library/`，均为 1600×900@30fps 的 Remotion 组件，
> 用 `<FigureFrame component={...} durationInFrames={...} inputProps={{...}} />` 内嵌到页面。
> 颜色尽量用 CSS 变量（var(--accent) 等），跟随主题。
> **优先复用模板；没有合适的才自研。**

## 1. GrowBars — 增长条形对比

- **何时用**：几个方案的量化对比（性能/容量/动态范围/价格），"谁大谁小"一眼见。
- **props**：`bars: {label, value, display?, color?}[]`、`max?`、`unit?`、`title?`
- **帧数**：`growBarsFrames(bars.length)`
- **交互建议**：配 `extraControls` 加排序 / 单位切换按钮。

```tsx
<FigureFrame title="🎬 三种方案对比" durationInFrames={growBarsFrames(3)}
  component={GrowBars} inputProps={{ bars, unit: '%' }} style={{ flex: 1 }} />
```

## 2. FlowChain — 流程链逐节点点亮

- **何时用**：链路/因果链本身就是本页主角（信号流、审批流、转换管线）。
- **props**：`nodes: string[]`、`accent?`（最后高亮的下标）、`title?`
- **帧数**：`flowChainFrames(nodes.length)`
- 注意：页面里的静态小流程用 `<Flow /> + <Reveal />` 即可，不要杀鸡用牛刀。

## 3. RulerChart — 横向标尺 / 分布条

- **何时用**：把数值放上一条轴建立直觉（等级标尺、价格带、时间线、容量分布）。
- **props**：`min`、`max`、`log?`（对数刻度）、`zones?: {from,to,color,label?}[]`（彩色区段）、
  `marks: {value,label,sub?,up?}[]`（标注点，上下交替防重叠）、`title?`
- **帧数**：`rulerFrames(marks.length)`
- 坑：相邻 mark 值太近时标签会撞——用 `up` 手动错开，或合并标注。

## 4. DualCurve — 双曲线对比

- **何时用**：两条关系曲线对照（线性 vs 对数、两种模型、前后对比）。
- **props**：`panels: {title, fn(u)=>高度(-1..1), color?, xLabel?, yLabel?}[]`（1–3 个）
- **帧数**：`dualCurveFrames()`

## 5. Staircase — 量化阶梯

- **何时用**：任何"连续 → 离散"的演示（测量精度、评分档位、等级划分）。
- **props**：`levels?`（等级数，屏幕最多画 256）、`label?`（如 "档位 16"）、
  `waveFn?`（信号形状）、`title?`；下方自动显示误差带。
- **帧数**：`STAIRCASE_FRAMES`
- **交互建议**：`extraControls` 放等级切换按钮（如 4/16/64/256 级），用 inputProps 传入。

## 6. ParticleDrift — 粒子漂移聚散

- **何时用**："大量个体在某个场里迁移、最终聚成稳定图案"（共振节线、吸引域、概率分布）。
- **props**：`fields: ((u,v)=>number)[]`（每段一个场函数，粒子迁往 |m| 小处；段间图案重组）、
  `N?`、`labels?`、`title?`
- **帧数**：`particleDriftFields(fields.length)`
- 性能：位置全部预计算（useRef 一次算完 + 150 帧预热），渲染是纯帧函数。改 field 即换图案。

## 7. DualView — 双视角（组合 ↔ 分解）

- **何时用**："几样东西叠加成一个整体" ⇄ "拆开看各占多少"。经典：时域 ↔ 频域；
  也适合成本构成、信号合成、配方比例。
- **props**：`components: {label, color?, freq, amp, phase?}[]`、`leftTitle?`、`rightTitle?`、`sumLabel?`
- **帧数**：`dualViewFrames(components.length)`

---

## 自研动画编写模式（模板覆盖不了的概念）

1. **纯帧函数**：组件只是 `f(useCurrentFrame())` 的函数，不在渲染期做状态变更。
2. **确定性**：随机/模拟全部确定性（固定种子的 PRNG）；重计算（模拟/预计算）放模块层或
   `useRef` 初始化里一次算完，按帧查表。
3. **无缝循环**：周期性动画保证 `speed × durationInFrames ≡ 0 (mod 波长/周期)`，
   循环首帧 = 末帧。
4. **交互**：可调参数走 `inputProps` + 页面 `useState` + FigureFrame 的 `extraControls` 按钮组。
5. **画布**：1600×900，SVG 为主；文字 ≥ 24px；颜色用 CSS 变量。
6. **验收**：写完必须截"关键帧"（不只是第 0 帧）自查：数值标注、参考线、标签是否重叠、
   循环首尾是否跳变。
7. **降级原则**：写完发现讲不清，就退回静态 SVG + 分步 reveal——宁缺毋滥。
