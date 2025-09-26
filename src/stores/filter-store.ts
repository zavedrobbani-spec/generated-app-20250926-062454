import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { api } from '@/lib/api-client';
import { MessageFilter } from '@shared/types';
import { toast } from 'sonner';
type State = {
  filters: MessageFilter[];
  selectedFilter: Partial<MessageFilter> | null;
  isDeleteDialogOpen: boolean;
  isLoading: boolean;
  error: string | null;
};
type Actions = {
  fetchFilters: () => Promise<void>;
  addFilter: (filter: Omit<MessageFilter, 'id'>) => Promise<void>;
  updateFilter: (filter: MessageFilter) => Promise<void>;
  deleteFilter: (id: string) => Promise<void>;
  setSelectedFilter: (filter: Partial<MessageFilter> | null) => void;
  setDeleteDialogOpen: (isOpen: boolean) => void;
};
export const useFilterStore = create<State & Actions>()(
  immer((set) => ({
    filters: [],
    selectedFilter: null,
    isDeleteDialogOpen: false,
    isLoading: false,
    error: null,
    fetchFilters: async () => {
      set({ isLoading: true, error: null });
      try {
        const data = await api<{ items: MessageFilter[] }>('/api/filters');
        set({ filters: data.items, isLoading: false });
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to fetch filters';
        set({ error, isLoading: false });
        toast.error(error);
      }
    },
    addFilter: async (filter) => {
      set({ isLoading: true, error: null });
      try {
        const newFilter = await api<MessageFilter>('/api/filters', {
          method: 'POST',
          body: JSON.stringify(filter),
        });
        set((state) => {
          state.filters.push(newFilter);
        });
        toast.success(`Filter "${newFilter.fid}" created successfully.`);
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to add filter';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    updateFilter: async (filter) => {
      set({ isLoading: true, error: null });
      try {
        const updatedFilter = await api<MessageFilter>(`/api/filters/${filter.id}`, {
          method: 'PUT',
          body: JSON.stringify(filter),
        });
        set((state) => {
          const index = state.filters.findIndex((f) => f.id === filter.id);
          if (index !== -1) {
            state.filters[index] = updatedFilter;
          }
        });
        toast.success(`Filter "${updatedFilter.fid}" updated successfully.`);
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to update filter';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    deleteFilter: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        await api(`/api/filters/${id}`, { method: 'DELETE' });
        set((state) => {
          state.filters = state.filters.filter((f) => f.id !== id);
        });
        toast.success('Filter deleted successfully.');
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to delete filter';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    setSelectedFilter: (filter) => {
      set({ selectedFilter: filter });
    },
    setDeleteDialogOpen: (isOpen) => {
      set({ isDeleteDialogOpen: isOpen });
    },
  }))
);