---
slug: code-refactor
name: Code Refactor
category: 代码维护与质量
tags: [refactor, legacy, code-smell, extract-method, safe-transform]
description: 遗留代码重构技能，基于Fowler和Feathers的著作，分析优先、安全增量变换
install: "claude plugins install https://github.com/elifiner/refactoring"
source: "https://github.com/elifiner/refactoring"
---

# Code Refactor — AI 辅助代码重构

## 简介

Code Refactor 是一款基于 Martin Fowler《重构：改善既有代码的设计》和 Michael Feathers《修改代码的艺术》原则的 AI 辅助重构技能。它遵循**分析优先、安全增量变换**的工作流，帮助你在不改变代码外部行为的前提下，系统性地改善代码内部结构。

传统重构依赖开发者的经验判断，而 AI 辅助重构可以：

- **自动检测代码异味**：快速扫描长函数、重复代码、深层嵌套等常见问题
- **生成手术刀式修改方案**：每次只应用一个安全变换，避免大范围重写带来的风险
- **保持方法签名不变**：确保重构不破坏现有调用方
- **为遗留代码生成特征测试**：在没有测试覆盖的老代码上建立安全网

核心理念：**不要重构一切，不要一次性规划所有重构。** 循环是：`分析 → 排序优先级 → 重构一个 → 验证 → 决定下一步`。

## 重构原则

### SOLID 原则

| 原则 | 含义 | 重构关联 |
|------|------|----------|
| **S** — 单一职责 | 一个类/函数只做一件事 | 拆分"上帝类"、Extract Method |
| **O** — 开闭原则 | 对扩展开放，对修改关闭 | Replace Conditional with Polymorphism |
| **L** — 里氏替换 | 子类必须能替换父类 | 检查继承层次是否合理 |
| **I** — 接口隔离 | 不应强迫实现不需要的接口 | Extract Interface、拆分胖接口 |
| **D** — 依赖倒置 | 依赖抽象而非具体实现 | 依赖注入、引入接口层 |

### DRY（Don't Repeat Yourself）

消除重复代码是重构最直接的收益。重复代码意味着：修改一处逻辑时必须同步修改所有副本，遗漏任何一个都会引入 bug。

### KISS（Keep It Simple, Stupid）

简单设计优于复杂设计。如果一段代码需要大量注释才能理解，说明它需要重构。

### 80/20 法则

不是所有代码都需要重构。专注于**变更频率高、影响范围大**的代码区域。低频修改的代码即使有异味，重构的 ROI 也很低。

### 黄金法则：一次只做一件事

绝不混合以下操作：

- 重构 + 新功能
- 多种重构手法同时进行
- 重构 + 修复 bug

每个 commit/步骤应该是一个单一的、可逆的变换。

## 安装与使用

### 安装

```bash
# 从 GitHub 仓库安装
claude plugins install https://github.com/elifiner/refactoring

# 或使用 SSH
claude plugins install git@github.com:elifiner/refactoring.git

# 从本地目录安装（开发模式）
claude plugins install .
```

### 基本用法

```
/refactor [文件或代码路径]
```

技能会自动进入两阶段工作流：

1. **Phase 1（分析）**：检测代码异味，按影响优先排序
2. **Phase 2（重构）**：每次应用一个安全变换，验证后 git commit

### 使用场景

- **代码降重**：提取重复代码片段为公共函数
- **简化逻辑**：拆分"上帝类"或复杂条件判断
- **增加测试**：为老旧代码自动生成"特征测试"确保重构不破坏功能
- **改善命名**：让代码自解释，减少对注释的依赖
- **降低耦合**：引入接口层、依赖注入，使代码更易测试和扩展

## 常见重构模式

### 1. Extract Method（提取函数）

**何时使用**：函数过长、代码段有注释解释其意图、需要复用某段代码。

**Before：**

```javascript
function printOwing() {
  printBanner();

  // 打印详细信息
  console.log("name: " + customer.name);
  console.log("amount: " + customer.outstanding);
}
```

**After：**

```javascript
function printOwing() {
  printBanner();
  printDetails(customer.outstanding);
}

function printDetails(outstanding) {
  console.log("name: " + customer.name);
  console.log("amount: " + outstanding);
}
```

**为何安全**：纯机械提取，不改变逻辑。编译器会捕获遗漏的变量引用。

### 2. Replace Nested Conditional with Guard Clauses（卫语句替换嵌套条件）

**何时使用**：深层嵌套（> 3 层）遮蔽了主逻辑。

**Before：**

```javascript
function getPaymentAmount() {
  let result;
  if (isDead) {
    result = deadAmount();
  } else {
    if (isSeparated) {
      result = separatedAmount();
    } else {
      if (isRetired) {
        result = retiredAmount();
      } else {
        result = normalPayAmount();
      }
    }
  }
  return result;
}
```

