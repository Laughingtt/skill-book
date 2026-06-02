---
slug: karpathy-guidelines
name: Karpathy's Guidelines
category: 编码开发与工程规范
tags: [guidelines, coding, simplicity, surgical, goal-driven, karpathy]
description: Andrej Karpathy的4条AI编程行为规则：先思考、简洁优先、手术式改动、目标驱动执行
install: "npx skills add https://github.com/karpathy/agent-skills --skill guidelines"
source: "https://www.skills.sh/karpathy/agent-skills/guidelines"
---

# Karpathy's Guidelines

## 简介

Andrej Karpathy，OpenAI联合创始人、前Tesla AI总监、斯坦福大学CS231n课程创建者，是深度学习领域最具影响力的技术领袖之一。他也是"vibe coding"一词的提出者——用自然语言描述需求，让AI生成代码。

2026年1月26日，Karpathy在X（原Twitter）上发表了一条引发行业震动的推文，分享了他数周高强度使用Claude Code的观察笔记。他写道，自己的编程工作流在短短几周内从"80%手写+20%AI"翻转为"80%AI+20%人工审查"——2025年12月，LLM编程能力跨过了某个"相变阈值"。

但推文的核心不是赞叹AI有多强，而是指出LLM在编码中的系统性失败模式：**隐性假设**（silently pick interpretations）、**过度工程**（over-engineer solutions）、**附带改动**（collateral changes）。这些问题每个AI编程用户都深有体会——你让AI加一个功能，它替你做了你从没要求的决定，创建了没人需要的抽象层，顺手改了毫不相关的代码，然后你花在修AI输出上的时间比手写还多。

开发者Forrest Chang（张嘉元）在推文发布的第二天，将Karpathy的观察提炼为四条可执行的行为准则，封装成一个`CLAUDE.md`文件和Claude Code插件。这个仓库在GitHub上获得了160k+ stars，成为GitHub历史上star数最高的开发者资源之一——不是框架，不是库，只是一个65行的行为约束文件。这个数字本身就是信号：团队需要的不是更强的模型，而是更好的操作约束。

四条规则的核心洞察：**这些规则偏向谨慎而非速度。对于简单任务，请自行判断是否需要全套流程。目标是减少非平凡工作中的代价高昂的错误，而不是拖慢简单任务。**

---

## 规则一：先思考（Think Before Coding）

> **不要假设。不要隐藏困惑。呈现权衡。**

### LLM的典型失败模式

LLM在面对模糊需求时，最常见的行为是**静默选择**——它不会告诉你"这里有两种理解"，而是自作主张地挑一个，然后一路写下去。等你看完500行代码才发现方向完全错了，返工成本巨大。

这种行为的根源在于训练数据：LLM被优化为"看起来有帮助"，而提问看起来不如直接给答案有帮助。但这恰恰是最危险的地方。

### 正确的做法

在动手写代码之前，必须：

- **明确陈述假设**——如果不确定，就问。不要替用户做决定。
- **如果存在多种理解，全部呈现**——不要静默选择某一种。
- **如果存在更简单的方案，说出来**——必要时推回用户的需求。
- **如果某件事不清楚，停下来**——说出哪里困惑，然后提问。

### 反模式："直接开写"的代价

假设你让AI"给用户API加一个速率限制"。AI没有先思考就直接开始写：

```
AI的隐性决策：
1. 用了令牌桶算法（你从没说过用哪种算法）
2. 限制设为每分钟60次（你从没说过阈值）
3. 存储用Redis（你从没说过用什么存储）
4. 顺便加了IP白名单功能（你从没要求过）
5. 返回429状态码（你从没说过错误格式）
```

5个隐性假设，每一个都可能导致返工。如果项目没有Redis，整个方案作废。如果业务要求用漏桶算法，全部重写。

**先思考的版本**应该是：

```
在实现之前，我需要确认几点：
1. 速率限制算法：令牌桶还是漏桶？还是固定窗口？
2. 限制阈值：每分钟多少次请求？
3. 存储方案：项目是否已有Redis？还是用内存存储？
4. 超限响应格式：返回429还是自定义错误码？
5. 是否需要按用户等级区分限制？

我倾向的建议是：令牌桶 + Redis（如果已有），但需要你确认。
```

### 实践要点

- 把AI当作一个**会提问的高级工程师**，而不是一个"你说什么就做什么"的打字员
- 如果AI没有提问就开始写代码，这本身就是需要纠正的行为
- 在CLAUDE.md中明确写上"如果需求模糊，先提问再编码"

