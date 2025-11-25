
export type GitFileStatus = 'unmodified' | 'modified' | 'staged';

export interface GitFile {
  name: string;
  content: string;
  status: GitFileStatus;
  color: string;
}

export interface Commit {
  id: string;
  message: string;
  parentId: string | null;
  secondParentId?: string | null; // For merge commits
  timestamp: number;
  files: GitFile[]; // Snapshot of files at this point
  branch?: string; // which branch created this
  isMerge?: boolean;
}

export interface Branch {
  name: string;
  commitId: string; // The commit HEAD is pointing to for this branch
  color: string;
}

export type ViewMode = 'intro' | 'hashing' | 'areas' | 'commits' | 'branches' | 'merging' | 'timetravel' | 'cherrypick' | 'rebase' | 'reset' | 'tags' | 'stash' | 'flow';

export interface LessonStep {
  title: string;
  description: string;
  interactionPrompt: string;
}