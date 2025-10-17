
export interface Tutorial {
  id: string;
  title: string;
  roleTags: string[];
  topicTags: string[];
  duration: string;
  videoProvider: 'youtube' | 'vimeo' | 'storage';
  videoIdOrPath: string;
  description: string;
  transcript?: string;
  createdAt: string; // Using string for simplicity, can be Date object
  published: boolean;
}

export interface ExportFile {
  id: string;
  orgId: string;
  type: "Night Report" | "Day Report" | "nightly-rotation" | "tips";
  createdAt: Date;
  createdBy: string;
  filePath: string;
  rowCount: number;
  watermarkApplied: boolean;
  sha256?: string;
  downloadCount: number;
  lastDownloadedAt?: Date;
}
