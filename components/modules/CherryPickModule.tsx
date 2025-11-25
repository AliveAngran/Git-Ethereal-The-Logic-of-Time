
import React, { useState } from 'react';
import { Commit } from '../../types';
import { GitCommit, Copy, ArrowRight, GitBranch } from 'lucide-react';
import { simpleHash, shortHash } from '../../services/hashUtils';

interface VisualCommit extends Commit {
  isPicked?: boolean;
}

export const CherryPickModule: React.FC = () => {
  const [mainCommits, setMainCommits] = useState<VisualCommit[]>([
    { id: 'c1', message: 'init', parentId: null, timestamp: 1, files: [] },
    { id: 'c2', message: 'base setup', parentId: 'c1', timestamp: 2, files: [] },
  ]);

  const [featureCommits, setFeatureCommits] = useState<VisualCommit[]>([
    { id: 'f1', message: 'login page', parentId: 'c1', timestamp: 3, files: [], branch: 'feat' },
    { id: 'f2', message: 'optimize db', parentId: 'f1', timestamp: 4, files: [], branch: 'feat' },
    { id: 'f3', message: 'fix login', parentId: 'f2', timestamp: 5, files: [], branch: 'feat' },
  ]);

  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const handleCherryPick = (commit: VisualCommit) => {
    if (animatingId) return;
    setAnimatingId(commit.id);

    // 1. Animation Delay
    setTimeout(() => {
      // 2. Create new commit on Main
      const newHash = simpleHash(commit.message + Date.now());
      const newCommit: VisualCommit = {
        ...commit,
        id: shortHash(newHash), // New ID!
        parentId: mainCommits[mainCommits.length - 1].id,
        isPicked: true,
        branch: 'main'
      };
      
      setMainCommits(prev => [...prev, newCommit]);
      setAnimatingId(null);
    }, 1000);
  };

  return (
    <div className="w-full flex flex-col gap-10 items-center justify-center min-h-[400px]">
      
      {/* Branches Container */}
      <div className="relative w-full max-w-3xl flex flex-col gap-16">
        
        {/* Feature Branch (Source) */}
        <div className="relative flex items-center gap-4">
           <div className="w-24 text-right text-purple-400 font-bold font-mono text-xs flex items-center justify-end gap-2">
             <GitBranch className="w-4 h-4" /> feature
           </div>
           <div className="flex-1 flex items-center relative">
             <div className="absolute top-1/2 left-0 w-full h-1 bg-purple-500/20 rounded"></div>
             {/* Connection to Main (Visual) */}
             <div className="absolute top-1/2 left-0 w-8 h-20 border-l-2 border-t-2 border-slate-700 rounded-tl-xl -translate-y-full transform origin-bottom-left -skew-x-12 opacity-50"></div>
             
             {featureCommits.map((c, i) => (
               <div key={c.id} className="relative z-10 group ml-12 first:ml-12">
                 <button
                   onClick={() => handleCherryPick(c)}
                   className={`w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-mono transition-all duration-300 relative
                     ${animatingId === c.id ? 'scale-125 bg-white text-black shadow-[0_0_20px_white]' : 'bg-purple-600 text-white hover:scale-110 hover:bg-purple-500'}
                   `}
                 >
                   {c.id.substring(0,2)}
                   {/* Hover Tooltip */}
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-600">
                      Cherry-pick this
                   </div>
                 </button>
                 <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 w-20 text-center">{c.message}</div>
                 
                 {/* Flying Particle Animation */}
                 {animatingId === c.id && (
                    <div className="absolute top-0 left-0 w-10 h-10 bg-white rounded-full animate-cherry-pick z-50 pointer-events-none flex items-center justify-center text-black font-bold text-xs opacity-80">
                      <Copy className="w-4 h-4" />
                    </div>
                 )}
               </div>
             ))}
           </div>
        </div>

        {/* Main Branch (Target) */}
        <div className="relative flex items-center gap-4">
           <div className="w-24 text-right text-blue-400 font-bold font-mono text-xs flex items-center justify-end gap-2">
             <GitBranch className="w-4 h-4" /> main
           </div>
           <div className="flex-1 flex items-center relative">
             <div className="absolute top-1/2 left-0 w-full h-1 bg-blue-500/20 rounded"></div>
             
             {mainCommits.map((c, i) => (
               <div key={c.id} className={`relative z-10 ml-12 first:ml-0 ${c.isPicked ? 'animate-fade-in-down' : ''}`}>
                 <div className={`w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-mono
                    ${c.isPicked ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-blue-600 text-white'}
                 `}>
                   {c.id.substring(0,2)}
                 </div>
                 <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 w-20 text-center">{c.message}</div>
                 {c.isPicked && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-green-400 font-mono">COPIED</div>}
               </div>
             ))}

             {/* HEAD Indicator */}
             <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] transition-all duration-500"
                  style={{ left: `${(mainCommits.length - 1) * 3.5 + 2.5}rem` }}></div>
           </div>
        </div>

      </div>

      <div className="glass-panel p-6 rounded-xl max-w-2xl border-l-4 border-l-purple-500">
        <h4 className="text-purple-300 font-bold mb-2 flex items-center gap-2">
            <Copy className="w-4 h-4" /> 
            复制原理 (Copy Logic)
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed">
            注意看 Main 分支上新生成的节点。它的 <strong>Hash ID 变了</strong>。
            虽然内容和 Feature 分支上的原始节点一模一样，但因为它的父节点不同（Context 不同），所以它是一个全新的提交。
            Cherry-pick 本质上是「读取旧补丁 -> 应用到新分支 -> 生成新快照」的过程。
        </p>
      </div>

      <style>{`
        @keyframes cherry-pick {
          0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          50% { transform: translate(20px, 40px) scale(1.2); opacity: 1; }
          100% { transform: translate(0, 100px) scale(1); opacity: 0; }
        }
        .animate-cherry-pick {
          animation: cherry-pick 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};
