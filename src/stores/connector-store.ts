import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { api } from '@/lib/api-client';
import { Connector } from '@shared/types';
import { toast } from 'sonner';
type State = {
  connectors: Connector[];
  selectedConnector: Partial<Connector> | null;
  isDeleteDialogOpen: boolean;
  isLoading: boolean;
  error: string | null;
};
type Actions = {
  fetchConnectors: () => Promise<void>;
  addConnector: (connector: Omit<Connector, 'id' | 'status' | 'starts' | 'stops' | 'submit_sm_throughput'>) => Promise<void>;
  updateConnector: (connector: Connector) => Promise<void>;
  deleteConnector: (id: string) => Promise<void>;
  setSelectedConnector: (connector: Partial<Connector> | null) => void;
  setDeleteDialogOpen: (isOpen: boolean) => void;
};
export const useConnectorStore = create<State & Actions>()(
  immer((set) => ({
    connectors: [],
    selectedConnector: null,
    isDeleteDialogOpen: false,
    isLoading: false,
    error: null,
    fetchConnectors: async () => {
      set({ isLoading: true, error: null });
      try {
        const data = await api<{ items: Connector[] }>('/api/connectors');
        set({ connectors: data.items, isLoading: false });
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to fetch connectors';
        set({ error, isLoading: false });
        toast.error(error);
      }
    },
    addConnector: async (connector) => {
      set({ isLoading: true, error: null });
      try {
        const newConnector = await api<Connector>('/api/connectors', {
          method: 'POST',
          body: JSON.stringify(connector),
        });
        set((state) => {
          state.connectors.push(newConnector);
        });
        toast.success(`Connector "${newConnector.cid}" created successfully.`);
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to add connector';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    updateConnector: async (connector) => {
      set({ isLoading: true, error: null });
      try {
        const updatedConnector = await api<Connector>(`/api/connectors/${connector.id}`, {
          method: 'PUT',
          body: JSON.stringify(connector),
        });
        set((state) => {
          const index = state.connectors.findIndex((c) => c.id === connector.id);
          if (index !== -1) {
            state.connectors[index] = updatedConnector;
          }
        });
        toast.success(`Connector "${updatedConnector.cid}" updated successfully.`);
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to update connector';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    deleteConnector: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        await api(`/api/connectors/${id}`, { method: 'DELETE' });
        set((state) => {
          state.connectors = state.connectors.filter((c) => c.id !== id);
        });
        toast.success('Connector deleted successfully.');
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to delete connector';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    setSelectedConnector: (connector) => {
      set({ selectedConnector: connector });
    },
    setDeleteDialogOpen: (isOpen) => {
      set({ isDeleteDialogOpen: isOpen });
    },
  }))
);