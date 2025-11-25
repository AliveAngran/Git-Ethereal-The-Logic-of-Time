
import React, { useState } from 'react';
import { Tag, GitBranch, Anchor, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface CommitNode {
  id: string;
  msg: string;
  tags: string[];
}

export const TagsModule: React.FC = () => {
  const [commits, setCommits] = useState<CommitNode[]>([
    { id: 'c1', msg: 'initial', tags: [] },
    { id: 'c2', msg: 'add login', tags: [] },
    { id: 'c3', msg: 'fix styles', tags: [] },
    { id: 'c4', msg: 'final polish', tags: [] },
  ]);
  const [branchPos, setBranchPos] = useState(3); // Index of commit branch is pointing to
  
  const addTag = (index: number) => {
    const version = `v1.${Math.floor(Math.random() * 9)}`;
    if (commits[index].tags.includes(version)) return;
    
    const newCommits = [...commits];
    newCommits[index].tags = [...newCommits[index].tags, version];
    setCommits(newCommits);
  };

  const advanceBranch = () => {
    if (branchPos >= 6) return;
    
    const nextId = `c${commits.length + 1}`;
    setCommits([...commits, { id: nextId, msg: 'new work', tags: [] }]);
    setBranchPos(prev => prev + 1);
  };

  return (
    <div className="w-full flex flex-col gap-10 items-center justify-center min-h-[400px]">
      
      {/* Visual Timeline */}
      <div className="relative flex items-center gap-12 p-8">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 rounded"></div>
        
        {commits.map((c, i) => (
          <div key={c.id} className="relative group">
            
            {/* Commit Node */}
            <div className={`w-12 h-12 rounded-full border-4 border-slate-700 bg-slate-900 flex items-center justify-center font-mono text-xs z-10 relative
              ${i === branchPos ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : ''}
            `}>
              {c.id}
            </div>
            <div className="absolute -bottom-8 w-24 text-center -left-6 text-[10px] text-slate-500">{c.msg}</div>

            {/* Branch Pointer (Dynamic) */}
            {i === branchPos && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-300">
                <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1 mb-1">
                   <GitBranch className="w-3 h-3" /> main
                </div>
                <div className="w-0.5 h-4 bg-blue-500"></div>
              </div>
            )}

            {/* Tags (Static) */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col gap-1">
              {c.tags.map(tag => (
                <div key={tag} className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 animate-fade-in-up shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                  <Tag className="w-3 h-3" /> {tag}
                </div>
              ))}
            </div>

            {/* Add Tag Button */}
            <button 
              onClick={() => addTag(i)}
              className="absolute -top-4 -right-4 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-600 hover:text-white border border-slate-600"
              title="Add Tag"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-6">
        <Button onClick={advanceBranch}>
           模拟继续开发 (Commit)
        </Button>
      </div>

      {/* Explanation */}
      <div className="glass-panel p-6 rounded-xl max-w-2xl border-l-4 border-l-yellow-500">
         <h4 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
            <Anchor className="w-4 h-4" /> 
            分支 vs 标签 (Branch vs Tag)
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed">
            试着先给当前的 <code>c4</code> 打上一个 <code>v1.0</code> 的标签，然后点击「模拟继续开发」。
            <br/><br/>
            你会发现：<strong>Branch 指针随着新提交向前移动了，但 Tag 依然死死地钉在原来的位置。</strong>
            <br/>
            这就是它们的本质区别。分支是用来「写」的（动态），标签是用来「读」的（静态发布）。永远不要用分支来做版本归档，因为它们很不稳定。
        </p>
      </div>

    </div>
  );
};