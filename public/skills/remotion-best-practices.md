---
slug: remotion-best-practices
name: Remotion Best Practices
category: 内容创作与自媒体
tags: [video, react, remotion, animation, rendering, programmatic]
description: Remotion官方最佳实践，深度掌握动画、时间轴、音频、字幕和3D的正确编码方式
install: "npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices"
source: "https://www.skills.sh/remotion-dev/skills/remotion-best-practices"
---

# Remotion Best Practices

## 简介

Remotion 是一个开源框架，让你可以用 React 组件编程式地创建真实 MP4 视频。与传统的视频编辑软件（如 Adobe Premiere、After Effects）不同，Remotion 将视频创作转化为代码任务——每一帧都是一个 React 组件，整个视频就是一个代码库。

核心优势：

- **代码即视频**：使用 JSX、CSS、SVG、Canvas、WebGL 等 Web 技术创建复杂视频
- **参数化驱动**：通过传递数据动态生成视频，实现批量个性化视频制作
- **可复用组件**：React 组件化思想，动画和场景可复用、可组合
- **版本控制**：视频即代码，天然支持 Git 版本管理、CI/CD、代码审查
- **规模化渲染**：支持本地渲染、服务端渲染、Lambda 无服务器渲染

快速开始：

```bash
npx create-video@latest
cd my-video
npm install
npm run dev
```

## 核心概念

### Composition（组合）

Composition 是 Remotion 的核心单元，它将一个 React 组件与视频元数据（宽度、高度、帧率、时长）绑定在一起。在 `src/Root.tsx` 中注册：

```tsx
import { Composition } from "remotion";
import { MyComposition } from "./MyComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComposition"
        component={MyComposition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
```

- `id`：组合的唯一标识符，用于渲染时引用
- `component`：React 组件，负责渲染每一帧
- `durationInFrames`：视频总帧数（首帧为 0，末帧为 durationInFrames - 1）
- `fps`：帧率，常用 30 或 60
- `width` / `height`：视频分辨率

可以使用 `calculateMetadata` 动态计算视频参数：

```tsx
<Composition
  id="DynamicVideo"
  component={MyComposition}
  schema={mySchema}
  calculateMetadata={async ({ props }) => {
    const duration = await fetchDurationFromAPI(props.videoId);
    return {
      durationInFrames: Math.ceil(duration * 30),
      props: { ...props, fetchedDuration: duration },
    };
  }}
/>
```

### Sequence（序列）

`<Sequence>` 用于在时间轴上安排组件的出现时机和持续时间：

```tsx
import { Sequence } from "remotion";

export const MyTrailer = () => {
  return (
    <>
      <Sequence durationInFrames={30}>
        <Intro />
      </Sequence>
      <Sequence from={30} durationInFrames={30}>
        <Clip />
      </Sequence>
      <Sequence from={60}>
        <Outro />
      </Sequence>
    </>
  );
};
```

- `Intro` 在第 0-29 帧显示
- `Clip` 在第 30-59 帧显示
- `Outro` 从第 60 帧显示到视频结尾

**关键行为**：`<Sequence>` 内部的子组件调用 `useCurrentFrame()` 获取的是相对于 Sequence 开始的帧号，而非全局帧号。Sequence 可以嵌套，形成层级时间轴。

### useCurrentFrame

获取当前帧号的核心 Hook：

```tsx
import { useCurrentFrame, Sequence } from "remotion";

const Title = () => {
  const frame = useCurrentFrame(); // 返回相对于所在 Sequence 的帧号
  return <div>当前帧: {frame}</div>;
};
```

如果在 `<Sequence from={10}>` 内部，全局第 25 帧时 `useCurrentFrame()` 返回 15。如需获取全局绝对帧号，需在 Sequence 外部获取并作为 prop 传入。

### useVideoConfig

获取当前视频配置：

```tsx
import { useVideoConfig } from "remotion";

const MyComp = () => {
  const { fps, durationInFrames, width, height } = useVideoConfig();
  return (
    <div>
      这是一个 {width}x{height}px 的视频，
      总时长 {durationInFrames / fps} 秒。
    </div>
  );
};
```

### AbsoluteFill

Remotion 提供的占满父容器的辅助组件，几乎所有组合的根元素都应使用：

