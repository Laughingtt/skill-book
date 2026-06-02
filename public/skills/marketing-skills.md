---
slug: marketing-skills
name: Marketing Skills
category: 营销与增长
tags: [marketing, seo, copywriting, content-strategy, email, cro, pricing]
description: Corey Haines营销技能包，18个子技能覆盖SEO审计、文案写作、内容策略、邮件序列、CRO优化等
install: "npx skills add https://github.com/coreyhaines31/marketingskills --skill seo-audit"
source: "https://www.skills.sh/coreyhaines31/marketingskills/seo-audit"
---

# Marketing Skills

## 简介

Marketing Skills 是由 Corey Haines（Swipe Files 创始人、前 Baremetrics 增长负责人）构建的开源营销技能包，专为 Claude Code、OpenAI Codex、Cursor、Windsurf 等 AI 代理设计。它不是简单的提示词集合，而是一套可组合、可复用的营销工作流模块——让 AI 代理像专业营销团队一样运作。

目前包含 25+ 个子技能，覆盖从 SEO 审计到转化率优化、从文案创作到定价策略的完整营销生命周期。GitHub 星标超过 25,000，安装量超过 115,000，是当前最全面的 AI 代理营销技能库。

核心理念：**营销你构建的、解决真实问题的产品，是对世界的服务。** 每个技能都遵循"清晰胜于巧妙、利益胜于功能、客户语言胜于公司术语"的原则。

## 核心功能

### 技能分类体系

| 分类 | 技能 | 用途 |
|------|------|------|
| **转化优化** | `cro`、`signup`、`onboarding`、`popups`、`paywalls` | 落地页、注册流程、新手引导、弹窗、付费墙转化 |
| **内容与文案** | `copywriting`、`copy-editing`、`cold-email`、`emails`、`social`、`video`、`image` | 营销文案撰写、编辑、冷邮件、邮件序列、社媒内容 |
| **SEO 与发现** | `seo-audit`、`ai-seo`、`programmatic-seo`、`site-architecture`、`competitors`、`schema` | SEO 审计、AI 搜索优化、程序化 SEO、站点架构、竞品分析 |
| **付费与分发** | `ads`、`ad-creative` | 付费广告策略与创意素材 |
| **测量与测试** | `analytics`、`ab-testing` | 数据追踪归因、A/B 实验设计 |
| **增长与留存** | `referrals`、`free-tools`、`churn-prevention`、`community` | 推荐计划、免费工具策略、流失预防、社区运营 |
| **销售与 GTM** | `revops`、`sales-enablement`、`launch`、`pricing`、`competitors` | 营收运营、销售赋能、发布策略、定价策略 |
| **策略与研究** | `customer-research`、`mktg-ideas`、`mktg-psych` | 客户研究、营销创意、营销心理学 |

### 技能协作机制

技能之间相互引用，形成完整工作流：

- `copywriting` ↔ `cro` ↔ `ab-testing`：文案优化 → 转化优化 → 实验验证
- `revops` ↔ `sales-enablement` ↔ `cold-email`：营收运营 → 销售赋能 → 冷邮件触达
- `seo-audit` ↔ `schema` ↔ `ai-seo`：SEO 诊断 → 结构化数据 → AI 搜索优化
- `customer-research` → `copywriting`、`cro`、`competitors`：客户洞察驱动所有下游技能

### 产品营销上下文（核心基础）

`product-marketing` 是所有技能的基础。它创建一个共享的产品营销上下文文件（`.agents/product-marketing.md`），包含：

- 产品定位与核心价值主张
- 目标客户画像（ICP）
- 品牌语调与风格指南
- 竞争差异化要点
- 营销目标与 KPI

**每个技能在执行前都会先读取这个上下文文件**，避免重复提问，确保所有营销输出与产品定位一致。这是该技能包区别于零散提示词的关键设计。

## 安装与使用

### 安装方式

**方式一：CLI 安装（推荐）**

```bash
# 安装全部技能
npx skills add coreyhaines31/marketingskills

# 安装特定技能
npx skills add coreyhaines31/marketingskills --skill seo-audit copywriting emails

# 查看可用技能列表
npx skills add coreyhaines31/marketingskills --list
```

安装后技能文件自动存放在 `.agents/skills/` 目录，并符号链接到 `.claude/skills/` 以兼容 Claude Code。

**方式二：Claude Code 插件**

