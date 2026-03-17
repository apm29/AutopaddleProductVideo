# 002 · 视频结构重设计（CNC 篇）

**日期**：2026-03-17
**依据**：`product/视频内容.docx`
**变更类型**：结构性重构

---

## 一、变更原因

原始结构（001）是纯动画演示片，新文档要求改为**录屏展示为主**的产品演示视频，每个功能章节分为「过渡页（文字介绍）+ 视频录像」两段。新增「案例介绍」章节，包含4个真实客户场景。

---

## 二、新结构总览

| # | 章节 | 内容 | 时长 | 帧范围 |
|---|------|------|------|--------|
| 01 | 封面 | 蜻蜓AI数采 + Logo + 快装快采快用 | 6s / 180f | 0–180 |
| 02 | 快装 | 过渡页(8s) + 录像(30s) | 38s / 1140f | 180–1320 |
| 03 | 快采 | 过渡页(8s) + 录像(30s) | 38s / 1140f | 1320–2460 |
| 04 | 快用 | 过渡页(8s) + 录像(45s) | 53s / 1590f | 2460–4050 |
| 05 | 案例介绍 | 客户公司 + 整体图 | 6s / 180f | 4050–4230 |
| 06 | 场景一 | 过渡页(8s) + 录像(30s) | 38s / 1140f | 4230–5370 |
| 07 | 场景二 | 过渡页(8s) + 录像(30s) | 38s / 1140f | 5370–6510 |
| 08 | 场景三 | 过渡页(8s) + 录像(30s) | 38s / 1140f | 6510–7650 |
| 09 | 场景四 | 过渡页(8s) + 录像(30s) | 38s / 1140f | 7650–8790 |
| 10 | 品牌收尾 | Logo + CTA | 10s / 300f | 8790–9090 |

**总时长：9090 帧 = 303s ≈ 5 分 3 秒**

---

## 三、章节内容详述

### 01 封面（0–180f）
- 背景：深色 + 光晕效果
- 顶部：蜻蜓AI数采（副标题）
- 中央：Logo（弹入动画）
- 底部：快装 · 快采 · 快用（三关键词）

### 02 快装（180–1320f）
**过渡页（180–420f）**
- 大标题：快装
- 正文：办公电脑即可安装部署，无需专用硬件与复杂环境。数据留存企业内网，权限与访问由你掌控，安全合规、可控可管。

**录像段（420–1320f）**
- 内容：鼠标点击安装程序 → 安装过程 → 安装完成 → 登录主界面
- 视频文件占位：`public/videos/install.mp4`

### 03 快采（1320–2460f）
**过渡页（1320–1560f）**
- 大标题：快采
- 正文：预置万种主流设备配置，覆盖常见设备与系统接入场景。全程 AI 引导，跟着做就能对接上线，省去找专家、反复试错的时间。

**录像段（1560–2460f）**
- 内容：选设备 → 配置流程 → 采集到数据
- 视频文件占位：`public/videos/collect.mp4`

### 04 快用（2460–4050f）
**过渡页（2460–2700f）**
- 大标题：快用
- 正文：一句话生成 AI 应用，所想即所得：看板、报表、预警、业务小工具自动生成并部署。数据从"采到"直接变成"用到"。

**录像段（2700–4050f）**
- 内容：输入需求 → AI收集需求 → 生成计划 → 构建应用 → 日报页面
- 视频文件占位：`public/videos/quickuse.mp4`

### 05 案例介绍（4050–4230f）
- 顶部：浙江绍兴某汽车零部件离散生产型企业
- 中央：图片 `public/images/1.png`（案例公司整体介绍图）

### 06 场景一：设备状态远程可视化管理（4230–5370f）
**过渡页（4230–4470f）**
- 标签：场景一
- 标题：设备状态远程可视化管理
- 中央：图片 `public/images/2.png`

**录像段（4470–5370f）**
- 内容：电脑端大屏 + 手机端查询
- 视频文件占位：`public/videos/scene1.mp4`

### 07 场景二：设备异常实时预警（5370–6510f）
**过渡页（5370–5610f）**
- 标签：场景二
- 标题：设备异常实时预警
- 中央：图片 `public/images/3.png`

**录像段（5610–6510f）**
- 内容：故障报警配置 + 异常报警配置 + 报警处理
- 视频文件占位：`public/videos/scene2.mp4`

### 08 场景三：生产效率数据化分析（6510–7650f）
**过渡页（6510–6750f）**
- 标签：场景三
- 标题：生产效率数据化分析
- 中央：图片 `public/images/4.png`

**录像段（6750–7650f）**
- 内容：日报表整体 + 数据筛选 + 时间轴详情
- 视频文件占位：`public/videos/scene3.mp4`

### 09 场景四：程序下发提效降本（7650–8790f）
**过渡页（7650–7890f）**
- 标签：场景四
- 标题：程序下发提效降本
- 中央：图片 `public/images/5.png`

**录像段（7890–8790f）**
- 内容：程序读取 + 文件下发
- 视频文件占位：`public/videos/scene4.mp4`

### 10 品牌收尾（8790–9090f）
- Logo + 蜻蜓工业助手 + 快装·快采·快用 + autopaddle.com

---

## 四、组件结构

```
src/
  components/
    TransitionPage.tsx     # 通用过渡页（大标题 + 正文 + 可选图片）
    VideoSection.tsx       # 视频段（有src时播放，无src时占位）
    CoverPage.tsx          # 封面（复用BrandIntro逻辑但改版）
    [保留] FadeInOut.tsx
    [保留] Subtitle.tsx
    [保留] UIScreenshot.tsx
    [可弃] TitleCard, MetricCard, CountUp（当前不用，但留着）
  scenes/
    01-Cover.tsx
    02-QuickInstall.tsx
    03-QuickCollect.tsx
    04-QuickUse.tsx
    05-CaseIntro.tsx
    06-Scene1-Visualization.tsx
    07-Scene2-Alert.tsx
    08-Scene3-Efficiency.tsx
    09-Scene4-Program.tsx
    10-BrandOutro.tsx
  compositions/
    QingTingVideo.tsx
```

## 五、素材说明

### 图片（用户提供，放入 `public/images/`）
图片必须放在 `public/images/` 目录（Remotion 只能读取 public/ 下的静态资源）。

| 文件名 | 用于 |
|--------|------|
| `public/images/1.png` | 案例介绍过渡页 |
| `public/images/2.png` | 场景一过渡页 |
| `public/images/3.png` | 场景二过渡页 |
| `public/images/4.png` | 场景三过渡页 |
| `public/images/5.png` | 场景四过渡页 |

### 视频（用户提供，放入 `public/videos/`）
| 文件名 | 用于 |
|--------|------|
| `public/videos/install.mp4` | 快装录像 |
| `public/videos/collect.mp4` | 快采录像 |
| `public/videos/quickuse.mp4` | 快用录像 |
| `public/videos/scene1.mp4` | 场景一录像 |
| `public/videos/scene2.mp4` | 场景二录像 |
| `public/videos/scene3.mp4` | 场景三录像 |
| `public/videos/scene4.mp4` | 场景四录像 |

---

## 六、删除的旧文件
- `src/scenes/01-OpeningHook.tsx`
- `src/scenes/02-BrandIntro.tsx`
- `src/scenes/03-QuickInstall.tsx`（重写）
- `src/scenes/04-QuickCollect.tsx`（重写）
- `src/scenes/05-QuickUse.tsx`（重写）
- `src/scenes/06-MetricsHighlight.tsx`
- `src/scenes/07-BrandOutro.tsx`（重写为10-BrandOutro）