---

## 规则二：简洁优先（Simplicity First）

> **用最少的代码解决问题。不做任何投机性设计。**

### LLM的过度工程本能

LLM天生倾向于"过度完整"——训练数据奖励全面性，所以模型会本能地加上"以防万一"的功能。你让它写一个函数，它给你一个框架。你让它加一个字段，它给你一个配置系统。这不是bug，这是训练目标的副作用。

### 具体规则

- 不添加超出需求的功能
- 不为只使用一次的代码创建抽象
- 不添加没人要求的"灵活性"或"可配置性"
- 不为不可能发生的场景写错误处理
- **如果你写了200行而50行就够了，重写它**

问自己一个问题：**"一个高级工程师会说这太复杂了吗？"** 如果答案是会的，就简化。

### Before/After：过度工程 vs 简洁实现

**需求**：给表单添加邮箱格式验证

**过度工程版本**（AI的典型输出）：

```javascript
// 验证框架 - "为了将来的扩展性"
class ValidationRule {
  constructor(name, validator, message) {
    this.name = name;
    this.validator = validator;
    this.message = message;
  }
  validate(value) {
    return this.validator(value) ? null : this.message;
  }
}

class FormValidator {
  constructor() {
    this.rules = new Map();
    this.customMessages = new Map();
  }
  addRule(field, rule) {
    if (!this.rules.has(field)) this.rules.set(field, []);
    this.rules.get(field).push(rule);
  }
  validate(formData) {
    const errors = {};
    for (const [field, rules] of this.rules) {
      for (const rule of rules) {
        const error = rule.validate(formData[field]);
        if (error) {
          errors[field] = errors[field] || [];
          errors[field].push(error);
        }
      }
    }
    return errors;
  }
}

// 使用
const validator = new FormValidator();
validator.addRule('email',
  new ValidationRule('email',
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    '请输入有效的邮箱地址'
  )
);
const errors = validator.validate(formData);
```

**简洁版本**：

```javascript
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? null
    : '请输入有效的邮箱地址';
}

const error = validateEmail(formData.email);
```

一个函数，5行代码。没有框架，没有抽象，没有配置系统。当未来真的需要验证框架时，再引入不迟。**YAGNI（You Aren't Gonna Need It）不是懒惰，是工程纪律。**

### 关键区分

简洁不是简陋。简洁是**用最少的复杂度解决问题**，简陋是**省略必要的复杂度**。区别在于：解决方案是否完整地覆盖了需求？如果是，越简单越好。

---

## 规则三：手术式改动（Surgical Changes）

> **只触碰你必须触碰的。只清理你自己造成的混乱。**

### LLM的"顺手"倾向

LLM有一个非常 annoying 的习惯：在修复一个bug的同时"顺手"重构了旁边的代码、改善了注释风格、调整了代码格式。每一次"顺手"都是一个风险点——它在没有测试保护的情况下改动了工作正常的代码，引入了新的bug，而你还得花时间搞清楚哪些改动是必要的、哪些是附带的。

### 编辑已有代码时的规则

- 不"改善"相邻代码、注释或格式
- 不重构没有坏的东西
- **匹配已有风格**——即使你会用不同方式写
- 如果你注意到不相关的死代码，提一下——不要删掉它

### 当你的改动产生孤立代码时

- 移除**你的改动**使其不再使用的import/变量/函数
- 不要移除预先存在的死代码，除非被要求

**检验标准：每一行改动都应该能追溯到用户的请求。**

### Diff示例：手术式 vs 霰弹式

**需求**：修复用户名不能包含空格的bug

**霰弹式改动**（错误示范）：

```diff
 function createUser(data) {
-  // TODO: add validation
+  // Validate user input before saving
   if (!data.name) throw new Error('Name required');
+  if (data.name.includes(' ')) throw new Error('Name cannot contain spaces');
   if (!data.email) throw new Error('Email required');
-  return db.save('users', data);
+  // Sanitize input
+  data.name = data.name.trim();
+  data.email = data.email.toLowerCase().trim();
+  return db.save('users', data);
 }

-async function deleteUser(id) {
-  await db.delete('users', id);
+async function deleteUser(id: string): Promise<void> {
+  if (!id) throw new Error('ID required');
+  await db.delete('users', id);
+  logger.info(`Deleted user ${id}`);
 }
```

