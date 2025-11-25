
import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, GitMerge, RotateCcw, Play, CheckCircle2, XCircle, Trophy, Terminal } from 'lucide-react';
import { Button } from '../ui/Button';

// --- Game Engine Types ---
interface GameNode {
  id: string;
  parentId: string | null;
  secondParentId?: string | null;
  branchColor?: string; // visual helper
}

interface GameBranch {
  name: string;
  commitId: string;
  color: string;
}

interface GameState {
  commits: GameNode[];
  branches: GameBranch[];
  headBranch: string; // name of branch we are on
  historyLog: string[];
}

interface Level {
  id: number;
  title: string;
  description: string;
  goalDescription: string;
  initialState: GameState;
  checkWin: (state: GameState) => boolean;
  hint: string;
}

// --- Levels Configuration ---
const LEVELS: Level[] = [
  {
    id: 1,
    title: "初出茅庐 (First Steps)",
    description: "任何伟大的项目都始于第一步。我们需要推进项目进度。",
    goalDescription: "在 main 分支上创建 2 个新的提交 (Commit)。",
    initialState: {
      commits: [{ id: 'C1', parentId: null }],
      branches: [{ name: 'main', commitId: 'C1', color: '#3b82f6' }],
      headBranch: 'main',
      historyLog: ['Repo initialized.']
    },
    checkWin: (state) => state.commits.length >= 3 && state.branches.find(b => b.name === 'main')?.commitId === state.commits[2].id,
    hint: "点击 'Commit' 按钮两次即可。"
  },
  {
    id: 2,
    title: "分道扬镳 (Branching Out)",
    description: "我们需要开发一个新功能，但不能影响主线稳定性。",
    goalDescription: "创建一个名为 'dev' 的新分支，并切换过去，然后在新分支上提交一次。",
    initialState: {
      commits: [{ id: 'C1', parentId: null }, { id: 'C2', parentId: 'C1' }],
      branches: [{ name: 'main', commitId: 'C2', color: '#3b82f6' }],
      headBranch: 'main',
      historyLog: ['Initial setup complete.']
    },
    checkWin: (state) => {
      const dev = state.branches.find(b => b.name === 'dev');
      return !!dev && dev.commitId !== 'C2' && state.headBranch === 'dev';
    },
    hint: "先 'Branch: dev'，然后 'Checkout: dev'，最后 'Commit'。"
  },
  {
    id: 3,
    title: "殊途同归 (The Merge)",
    description: "功能开发完成了，是时候将其合并回主线了。",
    goalDescription: "将 'feat' 分支的成果合并 (Merge) 到 'main' 分支中。",
    initialState: {
      commits: [
        { id: 'C1', parentId: null },
        { id: 'C2', parentId: 'C1' }, // Main tip
        { id: 'F1', parentId: 'C1', branchColor: '#a855f7' } // Feat tip
      ],
      branches: [
        { name: 'main', commitId: 'C2', color: '#3b82f6' },
        { name: 'feat', commitId: 'F1', color: '#a855f7' }
      ],
      headBranch: 'main',
      historyLog: ['Branches diverged.']
    },
    checkWin: (state) => {
      const main = state.branches.find(b => b.name === 'main');
      const lastCommit = state.commits.find(c => c.id === main?.commitId);
      // Check if last commit on main has 2 parents (merge commit)
      return !!lastCommit?.secondParentId;
    },
    hint: "确保你在 main 分支上 (Checkout main)，然后点击 'Merge feat'。"
  },
  {
    id: 4,
    title: "紧急回滚 (Emergency Reset)",
    description: "糟糕！刚才的提交包含了一个严重的 Bug。我们需要撤销最近的一次提交，回到安全状态。",
    goalDescription: "将 'main' 分支回退 (Reset) 到上一个版本 (C2)。",
    initialState: {
      commits: [
        { id: 'C1', parentId: null },
        { id: 'C2', parentId: 'C1' },
        { id: 'C3-ERR', parentId: 'C2', branchColor: '#ef4444' } // Bad commit
      ],
      branches: [{ name: 'main', commitId: 'C3-ERR', color: '#3b82f6' }],
      headBranch: 'main',
      historyLog: ['Bug introduced in C3-ERR.']
    },
    checkWin: (state) => {
        const main = state.branches.find(b => b.name === 'main');
        return main?.commitId === 'C2';
    },
    hint: "使用 'Reset' 指令强制移动 HEAD 指针。"
  }
];

