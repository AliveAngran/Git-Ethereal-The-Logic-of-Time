import React, { useState } from 'react';
import { GitFile } from '../../types';
import { History, Eye, RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

export const TimeTravelModule: React.FC = () => {
  const [headPosition, setHeadPosition] = useState<number>(2); // Index of commits
  
  const commits = [
    { id: 'c1', msg: 'init', files: [{ name: 'a.txt', content: 'v1' }] },
    { id: 'c2', msg: 'add feature', files: [{ name: 'a.txt', content: 'v1' }, { name: 'b.txt', content: 'feat' }] },
    { id: 'c3', msg: 'fix bug', files: [{ name: 'a.txt', content: 'v2' }, { name: 'b.txt', content: 'feat' }] },
  ];

  const currentFiles = commits[headPosition].files;
  const isDetached = headPosition !== 2;

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Timeline Visualization */}
        <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center relative min-h-[300px]">
           <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-800 rounded"></div>
           
           <div className="flex flex-col gap-12 w-full pl-16 relative">
             {commits.map((c, idx) => (
               <div key={c.id} className="relative group">
                 {/* Node */}
                 <button 
                    onClick={() => setHeadPosition(idx)}
                    className={`absolute -left-[45px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 transition-all z-10
                        ${idx === headPosition ? 'bg-white border-purple-500 scale-125 shadow-[0_0_15px_#a855f7]' : 'bg-slate-900 border-slate-600 hover:border-slate-400'}
                    `}
                 />
                 
                 {/* HEAD Tag */}
                 {idx === headPosition && (
                     <div className="absolute -left-[120px] top-1/2 -translate-y-1/2 flex items-center gap-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold animate-fade-in-right">
                         <span>HEAD</span>
                         <Eye className="w-3 h-3" />
                     </div>
                 )}

                 {/* Branch Tag (Only at top) */}
                 {idx === 2 && (
                    <div className={`absolute -left-[45px] top-[-25px] text-[10px] text-blue-400 font-mono transition-opacity ${isDetached ? 'opacity-50' : 'opacity-100 font-bold'}`}>
                        main
                    </div>
                 )}

                 <div className="p-3 bg-slate-800/50 rounded border border-white/5 flex flex-col">
                    <span className="font-mono text-xs text-slate-500">{c.id}</span>
                    <span className="text-sm font-medium text-slate-200">{c.msg}</span>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Working Directory Effect */}
        <div className="flex flex-col gap-4">
            <div className={`glass-panel p-6 rounded-xl border-t-4 transition-colors duration-500 ${isDetached ? 'border-t-yellow-500' : 'border-t-green-500'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                        {isDetached ? <AlertTriangle className="text-yellow-500 w-5 h-5" /> : <History className="text-green-500 w-5 h-5" />}
                        当前状态 (Current State)
                    </h3>
                    {isDetached && <span className="text-xs bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded border border-yellow-500/30">Detached HEAD</span>}
                </div>
                
                <div className="space-y-3">
                    <p className="text-sm text-slate-400 mb-4">
                        当你移动左侧的 HEAD 指针时，你的硬盘上的文件内容会**瞬间**变成这样：
                    </p>
                    {currentFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-950 rounded border border-slate-800 animate-fade-in">
                            <div className="w-8 h-10 bg-slate-800 rounded flex items-center justify-center text-[10px] font-mono text-slate-500">FILE</div>
                            <div>
                                <div className="text-sm font-mono text-white">{f.name}</div>
                                <div className="text-xs text-slate-500 font-mono mt-1">Content: "{f.content}"</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-lg text-sm text-slate-400">
                {isDetached ? (
                    <p>
                        <strong className="text-yellow-400">警告：游离状态 (Detached HEAD)</strong><br/>
                        HEAD 现在直接指向了一个具体的 Commit，而不是指向 "main" 分支。
                        如果你现在提交代码，新提交将**不属于**任何分支。当你切回 main 时，这些新提交可能会丢失（被垃圾回收）。
                        <br/>
                        <button onClick={() => setHeadPosition(2)} className="mt-2 text-blue-400 hover:text-blue-300 underline">
                            点击这里切回 main (git checkout main)
                        </button>
                    </p>
                ) : (
                    <p>
                        <strong className="text-green-400">正常状态</strong><br/>
                        HEAD 指向 main，main 指向 C3。你的任何新提交都会带着 main 指针一起向前移动。
                    </p>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};