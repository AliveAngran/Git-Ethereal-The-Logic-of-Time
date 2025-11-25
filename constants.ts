
import { ViewMode, LessonStep } from './types';

export const COLORS = {
  accent: '#a855f7', // Purple 500
  accentGlow: 'rgba(168, 85, 247, 0.5)',
  secondary: '#0ea5e9', // Sky 500
  success: '#22c55e', // Green 500
  warning: '#eab308', // Yellow 500
  danger: '#ef4444', // Red 500
  muted: '#64748b', // Slate 500
  background: '#020617', // Slate 950
};

export const LESSONS: Record<ViewMode, LessonStep> = {
  intro: {
    title: "序章：时间的形状",
    description: "Git 并非单纯的代码备份工具，而是一台时光机器。它不保存差异，它保存的是宇宙的切片（Snapshot）。大多数人理解错了这一点，所以才会觉得 Git 难。",
    interactionPrompt: "点击「初始化宇宙」来唤醒你的第一个 Git 仓库。"
  },
  hashing: {
    title: "一、指纹与灵魂 (Hashing)",
    description: "Git 如何确保数据永不丢失且不可篡改？每一个文件内容都会经过 SHA-1 算法计算出一个唯一的 40 位哈希值。内容变，哈希必变。这是 Git 的基石。",
    interactionPrompt: "在输入框中键入任何文字，观察「数字指纹」的实时变化。"
  },
  areas: {
    title: "二、三个平行空间 (The Three States)",
    description: "Git 的核心在于流转。你的文件在三个空间中跳跃：工作区（你正在写的）、暂存区（你打算提交的）、仓库区（永久保存的）。暂存区是很多新手的盲区，把它想象成「购物车」，只有结账（Commit）后才会生成订单。",
    interactionPrompt: "拖拽文件到「暂存区」，然后点击「生成快照」来永久保存。"
  },
  commits: {
    title: "三、快照链条 (Commits)",
    description: "每一个提交都不是「补丁」，而是一个完整的「快照」。它包含指向父节点的指针。即使你只改了一个文件，Git 也会重新引用所有文件，形成一个新的状态点。",
    interactionPrompt: "点击不同的提交节点，观察文件快照是如何被完整保存的。"
  },
  branches: {
    title: "四、轻量级指针 (Branching)",
    description: "分支极其廉价。它不是复制一堆代码，它仅仅是一个只有 40 字节的指针，指向某个提交节点。创建分支，就是贴了一个新标签。",
    interactionPrompt: "点击任意节点「创建分支」，你会发现仅仅多了一个标签，而没有复制任何数据。"
  },
  merging: {
    title: "五、世界线收束 (Merging)",
    description: "当两个平行宇宙需要合并时，Git 会寻找它们共同的祖先。如果顺滑则是 Fast-forward（直接移动指针），如果分叉则需要生成一个「合并节点」来连接两个历史。",
    interactionPrompt: "尝试「合并」Feature 分支，观察新的 Merge Commit 如何同时拥有两个父节点。"
  },
  timetravel: {
    title: "六、时间旅行 (Checkout & HEAD)",
    description: "HEAD 是「你现在在哪里」。当你使用 Checkout 切换到旧版本时，Git 只是把 HEAD 指针移过去了，并把工作区的文件变成了那个时刻的样子（Detached HEAD）。",
    interactionPrompt: "点击历史上的旧节点，穿越回过去，观察工作区文件的瞬间变化。"
  },
  cherrypick: {
    title: "七、量子纠缠 (Cherry-pick)",
    description: "如果你只想要平行宇宙（其他分支）里的某一个特定功能，而不需要它的全部历史，你可以「摘樱桃」。Git 会把那个提交的变化复制一份，在你的当前时间线上应用。",
    interactionPrompt: "点击 Feature 分支上的某个圆点，将其「抓取」到 Main 分支上。"
  },
  rebase: {
    title: "八、改变历史 (Rebase)",
    description: "Merge 会保留历史的真实（分叉），而 Rebase 则是重写历史（线性化）。它把你的分支「剪」下来，「接」到最新的主干后面。这让历史很干净，但它修改了 Commit ID。",
    interactionPrompt: "执行 Rebase，观察 Git 是如何将 Feature 分支的基底「平移」到 Main 的最新节点的。"
  },
  reset: {
    title: "九、后悔药 (Reset vs Revert)",
    description: "撤销有两种哲学：Reset 是「时光倒流」，彻底抹除后面的历史（适合私有分支）；Revert 是「负负得正」，新增一个「反向提交」来抵消错误（适合公开分支）。",
    interactionPrompt: "尝试使用 Reset 毁灭历史，或者使用 Revert 创建一个新的修正提交。"
  },
  tags: {
    title: "十、历史的锚点 (Tags)",
    description: "分支(Branch) 是会移动的浮标，随着新提交不断向前。而标签(Tag) 是刻在石头上的里程碑。在发版（如 v1.0, v2.0）时，我们需要一个永远指向特定代码状态的静态指针。",
    interactionPrompt: "选择一个完美的提交，给它打上「v1.0」的永久印记。"
  },
  stash: {
    title: "十一、时空暂存囊 (Stash)",
    description: "当你在开发新功能时（桌面一团乱），老板突然让你修一个紧急 Bug。你不想提交半成品，也不想删掉代码。Stash 允许你把当前工作区的「脏代码」暂时推入一个侧边堆栈，等修完 Bug 再弹出来。",
    interactionPrompt: "使用 Stash 暂时清空工作区，处理完其他事务后，再 Pop 恢复现场。"
  },
  flow: {
    title: "十二、工业级流水线 (Git Flow)",
    description: "在多人协作的大公司，我们不能都在 Main 上胡搞。我们需要一套严格的交通规则：功能(Feature)汇入开发(Dev)，开发稳定后汇入预发布(Release)，最后才进入生产(Main)。",
    interactionPrompt: "模拟一个 Feature 从开发到最终上线的完整生命周期流转。"
  },
  playground: {
    title: "终章：以太试炼 (The Ethereal Trials)",
    description: "纸上得来终觉浅。这里是你的演武场。我为你准备了 4 个真实场景的谜题。你需要组合使用 Commit, Branch, Checkout, Merge 等指令，将时间线修复成目标形态。",
    interactionPrompt: "选择关卡，观察目标，然后点击下方指令卡牌进行操作。"
  }
};