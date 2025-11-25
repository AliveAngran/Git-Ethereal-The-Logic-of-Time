
import React, { useState } from 'react';
import { Package, Briefcase, Archive, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '../ui/Button';

export const StashModule: React.FC = () => {
  const [workspace, setWorkspace] = useState<string[]>(['Unfinished Feature A', 'Messy Config Change']);
  const [stashStack, setStashStack] = useState<string[][]>([]);

  const handleStash = () => {
    if (workspace.length === 0) return;
    setStashStack(prev => [workspace, ...prev]);
    setWorkspace([]);
  };

  const handlePop = () => {
    if (stashStack.length === 0) return;
    const [top, ...rest] = stashStack;
    setWorkspace(prev => [...prev, ...top]);
    setStashStack(rest);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-12 items-center justify-center min-h-[450px]">
      
      {/* Working Directory */}
      <div className="flex-1 w-full max-w-sm h-80 glass-panel rounded-xl p-6 flex flex-col relative border-t-4 border-t-red-500/50">
        <h3 className="text-red-200 font-bold flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5" /> 工作区 (Workspace)
        </h3>
        
        <div className="flex-1 bg-slate-900/50 rounded-lg p-4 space-y-3 overflow-y-auto">
           {workspace.length > 0 ? (
             workspace.map((item, i) => (
               <div key={i} className="bg-slate-800 p-3 rounded border border-red-500/20 text-sm text-slate-300 animate-fade-in flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-red-400"></span>
                 {item}
               </div>
             ))
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-600 italic gap-2">
               <span className="text-green-500 font-bold">Clean</span>
               现在可以安全地切分支修 Bug 了
             </div>
           )}
        </div>

        <div className="mt-4 flex justify-center">
            <Button onClick={handleStash} disabled={workspace.length === 0} className="w-full">
              <ArrowDown className="w-4 h-4" /> 暂存 (git stash)
            </Button>
        </div>
      </div>

      {/* The Stack (Stash) */}
      <div className="flex-1 w-full max-w-sm h-80 glass-panel rounded-xl p-6 flex flex-col relative border-t-4 border-t-blue-500/50">
        <h3 className="text-blue-200 font-bold flex items-center gap-2 mb-4">
          <Archive className="w-5 h-5" /> 暂存栈 (Stash Stack)
        </h3>
        
        <div className="flex-1 bg-slate-900/50 rounded-lg p-4 space-y-2 flex flex-col-reverse justify-end overflow-y-auto relative">
           {/* Visual Depth Effect */}
           <div className="absolute inset-0 pointer-events-none shadow-[inset_0_-20px_20px_rgba(0,0,0,0.5)]"></div>
           
           {stashStack.map((stackItem, i) => (
             <div key={i} className="bg-slate-800 p-3 rounded border-b-4 border-slate-950 text-sm text-slate-400 shadow-lg transform transition-all hover:scale-105 cursor-pointer relative group">
               <div className="flex items-center gap-2">
                 <Package className="w-4 h-4 text-blue-400" />
                 <span className="font-mono text-xs">stash@&#123;{i}&#125;</span>
               </div>
               <div className="text-xs text-slate-500 mt-1 pl-6">
                 Contains {stackItem.length} changes...
               </div>
             </div>
           ))}

           {stashStack.length === 0 && (
             <div className="h-full flex items-center justify-center text-slate-600 italic">
               栈是空的 (Stack Empty)
             </div>
           )}
        </div>

        <div className="mt-4 flex justify-center">
            <Button onClick={handlePop} disabled={stashStack.length === 0} variant="secondary" className="w-full">
              <ArrowUp className="w-4 h-4" /> 弹出 (git stash pop)
            </Button>
        </div>
      </div>

      {/* Explanation */}
      <div className="absolute bottom-0 w-full text-center text-sm text-slate-500 max-w-xl pb-4">
        交互解析：Stash 是一个「后进先出」（LIFO）的栈结构。
        它就像把你桌面上杂乱的文件一把扫进抽屉里，给你一张干净的桌子去处理紧急事务。
        处理完后，再从抽屉里把文件拿出来继续工作。
      </div>

    </div>
  );
};