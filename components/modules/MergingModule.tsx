import React, { useState } from 'react';
import { GitMerge, ArrowRight, GitBranch } from 'lucide-react';
import { Button } from '../ui/Button';

type MergeState = 'initial' | 'fast-forward' | 'three-way' | 'merged';

export const MergingModule: React.FC = () => {
  const [scenario, setScenario] = useState<'ff' | 'recursive'>('ff');
  const [mergeState, setMergeState] = useState<MergeState>('initial');

  const reset = (type: 'ff' | 'recursive') => {
    setScenario(type);
    setMergeState('initial');
  };

  const executeMerge = () => {
    setMergeState(scenario === 'ff' ? 'fast-forward' : 'three-way');
    setTimeout(() => {
      setMergeState('merged');
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => reset('ff')}
          className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${scenario === 'ff' ? 'bg-blue-500/20 text-blue-300 border-blue-500' : 'bg-slate-900 text-slate-500 border-transparent'}`}
        >
          Scenario A: Fast-Forward
        </button>
        <button
          onClick={() => reset('recursive')}
          className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${scenario === 'recursive' ? 'bg-purple-500/20 text-purple-300 border-purple-500' : 'bg-slate-900 text-slate-500 border-transparent'}`}
        >
          Scenario B: 3-Way Merge
        </button>
      </div>

      {/* Visualizer */}
      <div className="glass-panel w-full h-[350px] rounded-xl relative overflow-hidden bg-slate-950 shadow-inner flex items-center justify-center">
        
        {/* Graph Container */}
        <div className="relative w-full max-w-lg h-64">
            {/* Base Line (Main) */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 rounded"></div>
            
            {/* Nodes */}
            {/* C1 - Initial */}
            <div className="absolute top-1/2 left-[10%] -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 border-2 border-slate-900 z-10 flex items-center justify-center text-[10px] font-mono">C1</div>
            
            {/* C2 - Split Point */}
            <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 border-2 border-slate-900 z-10 flex items-center justify-center text-[10px] font-mono">C2</div>

            {/* Scenario Specifics */}
            {scenario === 'ff' ? (
                <>
                    {/* Feature Branch commits that are ahead directly */}
                    <div className="absolute top-1/2 left-[50%] -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500 border-2 border-slate-900 z-10 flex items-center justify-center text-[10px] font-mono">C3</div>
                    <div className="absolute top-1/2 left-[70%] -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500 border-2 border-slate-900 z-10 flex items-center justify-center text-[10px] font-mono">C4</div>
                    
                    {/* Main Label */}
                    <div className={`absolute top-1/2 -translate-y-1/2 transition-all duration-1000 z-20 px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded shadow-lg flex items-center gap-1
                        ${mergeState === 'initial' ? 'left-[30%] -translate-x-1/2' : 'left-[70%] -translate-x-1/2'}
                    `}>
                        <GitBranch className="w-3 h-3" /> main
                    </div>

                    {/* Feature Label */}
                    <div className="absolute top-1/2 left-[70%] -translate-x-1/2 -translate-y-[200%] px-2 py-1 bg-purple-500 text-white text-[10px] font-bold rounded shadow-lg z-20 flex items-center gap-1">
                        <GitBranch className="w-3 h-3" /> feat
                    </div>
                </>
            ) : (
                <>
                    {/* Main continued */}
                    <div className="absolute top-1/2 left-[50%] -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 border-2 border-slate-900 z-10 flex items-center justify-center text-[10px] font-mono">C3</div>
                    
                    {/* Feature Diverged */}
                    <div className="absolute top-[20%] left-[50%] -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500 border-2 border-slate-900 z-10 flex items-center justify-center text-[10px] font-mono">C4</div>
                    
                    {/* Connector Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {/* C2 to C3 */}
                        {/* C2 to C4 */}
                        <path d="M 160 128 C 200 128, 200 50, 260 50" stroke="#475569" strokeWidth="2" fill="none" />
                        
                        {/* Merge Lines (Visible only on merge) */}
                        {mergeState !== 'initial' && (
                             <path d="M 270 128 C 320 128, 350 128, 400 128" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" fill="none" className="animate-draw" />
                        )}
                         {mergeState !== 'initial' && (
                             <path d="M 270 50 C 320 50, 350 128, 400 128" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" fill="none" className="animate-draw" />
                        )}
                    </svg>

                    {/* Merge Commit (Appears later) */}
                    <div className={`absolute top-1/2 left-[78%] -translate-y-1/2 w-8 h-8 rounded-full bg-green-500 border-2 border-white shadow-[0_0_15px_#22c55e] z-10 flex items-center justify-center text-[10px] font-mono transition-all duration-500 ${mergeState === 'merged' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                        M
                    </div>

                    {/* Labels */}
                     <div className={`absolute top-1/2 -translate-y-[200%] transition-all duration-1000 z-20 px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded shadow-lg flex items-center gap-1
                        ${mergeState === 'merged' ? 'left-[78%] -translate-x-1/2' : 'left-[50%] -translate-x-1/2'}
                    `}>
                        <GitBranch className="w-3 h-3" /> main
                    </div>
                     <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-[200%] px-2 py-1 bg-purple-500 text-white text-[10px] font-bold rounded shadow-lg z-20 flex items-center gap-1">
                        <GitBranch className="w-3 h-3" /> feat
                    </div>
                </>
            )}

        </div>
        
        {/* Action Button */}
        <div className="absolute bottom-6">
            <Button 
                onClick={executeMerge} 
                disabled={mergeState !== 'initial'}
                icon={<GitMerge className="w-4 h-4" />}
                className="bg-white text-black hover:bg-slate-200"
            >
                执行合并 (Merge)
            </Button>
        </div>
      </div>

      {/* Explanation Text */}
      <div className="glass-panel p-6 rounded-xl border-l-4 border-l-purple-500">
        <h4 className="text-purple-300 font-bold mb-2 flex items-center gap-2">
            {scenario === 'ff' ? 'Fast-Forward (快进模式)' : '3-Way Merge (三方合并)'}
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed">
            {scenario === 'ff' 
                ? "这是最理想的情况。Git 发现 Main 分支自从分叉后没有发生任何变化。所以合并操作仅仅是把 Main 的标签（指针）向前移动到 Feature 的位置。就像火车在同一条铁轨上向前开了一段。没有生成新的提交节点。"
                : "这是最常见的情况。Main 分支在分叉后也有了新的提交（C3），和 Feature 分支（C4）走上了不同的道路。为了合并，Git 必须创建一个新的「合并提交」(M)。这个节点很特殊，它有两个父节点（C3 和 C4），代表了两条时间线的收束。"
            }
        </p>
      </div>
    </div>
  );
};