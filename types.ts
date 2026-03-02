
export enum PipelineStatus {
  PENDING = 'Pending',
  RUNNING = 'Running',
  COMPLETED = 'Completed',
  FAILED = 'Failed'
}

export type Species = 'Homo sapiens' | 'Mus musculus' | 'Rattus norvegicus' | 'Drosophila melanogaster';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: PipelineStatus;
  progress: number;
}

export interface Sample {
  id: string;
  name: string;
  size: string;
  type: 'FASTQ' | 'BAM' | 'VCF';
  uploadDate: string;
}

export interface AnalysisResult {
  id: string;
  type: 'RNA-Seq' | 'WES' | 'SingleCell';
  summary: string;
  charts: {
    volcano?: any[];
    enrichment?: any[];
    heatmap?: any[];
  };
}