**After：**

```javascript
function getPaymentAmount() {
  if (isDead) return deadAmount();
  if (isSeparated) return separatedAmount();
  if (isRetired) return retiredAmount();
  return normalPayAmount();
}
```

**为何安全**：条件相同，结果相同，只是结构不同。

### 3. Replace Conditional with Polymorphism（用多态替换条件）

**何时使用**：同一类型判断的 switch/if 出现在多个地方，新增类型时需要修改所有分支。

**Before：**

```javascript
function getAirSpeed(bird) {
  switch (bird.type) {
    case 'EuropeanSwallow':
      return 35;
    case 'AfricanSwallow':
      return 40 - 2 * bird.numberOfCoconuts;
    case 'NorwegianBlue':
      return bird.isNailed ? 0 : 10 + bird.voltage / 100;
    default:
      return null;
  }
}

function getPlumage(bird) {
  switch (bird.type) {
    case 'EuropeanSwallow':
      return "average";
    case 'AfricanSwallow':
      return bird.numberOfCoconuts > 2 ? "tired" : "average";
    case 'NorwegianBlue':
      return bird.voltage > 100 ? "scorched" : "beautiful";
    default:
      return null;
  }
}
```

**After：**

```javascript
class Bird {
  get airSpeed() { return null; }
  get plumage() { return "unknown"; }
}

class EuropeanSwallow extends Bird {
  get airSpeed() { return 35; }
  get plumage() { return "average"; }
}

class AfricanSwallow extends Bird {
  get airSpeed() { return 40 - 2 * this.numberOfCoconuts; }
  get plumage() { return this.numberOfCoconuts > 2 ? "tired" : "average"; }
}

class NorwegianBlue extends Bird {
  get airSpeed() { return this.isNailed ? 0 : 10 + this.voltage / 100; }
  get plumage() { return this.voltage > 100 ? "scorched" : "beautiful"; }
}
```

**为何安全**：行为等价，但新增鸟类只需添加子类，无需修改已有代码（开闭原则）。

### 4. Rename（重命名）

**何时使用**：名称不能反映意图，或意图已改变。

**Before：**

```javascript
function calc(d, t) {
  return d / t;
}
```

**After：**

```javascript
function calculateSpeed(distance, time) {
  return distance / time;
}
```

**为何安全**：编译器/linter 会捕获所有引用。使用全词匹配的查找替换即可。

**注意**：小心动态属性访问 `obj[fieldName]`，编译器无法检测。

### 5. Split Loop（拆分循环）

**何时使用**：一个循环做了多件不相关的事。

**Before：**

```javascript
let totalSalary = 0;
let youngestAge = Infinity;
for (const p of people) {
  if (p.age < youngestAge) youngestAge = p.age;
  totalSalary += p.salary;
}
```

**After：**

```javascript
let youngestAge = Infinity;
for (const p of people) {
  if (p.age < youngestAge) youngestAge = p.age;
}

let totalSalary = 0;
for (const p of people) {
  totalSalary += p.salary;
}
```

**为何安全**：迭代次数相同，操作相同，只是分离了。虽然多了一次循环，但清晰度提升后才能进一步重构（如用 reduce 替换）。性能问题留到 profiling 确认后再优化。

### 6. Move Method/Function（移动函数）

**何时使用**：函数与另一个模块/类的关联更紧密（Feature Envy 异味）。

**Before：**

```javascript
class Account {
  get overdraftCharge() {
    if (this.type.isPremium) {
      const result = 10;
      if (this.daysOverdrawn > 7) {
        result += (this.daysOverdrawn - 7) * 0.85;
      }
      return result;
    }
    return this.daysOverdrawn * 1.75;
  }
}
```

**After：**

```javascript
class AccountType {
  get overdraftCharge(daysOverdrawn) {
    if (this.isPremium) {
      const result = 10;
      if (daysOverdrawn > 7) {
        result += (daysOverdrawn - 7) * 0.85;
      }
      return result;
    }
    return daysOverdrawn * 1.75;
  }
}
```

**为何安全**：导入错误会捕获缺失的引用。

### 7. Extract Variable（提取变量）

**何时使用**：表达式复杂或被多次使用。

**Before：**

```javascript
if (platform.toUpperCase().indexOf("MAC") > -1 &&
    browser.toUpperCase().indexOf("IE") > -1 &&
    wasInitialized() && resize > 0) {
  // do something
}
```

**After：**

```javascript
const isMacOs = platform.toUpperCase().indexOf("MAC") > -1;
const isIE = browser.toUpperCase().indexOf("IE") > -1;
const wasResized = resize > 0;

if (isMacOs && isIE && wasInitialized() && wasResized) {
  // do something
}
```