```bash
# 添加市场源
/plugin marketplace add coreyhaines31/marketingskills

# 安装全部营销技能
/plugin install marketing-skills
```

**方式三：Git 子模块**

```bash
git submodule add https://github.com/coreyhaines31/marketingskills.git .agents/marketingskills
# 然后从 .agents/marketingskills/skills/ 引用技能
```

**方式四：SkillKit（多代理支持）**

使用 SkillKit 可跨 Claude Code、Cursor、Copilot 等多个 AI 代理统一安装技能。

### 首次使用流程

1. **安装技能**：选择上述任一方式安装
2. **创建产品营销上下文**：在 Claude Code 中输入 `/product-marketing`，回答关于产品、受众、定位的问题，生成 `.agents/product-marketing.md`
3. **开始使用**：直接描述营销任务，AI 自动选择对应技能

```bash
# 示例对话
"帮我优化这个落地页的转化率"        → 自动使用 cro 技能
"为我的 SaaS 写首页文案"           → 自动使用 copywriting 技能
"设置 GA4 注册追踪"               → 自动使用 analytics 技能
"创建 5 封欢迎邮件序列"            → 自动使用 emails 技能
```

也可以直接调用技能：

```bash
/cro
/emails
/seo-audit
```

### 从 v1.x 升级到 v2.0

v2.0 重命名了 17 个技能并合并了 `page-cro` + `form-cro` 为统一的 `cro` 技能。升级步骤：

```bash
# 清理旧技能目录
rm -rf .agents/skills/page-cro .agents/skills/form-cro \
  .agents/skills/ab-test-setup .agents/skills/analytics-tracking \
  .agents/skills/competitor-alternatives .agents/skills/email-sequence \
  .agents/skills/free-tool-strategy .agents/skills/launch-strategy \
  .agents/skills/onboarding-cro .agents/skills/paid-ads \
  .agents/skills/paywall-upgrade-cro .agents/skills/popup-cro \
  .agents/skills/pricing-strategy .agents/skills/product-marketing-context \
  .agents/skills/referral-program .agents/skills/schema-markup \
  .agents/skills/signup-flow-cro .agents/skills/social-content

# 重新安装 v2.0
npx skills add coreyhaines31/marketingskills

# 迁移产品营销上下文文件
mv .claude/product-marketing-context.md .agents/product-marketing.md
```

## 文案创作（Copywriting）

### 核心原则

`copywriting` 技能遵循以下转化文案原则：

1. **清晰胜于巧妙**：如果必须在清晰和创意之间选择，选清晰
2. **利益胜于功能**：功能是"它做什么"，利益是"这对客户意味着什么"
3. **具体胜于模糊**：用数字和具体描述替代空泛表述
4. **客户语言胜于公司术语**：使用客户在评论、访谈、工单中使用的词汇
5. **每节一个观点**：每个段落推进一个论点，构建页面逻辑流

### 标题公式

```
"{达成结果} without {痛点}"
"{品类} for {目标受众}"
"Never {不愉快经历} again"
"{突出主要痛点的问题}"
```

示例：
- "Grow your email list without spending on ads"
- "The analytics platform for indie makers"
- "Never lose a customer to churn again"
- "Still manually tracking your marketing ROI?"

### 页面结构框架

**首屏区域（Above the Fold）**：
- 标题：传达核心价值主张，具体 > 笼统
- 副标题：扩展标题，增加具体性，最多 1-2 句
- 主 CTA：行动导向，明确下一步

**正文区域**：
- 社会证明区：客户评价、数据指标、合作品牌
- 功能-利益区：每个功能配对应客户利益
- 异议处理区：预判并回应常见顾虑
- 二次 CTA：在页面底部再次引导转化

### 输出格式

文案输出包含：
- **页面文案**：按区域组织，包含标题、副标题、正文、CTA
- **策略注释**：解释关键选择的原因和所应用的原则
- **备选方案**：标题和 CTA 提供 2-3 个选项及理由
- **元内容**：SEO 标题、Meta 描述

### 使用示例

```
"为我的项目管理工具写首页文案"
→ copywriting 技能读取 product-marketing 上下文
→ 输出完整首页文案 + 注释 + 备选标题

"优化这个落地页的文案"
→ copywriting + copy-editing 协作
→ 审校现有文案 + 提供改进建议
```

## SEO 优化策略

### SEO 审计（seo-audit）

`seo-audit` 技能提供系统化的 SEO 诊断，覆盖以下维度：

