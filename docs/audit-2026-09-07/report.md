# RandomPokemon 产品体验与 SEO 审计

审计日期：2026-09-07。结论：当前产品的主要问题是任务入口、按钮含义与成果保存不一致，手机首屏又把结果推到了屏幕之外。建议优先修复这些问题，然后依据 Search Console 的查询与页面数据优化 SEO。

## 范围与证据限制

- 实际操作当前工作区启动的 Next.js 本地版本；桌面默认视口约 1265×712，手机视口 390×844。
- 线上站点在本次环境中访问超时，终端域名解析也失败。因此截图不代表已验证的线上部署，也不能据此认定网站全球不可访问。
- 访问了首页、生成结果、手机筛选、Team Planner、Favorite Picker；其余页面与 SEO 配置进行了代码抽查。没有声称逐页检查全部 1,025 个详情页。
- 未取得本站 Search Console、GA4、真实用户 Core Web Vitals 或服务器抓取日志。不能确认排名低、流失率高的实际原因或影响比例。
- 现有测试：12 个测试文件、51 项测试全部通过。它们主要覆盖数据与业务逻辑，不足以证明界面和跨页体验正确。
- 本次只新增报告与截图，没有修改产品代码或部署。

## 已有的可保留基础

视觉配色、卡片样式与字体有统一性；图片能正常展示。生成器已有本地收藏、历史、分享、单卡重抽与类型分析，不需要为了增加功能数量而扩展新工具。首页提供服务器生成的初始结果，图鉴有静态详情页；代码具备 canonical、robots、拆分 sitemap 和结构化数据。

## 流程截图与发现

### 1. 桌面进入首页——可用，但任务层级不清

![桌面首页](/Users/wanggang/Documents/Codex/randompokemon/docs/audit-2026-09-07/01-home-desktop.png)

默认显示 Smart Team of 6，六个筛选入口与 Generate Team 并排，下面又有 Reroll Unlocked、Copy Team、Share、Favorite name 和 Save Team。对于只想随机抽一只的访问者，必须先从“队伍大小”下拉菜单改数量。

Preset 同时混合算法（Pure Random、Smart）、属性约束（Monotype）、类别约束（No Legendaries、Legendary）；这些概念有的可以同时成立，却被放成同一组选项。用户难以预测切换某个预设会覆盖哪些旧筛选。

建议：第一层明确“抽一只 / 组队”；第二层显示数量、世代和属性；其余筛选收进一个统一面板。为预设列出会改变的条件，并在结果旁显示“本次结果条件”。首页默认取单只还是队伍，应由搜索意图和使用数据决定。

### 2. 查看卡片——信息完整，但每张卡片六个同级动作

![卡片动作](/Users/wanggang/Documents/Codex/randompokemon/docs/audit-2026-09-07/02-card-actions.png)

每张默认形态卡片并列 Lock、Reroll、Shiny、Remove、Details、Pokédex。六只共 36 个卡片动作，此外还显示属性、世代、地区、BST、特性和性格。Details 弹窗与 Pokédex 页面属于不同目的地，入口却没有清晰说明差异。

建议：保留“锁定 / 换一只”作为显式常用操作；点击名称或图片查看详情；闪光外观和移除放到次级菜单。默认突出图片、名称、属性，把特性、性格和复杂数据放到展开区。删除提供撤销。

可访问性：手机实测 Lock、Reroll 点击区域约 52.5×48 CSS 像素，不能认定触摸区域过小；但文字仅 10px，桌面样式为 9px，阅读负担较高。尚未完成屏幕阅读器和全流程键盘测试。

### 3. 锁定后点击生成——高优先级交互缺陷

![锁定后重新生成](/Users/wanggang/Documents/Codex/randompokemon/docs/audit-2026-09-07/03-generate-after-lock.png)

复现：初始第一只是 Cyclizar → 点击 Lock Cyclizar → DOM 显示 Locked、Unlock Cyclizar，单卡 Reroll 被禁用 → 点击橙色 Generate Team → 第一只变成 Arbok，原来的锁定成员不再保留。

