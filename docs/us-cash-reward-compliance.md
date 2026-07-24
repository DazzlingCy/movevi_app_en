# MOVEVI 美国版现金奖励与大转盘合规改造建议

> 本文用于产品、设计、研发和运营讨论，不构成法律意见。美国现金奖励、抽奖、促销、提现、税务和 KYC/AML 规则具有州别差异，真实上线前应由熟悉美国 sweepstakes / gaming / fintech / tax 合规的律师复核。

## 1. 背景与结论

MOVEVI 当前存在“完成运动任务 / 消耗勋章 / 大转盘随机抽现金 / 现金提现”的产品形态。该形态如果直接面向美国用户，可能被认定为高风险的 lottery / gambling / sweepstakes 结构。

美国常见风险判断框架是：

```text
Prize 奖品 + Chance 随机 + Consideration 对价/门槛 = 高风险彩票/赌博结构
```

当前大转盘可能同时具备三项：

| 要素 | MOVEVI 当前表现 | 风险 |
| --- | --- | --- |
| Prize 奖品 | `$0.88`、`$38.80` 等现金奖励 | 现金奖品通常会提高合规敏感度 |
| Chance 随机 | 大转盘随机抽取 | 属于 chance / random drawing |
| Consideration 对价/门槛 | 完成路线、消耗勋章、订阅会员影响权益或机会 | 可能被视为用户付出时间、金钱或努力 |

**推荐结论：美国版先取消“现金随机转盘”。保留转盘作为娱乐化奖励入口，但奖励改为积分、徽章、折扣券、会员天数或路线解锁券。现金提现只用于确定性奖励，不用于随机抽取。**

## 2. 推荐产品方案

### 2.1 最稳妥方案：固定任务奖励

将现金随机抽奖改为确定性任务奖励，去掉 `Chance`。

示例：

- 完成 1 条路线：固定获得 `Movevi Points`。
- 连续完成 7 天：固定获得 `$1 account credit` 或等值平台积分。
- 完成城市挑战：固定获得优惠券、徽章、会员天数或路线解锁券。
- 积分可兑换折扣、装备券、会员权益，不直接通过随机转盘提现现金。

优点：

- 去掉随机性，显著降低 lottery / gambling 风险。
- 用户仍然能获得清晰的运动激励。
- 研发实现简单，不需要复杂的 sweepstakes 规则、概率、公证、州备案。

### 2.2 保留转盘，但不抽现金

如果产品上必须保留“大转盘”的爽感，建议只抽非现金、不可直接提现奖励：

- XP / Light Points
- 数字徽章
- 城市卡片
- 头像框、皮肤、装扮
- 会员试用天数
- 运动积分
- 折扣券
- 路线解锁券

这样保留了游戏化体验，但降低了“随机现金奖品”的监管敏感度。

### 2.3 如必须保留现金随机奖励：改为合规 Sweepstakes

如果业务坚持保留现金随机奖励，应按美国 sweepstakes 思路重做，而不是按“完成任务抽现金”上线。

最低要求包括：

- 清晰展示 `No purchase necessary`。
- 提供 AMOE（Alternative Method of Entry），例如每天免费领取 1 次抽奖机会。
- 购买会员不能提高中奖概率。
- 订阅、付费、跑步、消耗勋章不能成为唯一获得抽奖机会的方法。
- 公开官方规则，包括起止时间、资格限制、奖品价值、中奖概率、开奖方式、通知方式、领取限制。
- 标注 `Void where prohibited`。
- 设置年龄限制，例如 `18+`。
- 对现金提现进行 KYC、税务、反作弊和地区限制。
- 奖池金额需要严格控制，避免触发部分州注册、保证金或备案要求。

## 3. MOVEVI 建议改造方向

### 3.1 改名：从 Cash Draw 到 Reward Center

建议将“大转盘现金红包”改造为：

```text
Movevi Rewards
```

核心逻辑：

1. 用户跑步获得 `Light Points`。
2. Points 可兑换会员天数、路线解锁券、装备折扣、数字徽章。
3. 每周活动可以保留转盘，但只抽非现金奖励。
4. 现金奖励只用于确定性活动，例如赛事奖金、推广奖励、企业挑战奖金。
5. 现金进入 `Pending Balance` 后，需要完成身份验证才能提现。

### 3.2 现金提现方式

国内：

- 微信零钱 / 微信红包

海外：

- 默认：PayPal
- 美国增强：银行账户 / 借记卡提现
- 长期正式方案：Stripe Connect 发放到银行卡，PayPal 作为备用提现方式

