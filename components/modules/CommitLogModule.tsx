import React, { useState } from 'react';
import { Commit, GitFile } from '../../types';
import { FileText, GitCommit, ArrowDown } from 'lucide-react';

const MOCK_FILES_V1: GitFile[] = [
  { name: 'hero.tsx', content: '<h1>Hello</h1>', status: 'unmodified', color: 'text-blue-400' },
  { name: 'style.css', content: 'body { bg: white }', status: 'unmodified', color: 'text-pink-400' }
];

const MOCK_FILES_V2: GitFile[] = [
  { name: 'hero.tsx', content: '<h1>Welcome</h1>', status: 'modified', color: 'text-blue-400' },
  { name: 'style.css', content: 'body { bg: black }', status: 'modified', color: 'text-pink-400' },
  { name: 'utils.ts', content: 'export const x = 1;', status: 'staged', color: 'text-yellow-400' }
];

export const CommitLogModule: React.FC = () => {
  const [selectedCommit, setSelectedCommit] = useState<string>('c2');

  const commits: Commit[] = [
    { id: 'c3', message: 'feat: dark mode', parentId: 'c2', timestamp: 1715000000, files: MOCK_FILES_V2 },
    { id: 'c2', message: 'init project', parentId: 'c1', timestamp: 1714000000, files: MOCK_FILES_V1 },
    { id: 'c1', message: 'initial commit', parentId: null, timestamp: 1713000000, files: [] },
  ];

  const activeCommit = commits.find(c => c.id === selectedCommit) || commits[0];

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 h-[500px]">
      {/* Visual Chain */}
      <div className="flex-1 flex flex-col items-center gap-4 py-8 overflow-y-auto">
        {commits.map((commit, index) => (
          <React.Fragment key={commit.id}>
            <button
              onClick={() => setSelectedCommit(commit.id)}
              className={`relative group w-64 p-4 rounded-xl border transition-all duration-300 text-left ${
                selectedCommit === commit.id 
                  ? 'bg-purple-500/20 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                  : 'bg-slate-900 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-mono text-xs px-2 py-0.5 rounded ${selectedCommit === commit.id ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {commit.id}
                </span>
                <span className="text-[10px] text-slate-500">{new Date(commit.timestamp * 1000).toLocaleDateString()}</span>
              </div>
              <div className="font-bold text-sm text-slate-200">{commit.message}</div>
              {commit.parentId && (
                <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  parent: <span className="text-blue-400 underline">{commit.parentId}</span>
                </div>
              )}
            </button>
            {index < commits.length - 1 && (
              <ArrowDown className="text-slate-600 animate-bounce" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Anatomy Viewer */}
      <div className="flex-1 glass-panel rounded-xl p-6 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 p-20 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
          <GitCommit className="text-purple-400" />
          快照解剖 (Snapshot Anatomy)
        </h3>

        <div className="space-y-6">
          <div className="bg-slate-950/50 p-4 rounded-lg border border-white/5">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Metadata</div>
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <span className="text-slate-500 block">Tree Hash</span>
                <span className="text-yellow-200">a1b2c3d4...</span>
              </div>
              <div>
                <span className="text-slate-500 block">Parent</span>
                <span className="text-blue-400">{activeCommit.parentId || 'NULL'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Author</span>
                <span className="text-green-200">Student &lt;me@uni.edu&gt;</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Saved Files (Snapshot)</div>
            <div className="space-y-2">
              {activeCommit.files.length > 0 ? activeCommit.files.map(file => (
                <div key={file.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-white/5">
                  <div className="flex items-center gap-3">
                    <FileText className={`w-4 h-4 ${file.color}`} />
                    <span className="text-sm font-mono text-slate-300">{file.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">blob: {file.content.length * 3} bytes</span>
                </div>
              )) : (
                <div className="text-center text-slate-600 italic py-4">Initial commit (Empty)</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-6 text-sm text-slate-400 leading-relaxed border-t border-white/5">
          <strong className="text-purple-400">核心逻辑：</strong> 
          当你切换到 Commit <code>{activeCommit.id}</code> 时，Git 其实是把右侧列出的这些文件快照，完整地恢复到了你的工作区。
          Git 就像一个永远不会覆盖旧文件的文件系统。
        </div>
      </div>
    </div>
  );
};