**为何安全**：纯机械提取，无逻辑变更。

## 代码异味检测

代码异味（Code Smell）是代码中潜在问题的表面征兆。Fowler 定义异味为"通常对应系统中更深层次问题的表面迹象"。

### 常见代码异味速查表

| 异味 | 表现 | 推荐重构手法 |
|------|------|-------------|
| **Long Method（长函数）** | 函数超过 50 行 | Extract Method |
| **Duplicated Code（重复代码）** | 相同或极相似的代码片段 | Extract Method → 统一 |
| **Deep Nesting（深层嵌套）** | 条件嵌套超过 3 层 | Guard Clauses |
| **God Class（上帝类）** | 一个类承担过多职责 | Extract Class、Move Method |
| **Feature Envy（特性嫉妒）** | 方法频繁访问其他类的数据 | Move Method |
| **Primitive Obsession（基本类型偏执）** | 用原始类型代替领域概念 | Replace Data Value with Object、Introduce Parameter Object |
| **Shotgun Surgery（散弹式修改）** | 一个变更需要修改多个类 | Move Method、Extract Class、内联类 |
| **Divergent Change（发散式变化）** | 一个类因不同原因被修改 | Extract Class |
| **Lazy Class（冗余类）** | 类几乎不做任何事 | Inline Class |
| **Data Class（数据类）** | 类只有字段没有行为 | Move Method 到数据类 |
| **Refused Bequest（被拒绝的遗赠）** | 子类不使用父类的方法 | Replace Inheritance with Delegation |
| **Temporary Field（临时字段）** | 实例变量仅在特定情况下使用 | Extract Class |
| **Message Chains（消息链）** | `a.getB().getC().doSomething()` | Hide Delegate |
| **Middle Man（中间人）** | 类只是委托给其他类 | Remove Middle Man、Inline Method |
| **Comments（过度注释）** | 注释解释"怎么做"而非"为什么" | Extract Method 改善命名 |

### 异味共现模式

研究表明，以下异味组合对代码质量影响最大，应优先处理：

- **Dispersed Coupling + God Class**：降低所有内部质量属性
- **Feature Envy + God Class**：耦合严重，难以测试
- **God Class + Long Method**：最常见的高影响组合

## 重构工作流

### Phase 1：分析（始终从这里开始）

1. **读取 guide.md** 刷新重构原则和目录
2. **扫描代码异味**：使用上方的异味速查表
3. **按影响排序**：应用 80/20 思维 — 找到最少重构带来最大收益的点
4. **呈现发现**：

```
/refactor src/utils/legacy-parser.js
→ Phase 1: 检测到以下异味
  1. [高] 长函数 parseConfig() — 120行，包含3个可提取的逻辑块
  2. [高] 重复代码 — 配置验证逻辑在3处重复
  3. [中] 深层嵌套 — validate() 函数4层if嵌套
  4. [低] 命名不清 — 变量 d, t, r 含义不明
→ 建议优先处理 #1 和 #2
```

### Phase 2：重构（每次一个变换）

```
→ Phase 2: Extract Method — 提取 parseConfig() 中的验证逻辑
  → 验证：运行测试 / 编译检查
  → git commit -m "refactor: extract validateConfig from parseConfig"

→ Phase 2: Guard Clauses — 简化 validate() 嵌套
  → 验证：运行测试 / 编译检查
  → git commit -m "refactor: replace nested conditionals with guard clauses"

→ Phase 2: Rename — d → delimiter, t → timeout
  → 验证：运行测试 / 编译检查
  → git commit -m "refactor: rename cryptic variables for clarity"
```

### 遗留代码的特殊处理

当没有测试覆盖时（Feathers 定义遗留代码 = 没有测试的代码），遵循以下流程：

1. **识别变更点**：确定需要修改的代码位置
2. **寻找测试点**：找到可以插入测试的接缝（seam）
3. **打破依赖**：使用 Extract Interface、Parameterize Constructor 等手法创建接缝
4. **编写特征测试**：捕获当前行为（即使行为有 bug 也要先记录）
5. **然后才重构**：有了安全网后再进行结构改善

### Edit and Pray vs Cover and Modify

| 策略 | 适用场景 | 风险 |
|------|---------|------|
| **Edit and Pray** | 无测试覆盖 | 修改后祈祷不出问题，高风险 |
| **Cover and Modify** | 有测试覆盖 | 先写测试锁定行为，再安全修改 |

**推荐**：始终优先建立测试覆盖。如果无法写测试，只使用可通过编译/类型检查验证的安全变换。

## 最佳实践

### 1. 提交前先验证