**1. 可爬取性**
- robots.txt 配置检查
- Sitemap 验证
- 爬取错误识别
- 索引覆盖率分析

**2. 技术基础**
- Core Web Vitals 评估（LCP、FID、CLS）
- 页面速度优化建议
- 移动端适配检查
- HTTPS 与安全配置

**3. 页面优化**
- Title 标签质量与长度
- Heading 结构层级
- 内部链接架构
- 重复内容检测
- Canonical 标签验证
- 关键词蚕食问题排查

**4. 内容质量**
- 关键词覆盖与排名机会
- 内容深度与相关性
- 搜索意图匹配度

**注意事项**：`web_fetch` 和 `curl` 无法可靠检测通过 JavaScript 注入的 JSON-LD 结构化数据（如 Yoast、RankMath 等插件生成的内容），审计时需手动验证 Schema 标记。

### AI SEO（ai-seo）

针对 AI 搜索引擎（如 Google AI Overview、Perplexity、ChatGPT Search）的优化策略：

- 确保内容被 AI 搜索引擎引用的结构化策略
- 优化内容以匹配 AI 搜索的引用偏好
- 构建 AI 可理解的权威信号

### 程序化 SEO（programmatic-seo）

规模化 SEO 内容生成框架：

- 关键词模板识别与批量内容规划
- 数据驱动的页面自动生成策略
- 内容质量与规模化的平衡把控
- 避免低质量内容惩罚的防护机制

### Schema 标记（schema）

结构化数据标记优化：

- JSON-LD 标记实施建议
- 常见 Schema 类型选择（Product、Article、FAQ、HowTo 等）
- 富媒体搜索结果增强
- 标记验证与错误修复

### 使用示例

```
"审计我的网站 SEO"              → seo-audit 全面诊断
"优化我的 AI 搜索可见性"         → ai-seo 策略
"构建程序化 SEO 内容计划"        → programmatic-seo 规划
"添加产品页 Schema 标记"         → schema 实施
```

## 社交媒体内容

### social 技能

`social` 技能专注于社交媒体内容创作与排期：

- **平台适配**：根据不同平台（Twitter/X、LinkedIn、Instagram、TikTok）的内容格式和受众特点定制
- **内容类型**：品牌建设帖、产品推广帖、行业洞察帖、互动参与帖
- **排期策略**：最佳发布时间建议、内容日历规划
- **钩子公式**：首行抓注意力（前 125 字符决定是否"查看更多"）

### 内容格式规范

```
首行：钩子（显示在"查看更多"折叠线上方，最多 125 字符）
正文：2-3 句短文扩展钩子
CTA：明确的下一步行动（最多 1 句）
总长度：每条 70-150 词
```

### ad-creative 技能

付费广告创意素材生成：

- 跨平台广告文案变体（Google Ads、Meta Ads、LinkedIn Ads）
- 不同情感和理性角度的创意测试变体
- A/B 测试素材批量生成
- 产品、受众、目标驱动的结构化创意输出

## 邮件营销

### emails 技能

`emails` 技能将邮件序列视为完整叙事，而非孤立的单封邮件：

**序列类型**：
- 欢迎序列（Welcome Series）：从注册到首次激活
- 培育序列（Nurture）：逐步建立信任和购买意愿
- 重新参与序列（Re-engagement）：唤醒沉默用户
- 销售序列（Sales）：多触点构建购买理由
- 引导序列（Onboarding）：帮助新用户达到"Aha Moment"

**序列设计流程**：
1. 定义序列目标与转化终点
2. 规划每封邮件在整体叙事中的角色
3. 设定发送时机与触发条件
4. 撰写每封邮件的主题行、预览文本、正文、CTA
5. 定义追踪指标与优化方向

**输出内容**：
- 完整邮件文案（主题行 + 预览文本 + 正文 + CTA）
- 发送时机与延迟设置
- 触发条件定义
- 指标追踪计划
- 可直接导入 Customer.io、Mailchimp 等工具

### cold-email 技能

B2B 冷邮件外联专化：

- 个性化开场与痛点切入
- 价值主张简洁呈现
- 软性 CTA（Coffee chat？→ 有兴趣了解更多？）
- 跟进序列设计（3-5 封递进式跟进）

## 品牌定位

### product-marketing 技能

品牌定位的基础技能，创建 `.agents/product-marketing.md` 上下文文件：