问题：修用户名bug时，顺手改了email处理、加了TypeScript类型、加了deleteUser的验证和日志——每一个都是无关改动，每一个都可能引入新bug。

**手术式改动**（正确示范）：

```diff
 function createUser(data) {
   if (!data.name) throw new Error('Name required');
+  if (data.name.includes(' ')) throw new Error('Name cannot contain spaces');
   if (!data.email) throw new Error('Email required');
   return db.save('users', data);
 }
```

只加了一行。改动100%可追溯到需求。不碰其他代码。

### 风格匹配的重要性

匹配已有风格不仅是礼貌，是安全。如果你在一个用2空格缩进、单引号、不用分号的项目里突然插入4空格+双引号+分号的代码，diff就会充满噪音，code review变得困难，git blame变得不可用。**风格一致性 > 个人偏好**。

---

## 规则四：目标驱动执行（Goal-Driven Execution）

> **定义成功标准。循环直到验证通过。**

### 模糊目标的危险

"加个验证"、"修一下那个bug"、"重构X"——这些是任务描述，不是目标。任务描述告诉你做什么，目标告诉你什么时候算做完。没有目标的执行就像没有终点线的跑步：AI会一直跑下去，或者在你认为该停的地方继续跑，或者在你认为不该停的地方停下来。

### 将任务转化为可验证目标

| 模糊任务 | 可验证目标 |
|---------|-----------|
| "加验证" | "为无效输入写测试，然后让测试通过" |
| "修bug" | "写一个能复现bug的测试，然后让测试通过" |
| "重构X" | "确保重构前后测试都通过" |

### 多步任务的计划模板

```
1. [步骤1] → 验证: [检查条件]
2. [步骤2] → 验证: [检查条件]
3. [步骤3] → 验证: [检查条件]
```

### 范围蔓延 vs 聚焦执行

**需求**：给登录页添加"记住我"功能

**范围蔓延的执行**：

```
1. 实现"记住我"复选框 ✓
2. 顺便加了一个"忘记密码"链接（没要求）
3. 顺便优化了登录表单的样式（没要求）
4. 顺便把cookie逻辑抽成了独立的Auth模块（没要求）
5. 顺便给Auth模块加了JWT支持（没要求）
6. 顺便加了OAuth集成（没要求）
7. 测试？忘了写。
```

结果：2小时的工作变成了2天，功能膨胀，没有测试，"记住我"本身可能还有bug。

**聚焦执行**：

```
1. 添加"记住我"复选框到登录表单 → 验证: 复选框渲染正确
2. 实现"记住我"的token持久化逻辑 → 验证: 关闭浏览器后重新打开仍保持登录
3. 确保token有过期时间 → 验证: 过期后自动登出
4. 写集成测试 → 验证: 测试全部通过
```

每一步都有明确的验证条件，做完即停，不多不少。

### 强目标 vs 弱目标

- **强成功标准**让AI可以独立循环——"测试通过"就是通过，不需要人判断
- **弱成功标准**（"让它能用"）需要持续的人工澄清——什么叫"能用"？在哪能用？什么时候能用？

**尽可能使用强目标**：可量化、可自动化验证、没有歧义。

---

## 规则间的协同

四条规则不是孤立的清单，它们构成一个互相强化的系统：

```
先思考 ──→ 简洁优先
  │            │
  │            ▼
  │        手术式改动
  │            │
  ▼            ▼
目标驱动 ←─────┘
```

**先思考→简洁优先**：只有先想清楚问题，才能找到最简方案。没有思考的"简洁"往往只是省略，是偷懒而非设计。

**简洁优先→手术式改动**：简洁的代码更容易做手术式改动——当你只需要改3行代码时，就很难"顺手"改30行。过度工程的代码天然诱导更多过度工程。

**手术式改动→目标驱动**：当你只做必要的改动时，每一步的验证条件自然更清晰。改动越少，验证越容易。

**目标驱动→先思考**：定义成功标准的过程本身就是思考——"什么叫完成？"这个问题迫使你面对模糊和假设。

**一个贯穿四条规则的底层原则：不要隐藏困惑，推回去，问问题。** 这是勇气——在进度压力下说"我不确定，让我先问清楚"的勇气。

---

## 实际应用场景

### 场景1：AI辅助日常开发

