import React, { useState } from 'react';
import { GitFile } from '../../types';
import { ArrowRight, Save, FileCode, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const ThreeStatesModule: React.FC = () => {
  const [workingFiles, setWorkingFiles] = useState<GitFile[]>([
    { name: 'index.ts', content: 'console.log("Hello")', status: 'modified', color: 'text-blue-400' },
    { name: 'style.css', content: 'body { bg: black }', status: 'modified', color: 'text-pink-400' },
    { name: 'README.md', content: '# Docs', status: 'unmodified', color: 'text-slate-400' },
  ]);
  const [stagedFiles, setStagedFiles] = useState<GitFile[]>([]);
  const [committedFiles, setCommittedFiles] = useState<GitFile[]>([]);
  const [history, setHistory] = useState<number>(0);

  const stageFile = (file: GitFile) => {
    if (file.status === 'unmodified') return;
    setWorkingFiles(prev => prev.filter(f => f.name !== file.name));
    setStagedFiles(prev => [...prev, { ...file, status: 'staged' }]);
  };

  const unstageFile = (file: GitFile) => {
    setStagedFiles(prev => prev.filter(f => f.name !== file.name));
    setWorkingFiles(prev => [...prev, { ...file, status: 'modified' }]);
  };

  const commit = () => {
    if (stagedFiles.length === 0) return;
    setCommittedFiles(prev => [...stagedFiles, ...prev]); // Add to repo
    setStagedFiles([]);
    setHistory(h => h + 1);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full min-h-[400px]">
        
        {/* Working Directory */}
        <div className="glass-panel rounded-xl p-4 flex flex-col gap-4 border-t-4 border-t-red-500/50">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h3 className="font-semibold text-red-200">工作区 (Working)</h3>
            <span className="text-xs text-slate-500 font-mono">Unstaged</span>
          </div>
          <div className="flex-1 space-y-3">
            {workingFiles.map((file) => (
              <div 
                key={file.name}
                onClick={() => stageFile(file)}
                className={`p-3 bg-slate-900/50 rounded-lg border border-slate-700 cursor-pointer hover:border-red-400 hover:bg-slate-800 transition-all group relative ${file.status === 'unmodified' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <FileCode className={`w-5 h-5 ${file.color}`} />
                  <span className="font-mono text-sm">{file.name}</span>
                </div>
                {file.status !== 'unmodified' && (
                  <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 text-xs text-red-400 font-bold transition-opacity">
                    CLICK TO STAGE →
                  </div>
                )}
              </div>
            ))}
            {workingFiles.length === 0 && <div className="text-center text-slate-600 py-10 italic">工作区很干净</div>}
          </div>
        </div>

        {/* Staging Area */}
        <div className="glass-panel rounded-xl p-4 flex flex-col gap-4 border-t-4 border-t-green-500/50 relative overflow-hidden">
          {stagedFiles.length > 0 && <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 blur-2xl rounded-full pointer-events-none"></div>}
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h3 className="font-semibold text-green-200">暂存区 (Index)</h3>
            <span className="text-xs text-slate-500 font-mono">Staged</span>
          </div>
          <div className="flex-1 space-y-3">
            {stagedFiles.map((file) => (
              <div 
                key={file.name}
                onClick={() => unstageFile(file)}
                className="p-3 bg-slate-900/50 rounded-lg border border-green-500/30 cursor-pointer hover:border-red-400 hover:bg-slate-800 transition-all flex justify-between items-center group"
              >
                <div className="flex items-center gap-3">
                  <FileCode className={`w-5 h-5 ${file.color}`} />
                  <span className="font-mono text-sm text-green-100">{file.name}</span>
                </div>
                 <div className="opacity-0 group-hover:opacity-100 text-xs text-slate-400 transition-opacity">
                    ← UNSTAGE
                  </div>
              </div>
            ))}
            {stagedFiles.length === 0 && <div className="text-center text-slate-600 py-10 italic">暂存区是空的<br/><span className="text-xs">先从左侧选择文件</span></div>}
          </div>
          <Button 
            onClick={commit} 
            disabled={stagedFiles.length === 0}
            className={`w-full ${stagedFiles.length > 0 ? 'bg-green-600/20 text-green-300 hover:bg-green-600/30' : ''}`}
          >
            <Save className="w-4 h-4" /> 生成快照 (Commit)
          </Button>
        </div>

        {/* Repository */}
        <div className="glass-panel rounded-xl p-4 flex flex-col gap-4 border-t-4 border-t-purple-500/50">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h3 className="font-semibold text-purple-200">仓库 (Repository)</h3>
            <span className="text-xs text-slate-500 font-mono">.git directory</span>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px]">
            {Array.from({ length: history }).map((_, i) => (
              <div key={i} className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/20 flex items-center gap-3 animate-fade-in-up">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <div className="flex-1">
                  <div className="text-xs text-purple-300 font-mono">Commit {String(Math.random()).substring(2, 9)}</div>
                  <div className="text-[10px] text-slate-400">Saved {committedFiles.length} files objects</div>
                </div>
              </div>
            ))}
             {history === 0 && <div className="text-center text-slate-600 py-10 italic">还没有提交历史</div>}
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-400 text-center">
        <strong className="text-green-400">交互解析：</strong> 
        很多人提交代码只用 <code>git commit -a</code>，却忽略了「暂存区」的优雅。
        暂存区允许你精挑细选（Pick）。你可以改了10个文件，但只把关于 "Fix Bug" 的3个文件放入暂存区打包提交。
        这让提交历史变得原子化且清晰。
      </div>
    </div>
  );
};