每次重构步骤后，运行以下验证：

```bash
# 编译/类型检查
npm run build        # 或 tsc --noEmit
# 运行测试
npm test
# Lint 检查
npm run lint
```

### 2. 小步提交

每个 commit 只包含一个重构手法，commit message 以 `refactor:` 前缀开头：

```bash
git commit -m "refactor: extract validateConfig from parseConfig"
git commit -m "refactor: replace nested conditionals with guard clauses"
git commit -m "refactor: rename d → delimiter for clarity"
```

### 3. 不要重构 + 新功能混合

重构 commit 不应包含任何新功能或 bug 修复。功能变更和结构变更分开提交，便于 code review 和回滚。

### 4. 有时需要先让代码"变差"

为了到达更好的结构，可能需要先经过一个中间状态：

- **Inline Method** 先内联，再重新 Extract Method 到更合理的位置
- **先复制再优化**：Extract Method 时先复制代码，确认安全后再统一去重

### 5. 利用编译器作为安全网

类型系统是最好的重构工具。在强类型语言中：

- Rename 后编译器会捕获所有遗漏的引用
- Move Method 后导入错误会立即暴露
- Extract Interface 后类型不匹配会报错

### 6. AI 辅助重构的 7 条安全规则

1. **始终审查 AI 输出**：96% 的开发者不完全信任 AI 生成的代码功能正确性
2. **特征测试先行**：在重构前用 AI 生成特征测试锁定行为
3. **约束 AI 的修改范围**：明确指定只做某一种重构手法
4. **逐步验证**：不要让 AI 一次执行多个重构步骤
5. **安全门禁**：CI 流水线必须通过后才允许合并
6. **受控部署**：重构后的代码使用 feature flag 灰度发布
7. **保留回滚能力**：每个重构步骤都是独立的 commit，可单独 revert

## 何时不要重构

- **代码很少变更**：低频修改的代码即使有异味，重构 ROI 也很低
- **低影响的表面改善**：纯粹的美化性修改不带来实际价值
- **需求不明确**：不确定代码应该做什么时，先搞清楚需求
- **接近重写阈值**：如果代码已经烂到需要重写，重构反而浪费时间
- **没有时间验证**：如果无法在重构后运行测试验证，不要动手

## 常见问题

### Q: 重构会改变代码行为吗？

不会。重构的定义就是**在不改变代码外部可观察行为的前提下改善内部结构**。如果行为改变了，那不是重构，是重写。每次重构步骤都应足够小，可以通过测试验证行为未变。

### Q: 没有测试的遗留代码怎么重构？

遵循 Feathers 的方法：先编写**特征测试**（Characterization Test）捕获当前行为（包括 bug），然后利用"接缝"（seam）打破依赖，最后在测试保护下进行重构。如果实在无法写测试，只使用编译器可验证的安全变换（Extract Method、Rename、Guard Clauses 等）。

### Q: 一次应该重构多少？

一次只做一个重构手法。完成一个 → 验证 → commit → 再做下一个。这确保每一步都可回滚，每一步都可验证。

### Q: AI 重构的代码可靠吗？

AI 是辅助工具，不是替代品。AI 生成的重构方案必须经过人工审查和测试验证。建议将 AI 的输出视为"高级建议"而非"最终答案"。始终遵循：AI 生成 → 人工审查 → 测试验证 → 提交。

### Q: 性能会受影响吗？

某些重构（如 Split Loop）可能引入额外的循环遍历。但**清晰度优先于性能**：先让代码清晰可维护，再通过 profiling 确认性能瓶颈，最后针对性优化。过早优化是万恶之源。

### Q: 重构和重写怎么选？

| 情况 | 选择 |
|------|------|
| 代码结构可改善但有价值 | 重构 |
| 代码完全无法理解和维护 | 重写 |
| 需要同时改变行为和结构 | 先重写行为测试，再重构结构 |
| 时间紧迫 | 只重构影响当前任务的部分 |

### Q: 如何说服团队投入时间重构？

- 用**数字说话**：展示代码异味导致的 bug 率、修改耗时
- 展示**Boy Scout Rule**：每次提交都让代码比之前好一点
- 强调**技术债务利息**：不重构的代码维护成本随时间指数增长
- 从**痛点入手**：先重构团队抱怨最多的模块

## 参考资源

- Martin Fowler《重构：改善既有代码的设计》（第2版）— [refactoring.com](https://refactoring.com/catalog)
- Michael Feathers《修改代码的艺术》— 遗留代码重构圣经
- [Refactoring.Guru](https://refactoring.guru) — 重构模式与设计模式在线目录
- [elifiner/refactoring](https://github.com/elifiner/refactoring) — 本技能的 GitHub 仓库