```tsx
import { AbsoluteFill } from "remotion";

export const MyComp = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      Hello Remotion!
    </AbsoluteFill>
  );
};
```

## 动画最佳实践

### interpolate() —— 线性插值

`interpolate()` 是最常用的动画函数，将输入范围映射到输出范围：

```tsx
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { durationInFrames } = useVideoConfig();

// 淡入淡出效果
const opacity = interpolate(
  frame,
  [0, 20, durationInFrames - 20, durationInFrames],
  [0, 1, 1, 0]
);
```

**重要参数**：

- `extrapolateRight: "clamp"` —— 防止输出超出范围（右侧）
- `extrapolateLeft: "clamp"` —— 防止输出超出范围（左侧）
- `easing` —— 缓动函数，如 `Easing.bezier(0.16, 1, 0.3, 1)`
- `posterize` —— 量化帧数，实现阶梯式动画效果

```tsx
// 带缓动和钳制的缩放动画
const scale = interpolate(frame, [0, 20], [0, 1], {
  extrapolateRight: "clamp",
  extrapolateLeft: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1),
});
```

**多关键帧映射**：

```tsx
const translateY = interpolate(frame, [0, 30, 60, 90], [0, -20, -20, 0], {
  extrapolateRight: "clamp",
});
```

### spring() —— 弹簧动画

`spring()` 基于物理模拟，默认从 0 动画到 1，效果自然流畅：

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: {
    damping: 200,   // 阻尼：值越大，弹跳越小
    stiffness: 100, // 刚度：值越大，动画越快
    mass: 1,        // 质量：影响动画的整体感觉
  },
});
```

**延迟弹簧动画**（交错效果）：

```tsx
const itemProgress = spring({
  frame: frame - index * 3, // 每个元素延迟 3 帧
  fps,
  config: { damping: 200 },
});
```

**弹簧 + interpolate 组合**：

```tsx
const driver = spring({ frame, fps });
const marginLeft = interpolate(driver, [0, 1], [0, 200]);
```

### Easing 缓动函数

Remotion 提供内置缓动函数，让动画更自然：

```tsx
import { Easing } from "remotion";

// 常用缓动曲线
Easing.bezier(0.16, 1, 0.3, 1)   // easeOutExpo —— 快速开始，缓慢结束
Easing.bezier(0.42, 0, 0.58, 1)  // easeInOutQuad
Easing.quad                      // 二次缓动
Easing.cubic                     // 三次缓动
```

**禁止事项**：CSS transition 和 CSS animation 在 Remotion 中无法正确渲染，必须使用 `interpolate()` 或 `spring()` 驱动所有动画。Tailwind 的动画类名同样禁止使用。

### interpolateColors() 颜色插值

```tsx
import { interpolateColors } from "remotion";

const backgroundColor = interpolateColors(
  frame,
  [0, 60, 120],
  ["#ff0000", "#00ff00", "#0000ff"]
);
```

## 时间轴管理

### Sequence 排列

序列是时间轴管理的基础单元：

```tsx
// 顺序排列场景
<Sequence durationInFrames={30}>
  <Intro />
</Sequence>
<Sequence from={30} durationInFrames={60}>
  <MainContent />
</Sequence>
<Sequence from={90}>
  <Outro />
</Sequence>
```

### Sequence 嵌套

序列可以嵌套，内部序列的帧号相对于父序列：

```tsx
<Sequence from={30} durationInFrames={60}>
  <Sequence from={10} durationInFrames={20}>
    <Highlight /> {/* 在全局第40-59帧显示 */}
  </Sequence>
</Sequence>
```

### layout="none"

默认情况下，`<Sequence>` 会用 `<AbsoluteFill>` 包裹子组件。如果不需要这个包裹（例如在 Flex 布局中内联使用），添加 `layout="none"`：

```tsx
<Sequence from={10} durationInFrames={20} layout="none">
  <InlineElement />
</Sequence>
```

### Series 组件

`<Series>` 简化连续序列的排列，无需手动计算 `from` 偏移：

```tsx
import { Series } from "remotion";

<Series>
  <Series.Sequence durationInFrames={30}>
    <Intro />
  </Series.Sequence>
  <Series.Sequence durationInFrames={60}>
    <MainContent />
  </Series.Sequence>
  <Series.Sequence durationInFrames={30}>
    <Outro />
  </Series.Sequence>
