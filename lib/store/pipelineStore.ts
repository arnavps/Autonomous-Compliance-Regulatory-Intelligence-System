import { create } from 'zustand';

export type StepStatus = 'WAITING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface PipelineStep {
  id: string;
  label: string;
  status: StepStatus;
  output?: string;
  elapsed?: string;
}

export interface PipelineLog {
  timestamp: string;
  agent: string;
  message: string;
}

interface PipelineState {
  isActive: boolean;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  currentStepIndex: number;
  steps: PipelineStep[];
  logs: PipelineLog[];
  
  // Actions
  startIngestionPipeline: (title: string) => void;
  advanceStep: () => void;
  addLog: (agent: string, message: string) => void;
  completePipeline: () => void;
  failPipeline: (error: string) => void;
  resetPipeline: () => void;
}

const INGESTION_STEPS: PipelineStep[] = [
  { id: 'monitor', label: 'Monitor Agent', status: 'WAITING' },
  { id: 'parse', label: 'Parse Agent', status: 'WAITING' },
  { id: 'chunk', label: 'Chunk Agent', status: 'WAITING' },
  { id: 'embed', label: 'Embed Agent', status: 'WAITING' },
  { id: 'ingest', label: 'Ingest Agent', status: 'WAITING' },
  { id: 'diff', label: 'Diff Agent', status: 'WAITING' },
  { id: 'conflict', label: 'Conflict Agent', status: 'WAITING' },
  { id: 'impact', label: 'Impact Mapper', status: 'WAITING' },
  { id: 'report', label: 'Report Agent', status: 'WAITING' },
];

export const usePipelineStore = create<PipelineState>((set, get) => ({
  isActive: false,
  status: 'IDLE',
  currentStepIndex: -1,
  steps: [],
  logs: [],

  startIngestionPipeline: (title) => {
    set({
      isActive: true,
      status: 'RUNNING',
      currentStepIndex: 0,
      steps: INGESTION_STEPS.map((s, i) => ({ ...s, status: i === 0 ? 'RUNNING' : 'WAITING' })),
      logs: [{ 
        timestamp: new Date().toLocaleTimeString('en-GB'), 
        agent: 'System', 
        message: `Orchestration engaged: ${title}` 
      }],
    });
  },

  advanceStep: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex >= steps.length - 1) {
      get().completePipeline();
      return;
    }

    const nextIndex = currentStepIndex + 1;
    const newSteps = steps.map((s, i) => {
      if (i < nextIndex) return { ...s, status: 'COMPLETED' as StepStatus };
      if (i === nextIndex) return { ...s, status: 'RUNNING' as StepStatus };
      return s;
    });

    set({ 
      currentStepIndex: nextIndex, 
      steps: newSteps 
    });
  },

  addLog: (agent, message) => {
    set((state) => ({
      logs: [
        ...state.logs,
        { timestamp: new Date().toLocaleTimeString('en-GB'), agent, message }
      ].slice(-50) // Keep last 50 logs
    }));
  },

  completePipeline: () => {
    set((state) => ({
      status: 'COMPLETED',
      steps: state.steps.map(s => ({ ...s, status: 'COMPLETED' })),
      isActive: true // Keep it showing but marked as done
    }));
  },

  failPipeline: (error) => {
    set((state) => ({
      status: 'FAILED',
      isActive: true,
      logs: [...state.logs, { 
        timestamp: new Date().toLocaleTimeString('en-GB'), 
        agent: 'Error', 
        message: error 
      }]
    }));
  },

  resetPipeline: () => {
    set({
      isActive: false,
      status: 'IDLE',
      currentStepIndex: -1,
      steps: [],
      logs: [],
    });
  }
}));