原因：主按钮调用 generateFrom，内部 generatePokemon 没有传入锁定成员；另一个 Reroll Unlocked 才按保留成员处理。即使“重新生成整队”是设计意图，当前按钮也没有把清空锁定这一后果说明清楚。

建议：有锁定成员时，主按钮显示“保留 1 只，重抽其余”，统一遵守锁定；单独提供“新建队伍”。需要覆盖锁定、筛选变化、数量变化以及全部锁定的交互验证。

另一个状态问题也已复现：从六只中删除 Arbok 后只剩五张卡，但 Team size 仍显示 6 Pokémon。应区分“目标数量 6 / 当前 5”，或同步数量。当前代码还把过滤条件和结果共用状态，修改筛选而未生成时仍显示旧结果，缺少“条件待应用”的提示。

代码：[生成逻辑](/Users/wanggang/Documents/Codex/randompokemon/src/components/generator/PokemonGenerator.tsx:192)、[主按钮](/Users/wanggang/Documents/Codex/randompokemon/src/components/generator/PokemonGenerator.tsx:463)、[删除动作](/Users/wanggang/Documents/Codex/randompokemon/src/components/generator/PokemonGenerator.tsx:516)。

### 4. 手机进入首页——首屏结果不可见，优先调整

![390px 手机首页](/Users/wanggang/Documents/Codex/randompokemon/docs/audit-2026-09-07/04-home-mobile.png)

390×844 下，标题占三行，说明四行，六个筛选分三排；生成按钮下面又堆叠重抽、复制和分享。第一屏看不到宝可梦结果。首页在本次测试状态下总高度约 16,211 CSS 像素，约 19 个视口高度；这不是流失率测量，但说明页面有明显的浏览负担。

手机布局将六张完整卡片排成单列，收藏入口放在卡片之后，分析和历史再往后。用户需要大量滚动才能保存成果，离开页面之后也缺少醒目的“继续上次队伍”入口。

建议：手机标题压缩成较短的两行；首屏保留任务选择、生成按钮和可见结果；筛选改成带已选条件数量的单一入口。团队用六个紧凑槽位展示整体，选中成员后展开详细卡片。保存和分享放到结果附近的紧凑工具栏，分析默认展示一句主要结论。

验收：390×844 首屏能看到至少一个完整结果或清晰的团队概览；一次触达生成，筛选完成后知道如何应用；保存不需要滚过六张详情卡。

### 5. 手机高级筛选——能打开关闭，但仍是长表单

![手机筛选](/Users/wanggang/Documents/Codex/randompokemon/docs/audit-2026-09-07/05-mobile-filters.png)

面板含生成风格、五个开关、进化阶段、BST、五类特殊形态和种子。内部可以滚动，Done 固定在底部；Escape 能关闭并回到触发按钮，这是已有的优点。

问题是熟练玩家参数和常用设置全部串在一个表单中，Done 只是关闭，旧结果并不会自动应用新条件。建议分成常用条件、进阶条件、复现种子三个折叠组，按钮说明“应用筛选并生成”或明确“保存条件，返回生成”。

可访问性风险：筛选面板在手机上视觉类似模态窗口，但代码没有使用已有 Modal 的焦点约束和背景 inert 机制；需补测键盘是否进入背后的页面，不把这一风险当作已完成的 WCAG 结论。

### 6. Team Planner 组队与刷新——成果保存中断

![组满队伍后的规划器](/Users/wanggang/Documents/Codex/randompokemon/docs/audit-2026-09-07/06-planner-full.png)

复现：从首页进入 Planner 是 0/6，不携带当前生成的整队 → 点击 Build a Balanced Team 后为 6/6 → Randomize Remaining 和 Improve Coverage 同时禁用 → 刷新后回到 0/6。

虽然分析能指出“三只共同弱 Fairy”，却不能直接从满队状态改善这项弱点，用户必须先移除成员。界面还显示可以继续选择和补满，但队伍已满。源码没有队伍自动存档、整队 URL 恢复、保存或分享入口。

