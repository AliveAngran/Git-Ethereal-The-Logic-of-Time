import React, { useState, useRef, useEffect } from 'react';
import { Commit, Branch } from '../../types';
import { GitBranch, GitCommit, Play, Scissors, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { shortHash } from '../../services/hashUtils';

// Helper to calculate positions for a tree layout
const calculatePositions = (commits: Commit[], branches: Branch[]) => {
  const positions: Record<string, { x: number, y: number, color: string }> = {};
  const branchLanes: Record<string, number> = { 'main': 0 };
  let currentLane = 0;

  // Simple logic: Main is y=0. If a commit splits, new y.
  // This is a simplified visualizer logic for demonstration.
  
  commits.forEach((commit, index) => {
    let lane = 0;
    // Find if this commit belongs to a specific branch context or follows parent
    const branchName = commit.branch || 'main';
    
    if (branchLanes[branchName] === undefined) {
      currentLane += 1;
      branchLanes[branchName] = currentLane;
    }
    lane = branchLanes[branchName];

    positions[commit.id] = {
      x: 50 + (index * 80),
      y: 150 + (lane * 60),
      color: branchName === 'main' ? '#3b82f6' : '#a855f7'
    };
  });
  return positions;
};

export const BranchingModule: React.FC = () => {
  const [commits, setCommits] = useState<Commit[]>([
    { id: 'c1', message: 'init', parentId: null, timestamp: 1, files: [], branch: 'main' },
    { id: 'c2', message: 'setup', parentId: 'c1', timestamp: 2, files: [], branch: 'main' },
  ]);
  const [branches, setBranches] = useState<Branch[]>([
    { name: 'main', commitId: 'c2', color: '#3b82f6' }
  ]);
  const [head, setHead] = useState<string>('main'); // Head points to a branch name
  
  const positions = calculatePositions(commits, branches);

  const createCommit = () => {
    const currentBranchName = head;
    const currentBranch = branches.find(b => b.name === currentBranchName);
    if (!currentBranch) return;

    const newId = 'c' + (commits.length + 1);
    const newCommit: Commit = {
      id: newId,
      message: `work on ${currentBranchName}`,
      parentId: currentBranch.commitId,
      timestamp: Date.now(),
      files: [],
      branch: currentBranchName
    };

    setCommits([...commits, newCommit]);
    
    // Update branch pointer
    setBranches(branches.map(b => 
      b.name === currentBranchName ? { ...b, commitId: newId } : b
    ));
  };

  const createBranch = () => {
    if (branches.some(b => b.name === 'feature')) return; // Limit to 1 feature branch for simplicity
    
    const currentBranch = branches.find(b => b.name === head);
    if(!currentBranch) return;

    const newBranch: Branch = {
      name: 'feature',
      commitId: currentBranch.commitId,
      color: '#a855f7'
    };
    
    setBranches([...branches, newBranch]);
    setHead('feature'); // Auto checkout
  };

  const checkout = (branchName: string) => {
    setHead(branchName);
  };

  // SVG Drawing
  const renderConnections = () => {
    return commits.map(commit => {
      if (!commit.parentId) return null;
      const start = positions[commit.parentId];
      const end = positions[commit.id];
      if (!start || !end) return null;

      return (
        <path
          key={`${commit.parentId}-${commit.id}`}
          d={`M ${start.x} ${start.y} C ${start.x + 40} ${start.y}, ${end.x - 40} ${end.y}, ${end.x} ${end.y}`}
          stroke="#475569"
          strokeWidth="2"
          fill="none"
          className="transition-all duration-500"
        />
      );
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex gap-4 justify-center">
        <Button onClick={createCommit} icon={<Plus className="w-4 h-4" />}>
          提交 (Commit)
        </Button>
        <Button 
          onClick={createBranch} 
          disabled={branches.length > 1} 
          variant="secondary"
          icon={<GitBranch className="w-4 h-4" />}
        >
          创建分支 (Branch)
        </Button>
      </div>

      <div className="flex justify-center gap-4 mb-2">
        {branches.map(b => (
           <button
             key={b.name}
             onClick={() => checkout(b.name)}
             className={`text-xs px-3 py-1 rounded-full border transition-all ${head === b.name ? 'bg-white text-black border-white' : 'text-slate-500 border-slate-700 hover:border-slate-500'}`}
           >
             Checkout {b.name}
           </button>
        ))}
      </div>

      <div className="glass-panel w-full h-[400px] rounded-xl relative overflow-hidden bg-slate-900/80 shadow-inner">
        <svg className="w-full h-full absolute inset-0 pointer-events-none">
          {renderConnections()}
        </svg>

        {commits.map((commit) => {
          const pos = positions[commit.id];
          if(!pos) return null;
          
          // Check if any branch points here
          const branchLabels = branches.filter(b => b.commitId === commit.id);
          const isHead = branches.find(b => b.name === head)?.commitId === commit.id;

          return (
            <div
              key={commit.id}
              style={{ left: pos.x, top: pos.y }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            >
              <div 
                className={`w-4 h-4 rounded-full border-2 bg-slate-900 z-10 relative transition-all duration-300 ${isHead ? 'scale-150 border-white shadow-[0_0_10px_white]' : ''}`}
                style={{ borderColor: pos.color }}
              ></div>
              
              {/* Branch Labels */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center w-32">
                 <span className="text-[10px] text-slate-500 font-mono">{commit.id}</span>
                {branchLabels.map(b => (
                  <div key={b.name} className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-lg flex items-center gap-1" style={{ backgroundColor: b.color }}>
                    <GitBranch className="w-3 h-3" />
                    {b.name}
                    {head === b.name && <span className="ml-1 text-white/50">(HEAD)</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-sm text-slate-400 text-center">
        <strong className="text-purple-400">交互解析：</strong> 
        试着创建分支并切换。你会发现图中的 <code>HEAD</code> 标志在移动。
        <br/>
        在 Git 中，HEAD 只是一个指向「当前分支」的指针，而分支只是一个指向「最新提交」的指针。
        当你创建分支时，你并没有复制文件，你只是在当前的 Commit 节点上贴了一张便利贴。这就是 Git 分支为什么瞬间就能创建完毕的原因。
      </div>
    </div>
  );
};