在日常AI编程中，这四条规则的最大价值是**减少审查负担**。不加规则的AI输出，你平均需要审查3倍于预期的改动量。加上规则后，AI输出的diff更小、更聚焦，审查效率显著提升。Augment Code的实验数据表明，加上Karpathy风格规则后，AI的tool call数量减少、文件读取量降低，时间和成本均有下降——而代码质量评分基本不变。AI没有写出更好的代码，但它用更少的代价写出了同等质量的代码。

### 场景2：代码审查

用这四条规则作为审查清单：

1. **先思考**：这段代码的假设是否被显式声明了？
2. **简洁优先**：有没有超出需求的功能？有没有不必要的抽象？
3. **手术式改动**：diff中有没有与需求无关的行？
4. **目标驱动**：有没有对应的测试来验证改动？

每条规则都指向一个具体的审查维度，不再是"感觉不太对"的模糊判断。

### 场景3：团队编码规范

将四条规则本地化为团队的操作约束。不要写"保持简洁"，写：

```
不添加新抽象，除非它消除了至少两个调用点的重复，或者匹配项目中已有的模式。
```

不要写"做手术式改动"，写：

```
编辑已有路由时，只触碰该路由需要的文件，除非失败的测试证明共享代码必须修改。
```

**动机性指令和操作约束的区别**：前者听起来正确，后者改变行为。

### 场景4：多Agent协作

当多个AI Agent在同一个代码库上工作时，四条规则变得更加关键。没有"手术式改动"的约束，Agent A改了文件X的第10行，Agent B改了同一文件的第20行，合并冲突不断。没有"目标驱动"的约束，Agent可能无限循环。四条规则在多Agent场景下是**协作协议**，而不仅仅是编码规范。

---

## 与其他编码规范的对比

| 维度 | Karpathy Guidelines | Google Style Guide | Clean Code | SOLID原则 |
|------|-------------------|-------------------|------------|----------|
| **目标受众** | AI编码Agent | 人类工程师 | 人类工程师 | 人类工程师 |
| **核心问题** | AI的系统性偏差 | 代码一致性 | 代码可读性 | 代码架构 |
| **规则数量** | 4条 | 数百条 | 数十条 | 5条 |
| **抽象层级** | 行为约束 | 格式规范 | 设计哲学 | 架构原则 |
| **可验证性** | 高（每条都可映射到diff检查） | 高（linter可检查） | 低（主观判断） | 中（需经验判断） |
| **与速度的关系** | 偏向谨慎 | 中性 | 中性 | 偏向设计 |

Karpathy Guidelines的独特价值在于：**它不是教你怎么写好代码，而是教AI怎么不写坏代码**。这是一个关键的范式转变——从追求卓越到避免灾难。

与Clean Code的区别最为明显：Clean Code鼓励你抽取函数、命名意图、消除重复——这些都是人类工程师的美德，但恰好是LLM过度工程的重灾区。当AI"抽取函数"时，它往往创建了没人需要的抽象层；当AI"消除重复"时，它往往把两个偶然相似的代码强行耦合。

与SOLID的对比也有启发：SOLID的单一职责原则（SRP）和Karpathy的简洁优先看起来相似，但出发点完全不同。SRP是为了让代码更容易理解和修改；简洁优先是为了防止AI添加没人要求的功能。前者是架构原则，后者是行为约束。

**最有效的用法**：将Karpathy Guidelines作为AI Agent的行为底线，将传统编码规范作为人类审查的质量标准。两套规则互补而非替代。

---

## 安装与使用

```bash
# 方式一：作为Claude Code插件安装（全局可用）
npx skills add https://github.com/karpathy/agent-skills --skill guidelines

# 方式二：将规则写入项目的CLAUDE.md
# 从仓库复制规则内容到项目根目录的CLAUDE.md文件中
```

**最佳实践**：不要照搬，要本地化。将四条规则的形状偷过来，删掉不适用的部分，加上具体的命令、文件路径、测试关卡和设计约束。把重复的流程拆成技能，把机械检查放进hooks。然后审查Agent的diff，问自己唯一重要的问题：**Agent的行为改变了吗？**

---

## 参考来源

- [Karpathy原始推文](https://x.com/karpathy/status/2015883857489522876)（2026年1月26日）
- [andrej-karpathy-skills GitHub仓库](https://github.com/multica-ai/andrej-karpathy-skills)（160k+ stars，MIT协议）
- 仓库维护者：Forrest Chang（张嘉元），在Karpathy推文发布次日创建