建议：增加“在规划器中编辑这支队伍”，通过统一队伍状态传递成员；自动存草稿，支持保存与分享。满队时提供“替换这个位置”或“优化未锁定成员”，并显示替换前后变化。暂时不做优化算法时，把 Improve Coverage 改为准确的“智能补齐空位”。

代码：[规划器状态和操作](/Users/wanggang/Documents/Codex/randompokemon/src/components/tools/TeamPlanner.tsx:18)。

### 7. Favorite Picker 选择——可操作，但进度与排名语义有问题

![做过一次选择后的进度](/Users/wanggang/Documents/Codex/randompokemon/docs/audit-2026-09-07/07-picker-progress.png)

复现：Quick 32 开始时显示 1 of 16、31 decisions remain；选择一次后变成 2 of 16，但仍显示剩余 31 次。代码仅使用 round.length - 1，没有扣除当前轮已完成次数。

更关键的代码问题：结果为冠军加“被淘汰者数组倒序”，这不能证明第二至第十名是用户真实偏好次序。假如用户最喜欢 A，其次 B，但 A、B 第一轮相遇，B 会很早被淘汰。随机签位和比赛先后影响名次。因此当前页面承诺的 Top 10 超过了实际算法能够保证的结果。

建议：先修正剩余次数，并明确“本轮 / 全程”；将结果称为“本次淘汰赛结果”，或者增加败者复选、最终手动排序等流程，再承诺偏好排名。加入撤销上一步、进度保存和继续入口。当前分享代码传文本和当前页面 URL，链接本身没有编码结果，不能认为朋友打开链接即可恢复同一榜单。

代码：[剩余次数](/Users/wanggang/Documents/Codex/randompokemon/src/components/tools/FavoritePokemonPicker.tsx:54)、[排名生成](/Users/wanggang/Documents/Codex/randompokemon/src/components/tools/FavoritePokemonPicker.tsx:83)。本次实测到第二个对决，完整排名算法结论来自代码检查，未声称完成整场 31 次选择。

## SEO 检查

### 不能把当前体验问题直接当成排名下降原因

项目既有 [SEO 策略](/Users/wanggang/Documents/Codex/randompokemon/docs/seo-strategy.md) 记录：约 8 月 9 日出现排名变化，8 月 12 日后扩展产品，8 月 23 日开始结构稳定期。这只是项目记录，尚未由后台数据验证；但至少不能把更晚新增的工具作为更早下降的既定原因。

