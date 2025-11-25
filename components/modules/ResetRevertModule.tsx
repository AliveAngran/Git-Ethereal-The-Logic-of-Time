
import React, { useState } from 'react';
import { Trash2, RotateCcw, AlertOctagon, History } from 'lucide-react';
import { Button } from '../ui/Button';

interface CommitNode {
    id: string;
    label: string;
    active: boolean;
    ghost?: boolean; // For deleted commits visuals
    revertOf?: string; // If this is a revert commit
}

export const ResetRevertModule: React.FC = () => {
  const initialCommits: CommitNode[] = [
      { id: '1', label: 'C1', active: true },
      { id: '2', label: 'C2', active: true },
      { id: '3', label: 'C3', active: true },
      { id: '4', label: 'C4', active: true }, // HEAD
  ];

  const [commits, setCommits] = useState<CommitNode[]>(initialCommits);
  const [headIndex, setHeadIndex] = useState(3);
  const [mode, setMode] = useState<'normal' | 'reset' | 'revert'>('normal');

  const handleReset = () => {
      // Reset to C2 (Index 1)
      const target = 1;
      setMode('reset');
      
      // Mark 2 and 3 as ghosts
      setCommits(prev => prev.map((c, i) => i > target ? { ...c, ghost: true, active: false } : c));
      setHeadIndex(target);
  };

  const handleRevert = () => {
      // Revert C4 (Index 3)
      setMode('revert');
      const newCommit: CommitNode = {
          id: '5',
          label: "C4'",
          active: true,
          revertOf: 'C4'
      };
      setCommits([...commits, newCommit]);
      setHeadIndex(4);
  };

  const resetDemo = () => {
      setCommits(initialCommits);
      setHeadIndex(3);
      setMode('normal');
  };

  return (
    <div className="w-full flex flex-col gap-12 items-center justify-center min-h-[400px]">
        
        {/* Timeline */}
        <div className="flex items-center gap-4 relative h-32 px-12 glass-panel rounded-full">
            {/* Base Line */}
            <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-800 -z-10"></div>
            
            {commits.map((c, i) => (
                <React.Fragment key={c.id}>
                    {/* Connector Line Logic for Revert curve if needed, simplified here to straight line */}
                    
                    <div className={`relative flex flex-col items-center gap-3 transition-all duration-500
                        ${c.ghost ? 'opacity-20 blur-sm scale-90 grayscale' : 'opacity-100'}
                    `}>
                        {/* Node */}
                        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold font-mono transition-all duration-300 z-10
                            ${i === headIndex ? 'border-white scale-125 shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'border-slate-800'}
                            ${c.revertOf ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-200'}
                        `}>
                            {c.label}
                        </div>

                        {/* HEAD Label */}
                        {i === headIndex && (
                            <div className="absolute -top-10 bg-white text-black text-xs font-bold px-2 py-1 rounded animate-bounce">
                                HEAD
                            </div>
                        )}

                        {/* Description */}
                        {c.revertOf && (
                            <div className="absolute -bottom-8 whitespace-nowrap text-[10px] text-orange-400 font-mono">
                                Reverts {c.revertOf}
                            </div>
                        )}
                    </div>

                    {/* Arrow between nodes */}
                    {i < commits.length - 1 && (
                        <div className={`w-8 h-[2px] ${commits[i+1].ghost ? 'bg-slate-800' : 'bg-slate-600'}`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
            
            {/* Reset Section */}
            <div className={`p-6 rounded-xl border border-red-500/20 bg-red-500/5 transition-all ${mode === 'reset' ? 'ring-2 ring-red-500' : 'hover:bg-red-500/10'}`}>
                <div className="flex items-center gap-2 mb-4 text-red-400 font-bold">
                    <Trash2 className="w-5 h-5" />
                    Reset (重置)
                </div>
                <p className="text-xs text-slate-400 mb-6 h-12">
                    "我希望这一切从未发生。" <br/>
                    强制将 HEAD 指针向后移动。被遗弃的提交实际上被删除了（不可达）。
                </p>
                <Button onClick={handleReset} disabled={mode !== 'normal'} className="w-full bg-red-500/20 text-red-300 hover:bg-red-600 hover:text-white border-red-500/50">
                    Git Reset --hard C2
                </Button>
            </div>

            {/* Revert Section */}
            <div className={`p-6 rounded-xl border border-orange-500/20 bg-orange-500/5 transition-all ${mode === 'revert' ? 'ring-2 ring-orange-500' : 'hover:bg-orange-500/10'}`}>
                <div className="flex items-center gap-2 mb-4 text-orange-400 font-bold">
                    <RotateCcw className="w-5 h-5" />
                    Revert (回滚)
                </div>
                <p className="text-xs text-slate-400 mb-6 h-12">
                    "我承认我犯了错，但我会补救。" <br/>
                    向前移动。创建一个新的提交，其内容是撤销之前的修改。历史被保留。
                </p>
                <Button onClick={handleRevert} disabled={mode !== 'normal'} className="w-full bg-orange-500/20 text-orange-300 hover:bg-orange-600 hover:text-white border-orange-500/50">
                    Git Revert C4
                </Button>
            </div>

        </div>

        {mode !== 'normal' && (
            <Button onClick={resetDemo} variant="ghost" className="mt-4">
                <History className="w-4 h-4" /> 重置演示 (Restart Demo)
            </Button>
        )}

        <div className="text-center text-sm text-slate-500 max-w-lg">
             <AlertOctagon className="w-4 h-4 inline mr-1 -mt-0.5" />
             黄金法则：永远不要在<strong>公共分支</strong>（如 master）上使用 Reset。这会破坏其他人的历史。公共分支请务必使用 Revert。
        </div>

    </div>
  );
};