</Series>
```

### Loop 循环

```tsx
import { Loop } from "remotion";

<Loop durationInFrames={30} times={5}>
  <RepeatingAnimation />
</Loop>
```

### Freeze 冻结

在特定帧冻结动画：

```tsx
import { Freeze } from "remotion";

<Freeze frame={30}>
  <MyAnimation />
</Freeze>
```

### TransitionSeries 转场

使用 `@remotion/transitions` 实现场景切换效果：

```tsx
import { TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { springTiming } from "@remotion/transitions";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={slide()}
    timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
  />
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

内置转场效果：`slide()`、`fade()`、`wipe()`、`customPresentation()`

## 音频处理

### Audio 组件

```tsx
import { Audio, staticFile } from "remotion";

export const MyVideo = () => {
  return (
    <>
      <Audio src={staticFile("background.mp3")} />
      {/* 视频内容 */}
    </>
  );
};
```

### 音量控制

支持帧级别音量控制，实现淡入淡出：

```tsx
<Audio
  src={staticFile("music.mp3")}
  volume={(frame) => {
    // 前30帧淡入，最后30帧淡出
    const fadeIn = interpolate(frame, [0, 30], [0, 1], {
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(frame, [270, 300], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return Math.min(fadeIn, fadeOut);
  }}
/>
```

### useAudioData —— 音频数据获取

```tsx
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { Html5Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const AudioVisualization = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(staticFile("music.mp3"));

  if (!audioData) return null;

  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 16,
  });

  return (
    <div>
      <Html5Audio src={staticFile("music.mp3")} />
      {visualization.map((v, i) => (
        <div
          key={i}
          style={{
            width: 1000 * v,
            height: 15,
            backgroundColor: "blue",
          }}
        />
      ))}
    </div>
  );
};
```

### useWindowedAudioData —— 大文件处理

对于大音频文件，使用 `useWindowedAudioData()` 只加载当前帧附近的音频数据（仅支持 .wav 格式）：

```tsx
import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";

const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
  src: staticFile("podcast.wav"),
  frame,
  fps,
  windowInSeconds: 10,
});
```

### getMediaMetadata —— 获取音频时长

```tsx
import { getMediaMetadata } from "@remotion/media-utils";

const metadata = await getMediaMetadata(staticFile("voiceover.wav"));
console.log(metadata.durationInSeconds); // 33.221
```

### 音频同步最佳实践

1. 将音频放在 `<Sequence>` 内以精确控制其出现时间
2. 使用 `volume` 回调函数实现精确的音量控制
3. 使用 `getMediaMetadata()` 动态计算 Composition 的 `durationInFrames`
4. 渲染时如需强制包含静音音轨，使用 `--enforce-audio-track` 参数

## 字幕与文字

### 基本字幕渲染

```tsx
import { Sequence, useCurrentFrame, interpolate } from "remotion";

const subtitles = [
  { text: "第一句话", startFrame: 0, endFrame: 60 },
  { text: "第二句话", startFrame: 60, endFrame: 120 },
  { text: "第三句话", startFrame: 120, endFrame: 180 },
];

export const SubtitleTrack = () => {
  return (
    <>
      {subtitles.map((sub, i) => (
        <Sequence key={i} from={sub.startFrame} durationInFrames={sub.endFrame - sub.startFrame}>
          <Subtitle text={sub.text} />
        </Sequence>
      ))}
    </>
  );
};
```

### 文字动画

逐字出现效果：

```tsx
export const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 200 } });
  const charCount = Math.floor(progress * text.length);

  return <div>{text.slice(0, charCount)}</div>;
};
```

逐词交错动画：

```tsx
export const StaggeredWords: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div style={{ display: "flex" }}>
      {words.map((word, i) => {
        const progress = spring({
          frame: frame - i * 5,
          fps,
          config: { damping: 200 },
        });
        return (
          <span
            key={i}
            style={{
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
              display: "inline-block",
              marginLeft: 8,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
```

### SRT 字幕解析

使用 `parse-srt` 库解析 SRT 字幕文件：

```bash
npm install parse-srt
```

```tsx
import parseSRT from "parse-srt";
import { staticFile } from "remotion";

const srtContent = await fetch(staticFile("subtitles.srt")).then((r) => r.text());
const parsedSubtitles = parseSRT(srtContent);
```

也可使用社区库 `remotion-subtitles`，内置 17 种字幕动画模板。

### 字体加载

使用 `@remotion/google-fonts` 加载 Google Fonts：

```tsx
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

// 在组件中使用
<div style={{ fontFamily }}>自定义字体文本</div>
```

**重要**：字体必须完全加载后才能渲染，否则会出现文字闪烁。使用 `delayRender` / `continueRender` 确保字体加载完成。

## 3D 场景

### 安装与配置

```bash
npm install three @react-three/fiber @remotion/three @types/three
```

所有 `remotion` 和 `@remotion/` 包的版本必须保持一致，安装时使用 `--save-exact`。

### ThreeCanvas 基础

3D 内容必须包裹在 `<ThreeCanvas>` 中，且必须包含灯光：

```tsx
import { ThreeCanvas } from "@remotion/three";
import { useVideoConfig } from "remotion";

const ThreeScene = () => {
  const { width, height } = useVideoConfig();

  return (
    <ThreeCanvas width={width} height={height}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </ThreeCanvas>
  );
};
```

### 3D 动画规则

**关键规则**：3D 场景中的所有动画必须由 `useCurrentFrame()` 驱动。禁止使用 `useFrame()`（来自 @react-three/fiber），禁止使用自驱动着色器动画，否则会导致渲染闪烁。

```tsx
import { useCurrentFrame, interpolate } from "remotion";

const RotatingCube = () => {
  const frame = useCurrentFrame();
  const rotationY = frame * 0.02;

  return (
    <mesh rotation={[0, rotationY, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4a9eff" />
    </mesh>
  );
};
```

3D 弹簧动画：

```tsx
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const AnimatedTorus = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const constantRotation = interpolate(
    frame,
    [0, durationInFrames],
    [0, Math.PI * 6]
  );

  const entranceScale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <mesh
      rotation={[constantRotation / 2, constantRotation, 0]}
      scale={entranceScale + 3}
    >
      <torusGeometry args={[1, 0.4, 16, 32]} />
      <meshStandardMaterial color="gold" />
    </mesh>
  );
};
```

### Sequence 在 ThreeCanvas 中的使用

`<Sequence>` 默认会渲染一个 `<div>`，但在 `<ThreeCanvas>` 内部不允许有 DOM 元素。必须添加 `layout="none"`：

```tsx
<ThreeCanvas width={width} height={height}>
  <Sequence layout="none">
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4a9eff" />
    </mesh>
  </Sequence>
</ThreeCanvas>
```

### useVideoTexture —— 视频纹理

将视频作为 3D 对象的纹理贴图：

```tsx
import { useVideoTexture } from "@remotion/three";
import { staticFile } from "remotion";

const VideoScreen = () => {
  const texture = useVideoTexture({ src: staticFile("video.mp4") });
  return (
    <mesh>
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};
```

### 服务器端渲染注意

Three.js 需要设置 OpenGL 渲染器为 `angle`，新项目默认已包含此配置。

## 渲染与输出

### CLI 渲染

```bash
# 渲染视频为 MP4
npx remotion render src/index.tsx MyComposition out/video.mp4

# 渲染 GIF
npx remotion render src/index.tsx MyComposition out/video.gif

# 渲染透明视频（WebM）
npx remotion render src/index.tsx MyComposition out/video.webm --codec=vp8

# 渲染单帧静态图
npx remotion still src/index.tsx MyComposition out/thumbnail.png
```

常用编码器：`h264`（默认 MP4）、`h265`、`vp8`、`vp9`、`prores`、`mp3`、`aac`、`wav`

### renderMedia() —— 编程式渲染

```tsx
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const bundleLocation = await bundle({ entryPoint: "./src/index.ts" });

const composition = await selectComposition({
  serveUrl: bundleLocation,
  id: "MyComposition",
});

await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: "h264",
  outputLocation: "out/video.mp4",
  inputProps: { customData: "value" },
});
```

### renderStill() —— 渲染静态图

```tsx
import { renderStill } from "@remotion/renderer";

await renderStill({
  composition,
  serveUrl: bundleLocation,
  output: "/tmp/thumbnail.png",
  frame: 30, // 渲染第30帧
  inputProps: { title: "自定义标题" },
});
```

### 数据驱动批量渲染

```tsx
import { renderMedia, selectComposition } from "@remotion/renderer";

for (const entry of dataset) {
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "MyComposition",
    inputProps: entry,
  });

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: `out/${entry.id}.mp4`,
    inputProps: entry,
  });
}
```

### Lambda 无服务器渲染

```bash
# 部署 Lambda 函数
npx remotion lambda deploy

# 触发渲染
npx remotion lambda render MyComposition out/video.mp4
```

Lambda 优势：渲染速度可达本地数倍，按使用付费，支持并发渲染。

### Player 组件 —— 客户端预览

```tsx
import { Player } from "@remotion/player";
import { MyVideo } from "./MyVideo";

export const App = () => {
  return (
    <Player
      component={MyVideo}
      durationInFrames={120}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={30}
      inputProps={{ text: "Hello" }}
    />
  );
};
```

**Player 性能优化**：避免在 `timeupdate` 事件回调中更新父组件状态导致 Player 重新渲染。应将播放器和控制 UI 拆分为兄弟组件，通过 ref 通信。

## 常见陷阱与最佳实践

### 必须遵守的规则

1. **禁止 CSS animation / transition** —— 在 Remotion 中不会正确渲染，必须使用 `interpolate()` 或 `spring()` 驱动所有动画
2. **禁止 Tailwind 动画类** —— 如 `animate-bounce`、`animate-spin` 等，同样无法正确渲染
3. **禁止 `useFrame()`** —— 在 3D 场景中不能使用 @react-three/fiber 的 `useFrame()`，必须使用 `useCurrentFrame()`
4. **禁止自驱动动画** —— 着色器、3D 模型等不能自行动画，必须由 `useCurrentFrame()` 驱动

### 资源加载

5. **使用 `staticFile()` 引用资源** —— 放在 `public/` 目录下的资源必须通过 `staticFile()` 引用，不要使用绝对路径或相对导入

```tsx
// 错误 ❌
<img src="/image.png" />
import img from "./image.png";

// 正确 ✓
<Img src={staticFile("image.png")} />
```

6. **异步资源必须使用 delayRender / continueRender** —— 图片加载、API 请求、字体加载等异步操作必须使用此机制，否则会渲染出空白帧

```tsx
import { delayRender, continueRender } from "remotion";

const MyComp = () => {
  const [handle] = useState(() => delayRender("加载数据中..."));
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://api.example.com/data")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [handle]);

  if (!data) return null;
  return <div>{data.title}</div>;
};
```

7. **为 delayRender 添加标签** —— 方便调试超时问题

```tsx
delayRender("正在从 API 获取数据..."); // 超时时标签会出现在错误信息中
```

### 渲染性能

8. **使用 `<OffthreadVideo>` 或 `@remotion/media` 的 `<Video>`** —— 比旧的 `<Html5Video>` 性能更好
9. **避免 GPU 密集效果** —— `box-shadow`、`filter: blur()`、`text-shadow`、CSS 渐变在云端无 GPU 实例上渲染极慢，考虑用预计算图片替代
10. **合理设置 concurrency** —— 过高的并发可能导致 Chrome 内存不足，使用 `npx remotion benchmark` 找到最优值
11. **使用 `useMemo` 和 `useCallback`** —— 避免每帧重复计算

### 输出设置

12. **使用 CRF 而非 bitrate 控制质量** —— `--crf` 是推荐的质量控制方式，而非 `--video-bitrate`
13. **GIF 渲染** —— 使用 `numberOfGifLoops` 控制循环次数
14. **透明视频** —— 使用 `--codec=vp8` 输出 WebM 格式支持透明通道

### 数据驱动视频

15. **使用 `calculateMetadata` 动态计算时长** —— 根据数据源动态设置 `durationInFrames`
16. **使用 `--props` 传递数据** —— CLI 渲染时通过 `npx remotion render --props='{"key":"value"}'` 传入参数
17. **批量渲染时复用浏览器实例** —— 使用 `openBrowser()` 在多次渲染间共享浏览器，减少启动开销

### 项目组织

18. **模块化组件** —— 将大型场景拆分为可复用的小组件
19. **使用 `@remotion/google-fonts`** —— 官方字体包确保字体在渲染时正确加载
20. **`.gitignore` 配置** —— 排除 `node_modules/`、`out/`、`.remotion/`、`*.mp4`、`*.webm`、`*.gif`