Google 强调页面整体体验，但好的体验分数本身不保证排名，相关性仍然重要。应分开处理“让已访问的人顺利完成任务”和“让正确页面获得搜索曝光”。参考：[Google 页面体验说明](https://developers.google.com/search/docs/appearance/page-experience)。

### 基础技术配置已存在，优先检查意图与内容价值

首页有可渲染的初始结果与独立标题、描述；详情页生成静态参数；robots 允许抓取；sitemap 分为普通页面、图鉴和文章；没有在代码中发现首页统一 noindex 的配置。线上响应、Google 选择的 canonical 和索引状态仍需独立验证。

首页多次解释同一生成器，包含工具介绍、生成器目录、地区、图鉴入口、使用步骤、筛选说明、世代表、组队说明、两种算法比较、使用场景和 FAQ。内容长不自动构成 SEO 问题，但有重复和明显面向内部实现的措辞，例如“without turning every filter combination into a separate page”。这句话不帮助玩家完成任务，应删除或改写。

首页 FAQ 第一条称每个结果从候选池中均匀选择，却默认 Smart Team；后者会从多个候选队伍中评分择优。应明确“Pure Random 均匀抽取，Smart Team 有组合偏好”，保持说明与功能一致。

1,025 个详情页有结构化数值、进化、形态和工具入口，并非可直接定性为空壳；但大规模相同模板仍需逐类核对有没有满足具体查询。可以在有需求的既有页面补充特性影响、进化条件解释、适用玩法及有依据的原创比较。不要仅为凑字数扩写，也不要未经数据分析批量删除或 noindex 页面。参考：[Google 实用内容指南](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)。

### 参数 URL 规则偏宽，需要按意图复核

[proxy.ts](/Users/wanggang/Documents/Codex/randompokemon/proxy.ts:3) 对任何带查询参数的 HTML 路由设置 noindex, follow，包含 utm_source 这类归因参数。保存队伍、搜索和临时状态可以有明确的排除索引需求；但仅附加归因参数的重复页面应评估使用干净 canonical，避免把所有参数视为同一类。

这不表示干净首页会被自动移除索引，也不是已证实的排名原因。本次没有验证线上响应头。参考：[Google canonical 建议](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)。

### 性能是待测项

客户端完整 JSON 文件原始大小为 990,021 字节，生成器和其他工具都请求该数据；宝可梦图来自外部图片地址；全局布局载入广告脚本。需要检查线上压缩、缓存命中、图片失败率、广告布局位移和移动设备性能，不能用开发服务器速度代替真实用户 LCP、INP、CLS。截图中图片已成功加载，不能将它们报告为线上图片故障。

## 留存判断与埋点

工具站完成任务后离开可能是成功使用，不能只用停留时长或跳出率评价。应先看用户是否完成预期任务，再看是否保存成果和回来继续。

源码 [GoogleAnalytics.tsx](/Users/wanggang/Documents/Codex/randompokemon/src/components/analytics/GoogleAnalytics.tsx:28) 只显式上报 page_view；没有发现生成、锁定、存档、恢复和工具完成的自定义事件。GA4 自动采集或线上额外配置未核实，不能说完全没有统计。

建议新增事件：generate_success、generate_error、filter_apply、slot_lock、team_save、team_restore、share_success、planner_save、picker_start、picker_complete、picker_resume。参数使用工具名、单只/队伍模式、数量、错误类型等有限类别，避免记录完整种子或分享 URL。

| 指标 | 用途 |
| --- | --- |
| 首次生成成功率、首次成功耗时 | 用户是否快速获得结果 |
| 筛选后生成率、无结果比例 | 是否被筛选复杂度卡住 |
| 锁定后继续生成率 | 组队循环是否顺畅 |
| 保存率、恢复率 | 用户成果是否成为回访理由 |
| Picker 开始到完成率 | 选择流程是否过长或无法理解 |
| 分享成功率、分享链接恢复成功率 | 分享是否真的形成可继续使用的结果 |
| 7 日回访率，按工具和设备拆分 | 是否形成持续使用需求 |

先采集基线，再逐项发布优化；不设没有依据的“排名提升百分比”或转化保证。

## 建议执行顺序与验收

| 优先级 | 工作 | 验收标准 |
| --- | --- | --- |
| P1 | 统一锁定、生成与数量规则 | 主动作保留锁定成员；移除后当前数量明确；未应用筛选有提示 |
| P1 | 压缩手机首屏与团队卡片 | 390×844 能看到结果；常用动作无需长滚动 |
| P1 | Planner 自动保存、整队传递和满队操作 | 刷新可恢复；首页队伍可继续编辑；满队知道如何替换 |
| P1 | 修正 Picker 进度与结果承诺 | 每次选择剩余次数正确；排名文案符合算法；可以恢复进度 |
| P1 | 建立功能漏斗并取得 GSC 数据 | 能区分曝光、点击、生成成功和成果保存的问题 |
| P2 | 精简卡片、筛选分组、全局保存入口 | 常用与次要动作分明；保存结果易找 |
| P2 | 修正首页重复/内部措辞与事实表述 | 文案直接帮助玩家，Pure Random 与 Smart Team 解释一致 |
| P2 | 按参数类型复核索引策略、验证线上 CWV | 有线上响应和真实数据依据后再改 SEO 规则 |

首轮建议围绕“进入 → 生成 → 保留/替换 → 保存/分享 → 返回继续”完成闭环。暂不扩大页面种类；复用现有生成器、规划器、图鉴和收藏能力。

SEO 后续所需数据：本站 Search Console 最近三个月按查询、页面、设备、国家拆分的点击、曝光、CTR、平均排名；关键页 URL 检查与索引原因；GA4 的着陆页、设备、自然搜索流量和回访数据。按匹配查询与页面比较，而不是只看全站平均排名。
