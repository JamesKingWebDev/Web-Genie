
export enum JobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Dataset {
  id: string;
  name: string;
  organism: string;
  type: 'InSilico' | 'Experimental';
  geneCount: number;
  sampleCount: number;
  lastUpdated: string;
  source: 'beeline' | 'user';
}

export interface Algorithm {
  id: string;
  name: string;
  version: string;
  parameters: string[];
  description: string;
}

export interface RunMetrics {
  auroc: number;
  auprc: number;
  precision: number;
  recall: number;
  f1: number;
  runtimeSeconds: number;
}

export interface Run {
  id: string;
  datasetId: string;
  algorithmId: string;
  status: JobStatus;
  metrics?: RunMetrics;
  createdAt: string;
  completedAt?: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: string;
}

export interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
}
