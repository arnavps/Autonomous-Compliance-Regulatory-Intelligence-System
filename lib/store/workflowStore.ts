import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Conflict {
  id: string;
  source: { id: string; title: string };
  target: { id: string; title: string };
  severity: 'High' | 'Medium' | 'Low';
  type: string;
  reasoning: string;
  status: 'Unresolved' | 'In Remediation' | 'Resolved';
}

export interface Amendment {
  id: string;
  conflictId: string;
  clause: string;
  oldText: string;
  newText: string;
  status: 'Proposed' | 'Approved';
  reason: string;
}

interface WorkflowState {
  conflicts: Conflict[];
  amendments: Amendment[];
  riskScores: Record<string, number>;
  
  // Actions
  addConflictToWorkbench: (conflict: Conflict) => void;
  approveAmendment: (amendmentId: string) => void;
  revertAll: () => void;
  initializeScores: () => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set) => ({
      conflicts: [],
      amendments: [],
      riskScores: {
        'IN-Digital Lending': 88,
        'EU-Data Privacy': 92,
        'US-Securities': 65,
      },

      initializeScores: () => set((state) => ({
        riskScores: {
          'IN-Digital Lending': 88,
          'EU-Data Privacy': 92,
          'US-Securities': 65,
        }
      })),

      addConflictToWorkbench: (conflict) => set((state) => {
        // Prevent duplicates
        if (state.amendments.find(a => a.conflictId === conflict.id)) return state;

        const newAmendment: Amendment = {
          id: `AMD-${Math.floor(Math.random() * 9000) + 1000}`,
          conflictId: conflict.id,
          clause: `Section 4.2: ${conflict.type}`,
          oldText: "Original institutional mandate text as per old policy...",
          newText: `Adjusted mandate to comply with ${conflict.source.id} directive regarding ${conflict.type}.`,
          status: 'Proposed',
          reason: conflict.reasoning
        };

        return {
          amendments: [newAmendment, ...state.amendments],
          conflicts: state.conflicts.map(c => 
            c.id === conflict.id ? { ...c, status: 'In Remediation' } : c
          )
        };
      }),

      approveAmendment: (amendmentId) => set((state) => {
        const amendment = state.amendments.find(a => a.id === amendmentId);
        if (!amendment) return state;

        // If it's a Digital Lending amendment, reduce the risk score
        const newScores = { ...state.riskScores };
        if (amendment.clause.includes('Digital Lending') || amendment.reason.includes('Lending')) {
          newScores['IN-Digital Lending'] = 12; // Risk significantly dropped
        }

        return {
          amendments: state.amendments.map(a => 
            a.id === amendmentId ? { ...a, status: 'Approved' } : a
          ),
          riskScores: newScores
        };
      }),

      revertAll: () => set({
        amendments: [],
        conflicts: [],
        riskScores: {
          'IN-Digital Lending': 88,
          'EU-Data Privacy': 92,
          'US-Securities': 65,
        }
      })
    }),
    {
      name: 'acris-workflow-storage',
    }
  )
);