export const PlaygroundModule: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [gameState, setGameState] = useState<GameState>(LEVELS[0].initialState);
  const [isWin, setIsWin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const level = LEVELS[currentLevelIdx];

  // --- Reset Level ---
  useEffect(() => {
    setGameState(JSON.parse(JSON.stringify(LEVELS[currentLevelIdx].initialState)));
    setIsWin(false);
    setErrorMsg(null);
  }, [currentLevelIdx]);

  // --- Win Check ---
  useEffect(() => {
    if (level.checkWin(gameState)) {
      setIsWin(true);
    }
  }, [gameState, level]);

  // --- Actions ---
  const handleCommit = () => {
    if (isWin) return;
    const currentBranch = gameState.branches.find(b => b.name === gameState.headBranch);
    if (!currentBranch) return;

    const newId = `C${gameState.commits.length + 1}`;
    const newCommit: GameNode = {
      id: newId,
      parentId: currentBranch.commitId,
      branchColor: currentBranch.color
    };

    setGameState(prev => ({
      ...prev,
      commits: [...prev.commits, newCommit],
      branches: prev.branches.map(b => b.name === prev.headBranch ? { ...b, commitId: newId } : b),
      historyLog: [...prev.historyLog, `> git commit -m "work on ${prev.headBranch}"`]
    }));
  };

  const handleBranch = (name: string) => {
    if (isWin) return;
    if (gameState.branches.find(b => b.name === name)) {
      setErrorMsg(`Branch '${name}' already exists!`);
      return;
    }
    const currentBranch = gameState.branches.find(b => b.name === gameState.headBranch);
    if (!currentBranch) return;

    const newBranch: GameBranch = {
      name,
      commitId: currentBranch.commitId,
      color: name === 'dev' ? '#22c55e' : '#a855f7'
    };

    setGameState(prev => ({
      ...prev,
      branches: [...prev.branches, newBranch],
      historyLog: [...prev.historyLog, `> git branch ${name}`]
    }));
  };

  const handleCheckout = (name: string) => {
    if (isWin) return;
    if (!gameState.branches.find(b => b.name === name)) {
      setErrorMsg(`Branch '${name}' does not exist!`);
      return;
    }
    setGameState(prev => ({
      ...prev,
      headBranch: name,
      historyLog: [...prev.historyLog, `> git checkout ${name}`]
    }));
  };

  const handleMerge = (targetName: string) => {
    if (isWin) return;
    const targetBranch = gameState.branches.find(b => b.name === targetName);
    const currentBranch = gameState.branches.find(b => b.name === gameState.headBranch);
    
    if (!targetBranch || !currentBranch) return;
    if (targetName === gameState.headBranch) {
        setErrorMsg("Cannot merge a branch into itself!");
        return;
    }

    const newId = `M${gameState.commits.length + 1}`;
    const mergeCommit: GameNode = {
      id: newId,
      parentId: currentBranch.commitId,
      secondParentId: targetBranch.commitId,
      branchColor: currentBranch.color
    };

    setGameState(prev => ({
      ...prev,
      commits: [...prev.commits, mergeCommit],
      branches: prev.branches.map(b => b.name === prev.headBranch ? { ...b, commitId: newId } : b),
      historyLog: [...prev.historyLog, `> git merge ${targetName}`]
    }));
  };

  const handleReset = () => {
      if (isWin) return;
      const currentBranch = gameState.branches.find(b => b.name === gameState.headBranch);
      if(!currentBranch) return;

      const currentCommit = gameState.commits.find(c => c.id === currentBranch.commitId);
      if(!currentCommit || !currentCommit.parentId) {
          setErrorMsg("Cannot reset further back (Root commit).");
          return;
      }

      setGameState(prev => ({
          ...prev,
          branches: prev.branches.map(b => b.name === prev.headBranch ? { ...b, commitId: currentCommit.parentId! } : b),
          historyLog: [...prev.historyLog, `> git reset --hard HEAD~1`]
      }));
  };

  // --- Visualizer Helpers ---
  // Simple deterministic position calculator for the graph
  const getCommitPos = (id: string, allCommits: GameNode[]) => {
      // Find depth
      let depth = 0;
      let curr = allCommits.find(c => c.id === id);
      while(curr && curr.parentId) {
          depth++;
          curr = allCommits.find(c => c.id === curr!.parentId);
      }
      
      // Determine lane based on branch color logic or simple ID check
      // This is a simplified visualizer logic for the game
      const commit = allCommits.find(c => c.id === id);
      let lane = 0;
      if (commit?.branchColor === '#a855f7') lane = 1; // Feature/purple lane
      if (commit?.branchColor === '#22c55e') lane = 1; // Dev/green lane
      if (commit?.branchColor === '#ef4444') lane = 0; // Red lane (usually main error)

      return { x: 50 + depth * 60, y: 100 + lane * 50 };
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      
      {/* Header Level Info */}
      <div className="flex items-center justify-between glass-panel p-6 rounded-xl border-b-4 border-b-purple-500/50">
          <div>
              <div className="text-xs font-mono text-purple-400 mb-2 uppercase tracking-widest">Trial {level.id} / {LEVELS.length}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{level.title}</h2>
              <p className="text-slate-400">{level.description}</p>
          </div>
          <div className="text-right">
             <div className="text-sm text-slate-500 font-mono mb-1">GOAL TARGET</div>
             <div className="text-lg text-yellow-300 font-bold max-w-xs">{level.goalDescription}</div>
          </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[500px]">
          
          {/* Left: Game Graph Visualizer */}
          <div className="flex-1 glass-panel rounded-xl relative overflow-hidden bg-slate-950 shadow-inner p-4">
              <div className="absolute top-4 left-4 flex gap-2">
                 <div className="text-xs text-slate-500 font-mono">HEAD: <span className="text-white font-bold">{gameState.headBranch}</span></div>
              </div>
              
              {/* SVG Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {gameState.commits.map(c => {
                      if (!c.parentId) return null;
                      const start = getCommitPos(c.parentId, gameState.commits);
                      const end = getCommitPos(c.id, gameState.commits);
                      return <path key={c.id} d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} stroke="#475569" strokeWidth="2" />;
                  })}
                  {gameState.commits.map(c => {
                      if (!c.secondParentId) return null;
                      const start = getCommitPos(c.secondParentId, gameState.commits);
                      const end = getCommitPos(c.id, gameState.commits);
                      return <path key={`merge-${c.id}`} d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} stroke="#475569" strokeWidth="2" strokeDasharray="4" />;
                  })}
              </svg>

              {/* Nodes */}
              {gameState.commits.map(c => {
                  const pos = getCommitPos(c.id, gameState.commits);
                  const isHead = gameState.branches.find(b => b.name === gameState.headBranch)?.commitId === c.id;
                  
                  // Find labels
                  const labels = gameState.branches.filter(b => b.commitId === c.id);

                  return (
                      <div key={c.id} className="absolute transition-all duration-500" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}>
                          <div 
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-mono font-bold z-10 bg-slate-900
                                ${isHead ? 'border-white shadow-[0_0_15px_white] scale-125' : 'border-slate-600'}
                            `}
                            style={{ borderColor: isHead ? 'white' : c.branchColor || '#3b82f6' }}
                          >
                              {c.id}
                          </div>
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center w-24">
                              {labels.map(b => (
                                  <span key={b.name} className="px-1.5 py-0.5 rounded text-[8px] font-bold text-white shadow" style={{ backgroundColor: b.color }}>
                                      {b.name}
                                  </span>
                              ))}
                          </div>
                      </div>
                  );
              })}
          </div>

          {/* Right: Controls & Terminal */}
          <div className="w-full lg:w-96 flex flex-col gap-4">
              
              {/* Action Deck */}
              <div className="grid grid-cols-2 gap-3 p-4 glass-panel rounded-xl border-t-4 border-t-blue-500/20">
                  <Button onClick={handleCommit} disabled={isWin} icon={<GitCommit className="w-4 h-4" />}>Commit</Button>
                  
                  {/* Context Sensitive Buttons based on Level */}
                  {level.id === 2 && (
                    <>
                       <Button onClick={() => handleBranch('dev')} disabled={isWin} variant="secondary" icon={<GitBranch className="w-4 h-4" />}>Branch dev</Button>
                       <Button onClick={() => handleCheckout('dev')} disabled={isWin} variant="ghost">Checkout dev</Button>
                    </>
                  )}

                  {level.id === 3 && (
                     <>
                        <Button onClick={() => handleCheckout('main')} disabled={isWin} variant="ghost">Checkout main</Button>
                        <Button onClick={() => handleMerge('feat')} disabled={isWin} variant="secondary" icon={<GitMerge className="w-4 h-4" />}>Merge feat</Button>
                     </>
                  )}

                   {level.id === 4 && (
                     <Button onClick={handleReset} disabled={isWin} variant="secondary" icon={<RotateCcw className="w-4 h-4" />}>Reset HEAD~1</Button>
                  )}
              </div>

              {/* Terminal Log */}
              <div className="flex-1 glass-panel rounded-xl p-4 font-mono text-xs overflow-y-auto bg-black/40 text-slate-400">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5 mb-2 text-slate-500">
                      <Terminal className="w-3 h-3" /> BASH
                  </div>
                  {gameState.historyLog.map((log, i) => (
                      <div key={i} className="mb-1">{log}</div>
                  ))}
                  {errorMsg && <div className="text-red-400 mt-2">Error: {errorMsg}</div>}
                  {isWin && (
                      <div className="mt-4 text-green-400 font-bold border-t border-white/10 pt-2 animate-pulse">
                          &gt; SUCCESS: Goal Achieved! <br/>
                          &gt; System Status: Stable.
                      </div>
                  )}
              </div>

          </div>
      </div>

      {/* Win Modal Overlay */}
      {isWin && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-900 border border-purple-500/50 p-8 rounded-2xl max-w-md w-full text-center shadow-[0_0_50px_rgba(168,85,247,0.3)] transform scale-105">
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6 animate-bounce" />
                  <h3 className="text-2xl font-bold text-white mb-2">试炼通过！</h3>
                  <p className="text-slate-400 mb-8">你已经掌握了这部分时空法则。</p>
                  
                  <div className="flex gap-4 justify-center">
                    {currentLevelIdx < LEVELS.length - 1 ? (
                        <Button onClick={() => setCurrentLevelIdx(prev => prev + 1)} className="w-full">
                            下一关 (Next Level)
                        </Button>
                    ) : (
                        <div className="text-purple-300 font-bold">恭喜！你已通关所有试炼。</div>
                    )}
                  </div>
              </div>
          </div>
      )}

      {/* Helper Bar */}
      <div className="flex justify-between items-center text-sm text-slate-500 px-2">
         <button onClick={() => { setGameState(JSON.parse(JSON.stringify(level.initialState))); setErrorMsg(null); }} className="hover:text-white flex items-center gap-2">
             <RotateCcw className="w-3 h-3" /> 重置本关
         </button>
         <div className="text-slate-600 italic">Hint: {level.hint}</div>
      </div>

    </div>
  );
};