### 3.3 现金提现流程

建议现金提现流程改为：

```text
Pending Balance -> Verify identity -> Choose payout method -> Review -> Payout processing
```

页面应说明：

- Cash rewards require identity verification.
- Payout availability may vary by country or state.
- Taxes may apply.
- MOVEVI may review suspicious activity before payout.

## 4. 文案替换建议

### 4.1 不建议使用

以下文案在美国版中应避免：

- `100% cash draw`
- `现金红包`
- `奖池`
- `大转盘抽现金`
- `订阅会员提升中奖概率`
- `付费解锁更多抽奖机会`
- `跑完即可抽现金`

### 4.2 建议使用

建议替换为：

- `Reward Center`
- `Earn points from workouts`
- `Redeem rewards`
- `No purchase necessary`
- `Odds are not affected by subscription`
- `Cash rewards require identity verification`
- `Rewards are subject to eligibility review`
- `Void where prohibited`

### 4.3 示例界面文案

```text
Movevi Rewards
Earn Light Points from workouts and redeem them for route passes, badges, and Premium days.
Cash rewards, where available, require identity verification and eligibility review.
```

```text
No purchase necessary. Subscription status does not increase odds of winning.
Void where prohibited. Terms apply.
```

## 5. 产品决策建议

| 方案 | 法律风险 | 用户体验 | 实现成本 | 推荐度 |
| --- | --- | --- | --- | --- |
| 固定任务奖励，无随机现金 | 低 | 清晰稳定 | 低 | 强推荐 |
| 转盘抽非现金奖励 | 中低 | 游戏化强 | 中 | 推荐 |
| 现金 sweepstakes + AMOE + 官方规则 | 中高 | 保留现金刺激 | 高 | 谨慎 |
| 现有现金大转盘直接上线美国 | 高 | 刺激强 | 低 | 不推荐 |

建议分阶段落地：

1. **Phase 1**：美国版关闭现金随机转盘，改为积分、徽章、券类奖励。
2. **Phase 2**：上线 `Pending Balance` 和身份验证提示，仅支持确定性现金奖励。
3. **Phase 3**：如业务仍要现金随机奖励，再做完整 sweepstakes 规则、AMOE、地区限制和律师审查。

## 6. 研发与设计影响

### 6.1 需要调整的模块

- `MedalDrawView`：去掉现金随机奖品展示，改为积分/徽章/券类奖励。
- `TimeSpaceWheelView`：转盘奖项改为非现金奖励。
- `WeekendMedleyView`：去掉微信红包、现金直汇、现金秘宝等国内红包语境。
- 提现入口：改成 `Pending Balance`、`Verify identity`、`Choose payout method`。

### 6.2 奖励数据建议

可将奖励类型拆成：

```ts
type RewardType =
  | 'points'
  | 'badge'
  | 'route_pass'
  | 'premium_days'
  | 'coupon'
  | 'cash_credit';
```

其中：

- `cash_credit` 只能来自确定性任务、赛事或人工审核活动。
- 随机转盘只能返回 `points`、`badge`、`route_pass`、`premium_days`、`coupon`。

### 6.3 风控状态建议

现金相关余额建议使用：

```ts
type CashBalanceStatus =
  | 'pending'
  | 'eligible'
  | 'verification_required'
  | 'under_review'
  | 'paid'
  | 'rejected';
```

## 7. 参考资料

- California Department of Justice: [Sweepstakes and Prize Notifications](https://oag.ca.gov/consumers/general/sweepstakes)
- New York Department of State: [Games of Chance Registration](https://dos.ny.gov/games-chance-registration)
- Florida Department of Agriculture and Consumer Services: [Game Promotions / Sweepstakes](https://www.fdacs.gov/Business-Services/Game-Promotions-Sweepstakes)
- Florida Consumer Resources: [Game Promotions / Sweepstakes](https://www.fdacs.gov/Consumer-Resources/Scams-and-Fraud/Game-Promotions-Sweepstakes)
- FTC Endorsement Guides FAQ: [What People Are Asking](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking)

## 8. 最终建议

美国版不要直接上线“现金大转盘”。最平衡的方案是：

```text
取消现金随机抽奖
保留非现金转盘
现金提现只用于确定性奖励
提现前增加身份验证和资格审核
```

这样既能保留运动激励和游戏化体验，又能显著降低美国 lottery / gambling / sweepstakes 合规风险。