**核心内容**：
- **产品定义**：一句话说清产品是什么、为谁解决什么问题
- **目标客户画像**：行业、角色、痛点、现有解决方案
- **差异化定位**：与竞品的本质区别、独特价值
- **品牌语调**：正式度、个性特征、语言风格
- **营销目标**：短期目标与长期愿景、关键指标

### mktg-psych 技能

营销心理学框架应用：

- **损失厌恶**：强调不行动的损失而非行动的收益
- **社会证明**：展示他人已做出选择（客户数、评价、案例）
- **锚定效应**：先展示高价选项使其他选项显得合理
- **稀缺性**：限时、限量、专属等紧迫感营造
- **互惠原则**：先提供价值再请求行动

### pricing 技能

定价策略优化：

- 定价模型选择（免费增值、分层定价、按量计费）
- 价格锚定与套餐设计
- 免费版与付费版功能边界
- 升级路径与追加销售策略

## 最佳实践

### 1. 先建上下文，再执行任务

始终先运行 `/product-marketing` 创建产品营销上下文。所有技能依赖此文件提供一致的产品信息，避免每次重复回答相同问题。

### 2. 技能组合使用

单一技能解决单一问题，组合技能解决完整工作流：

```
SEO 优化全流程：seo-audit → schema → ai-seo → programmatic-seo
落地页优化全流程：copywriting → cro → ab-testing
获客全流程：customer-research → copywriting → ads → emails → cro
发布全流程：product-marketing → launch → copywriting → social → emails
```

### 3. 文案迭代流程

```
初稿：copywriting 技能生成
↓
审校：copy-editing 技能精炼
↓
优化：cro 技能调整页面结构
↓
验证：ab-testing 技能设计实验
```

### 4. 数据驱动决策

- 使用 `analytics` 技能设置追踪后再做优化
- 使用 `ab-testing` 技能验证假设而非凭直觉
- 使用 `customer-research` 技能获取真实客户洞察

### 5. 保持技能更新

```bash
# 定期更新到最新版本
npx skills add coreyhaines31/marketingskills

# 检查版本变更
# 参考 VERSIONS.md 了解更新内容
```

## 常见问题

### Q: 安装后技能没有自动触发怎么办？

技能的触发依赖描述中的关键词。如果 AI 没有自动选择正确技能，可以：
- 直接使用技能名称调用：`/seo-audit`、`/copywriting`
- 在描述中包含更明确的关键词（如"SEO 审计"而非"看看我的网站"）
- 检查技能文件是否正确安装在 `.agents/skills/` 目录

### Q: 需要安装全部技能还是只安装需要的？

两种方式都支持。推荐先安装全部技能（`npx skills add coreyhaines31/marketingskills`），因为技能之间有依赖关系。如果只需要特定功能，使用 `--skill` 参数选择性安装，但注意可能缺少协作技能的支持。

### Q: product-marketing 上下文文件放在哪里？

v2.0 标准位置是 `.agents/product-marketing.md`。技能会按以下顺序查找：
1. `.agents/product-marketing.md`（推荐）
2. `.claude/product-marketing.md`（兼容）
3. `product-marketing-context.md`（v1.x 旧名称，仍兼容）

### Q: 技能支持哪些 AI 代理？

支持所有兼容 Agent Skills 规范的代理：Claude Code、OpenAI Codex、Cursor、Windsurf、GitHub Copilot、Gemini CLI、Cline、Continue 等。通过 SkillKit 可实现跨代理统一安装。

### Q: 与 Hyper Marketing Skills 有什么区别？

Corey Haines 的 Marketing Skills 侧重于**执行层面**（写文案、跑 SEO 审计、设 A/B 测试），是社区最成熟、安装量最高的营销技能库。Hyper Marketing Skills 侧重于**广告账户执行**（直接操作广告平台）。两者技能名称不冲突，可以共存安装，互补使用。

### Q: 技能输出质量如何保证？

每个技能都内嵌了专业框架和最佳实践：
- copywriting 技能基于转化文案原则（Joanna Wiebe 方法论）
- cro 技能基于 CXL 转化优化框架
- seo-audit 技能基于技术 SEO 最佳实践
- 所有技能输出包含策略注释，解释"为什么这样写"

### Q: 可以自定义技能内容吗？

可以。技能本质是 Markdown 文件，安装后可直接编辑 `.agents/skills/` 中的 SKILL.md 文件来定制。也可以 Fork 整个仓库进行深度定制。欢迎通过 PR 贡献改进。
