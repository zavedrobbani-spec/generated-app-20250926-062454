import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { api } from '@/lib/api-client';
import { Route } from '@shared/types';
import { toast } from 'sonner';
type State = {
  routes: Route[];
  selectedRoute: Partial<Route> | null;
  isDeleteDialogOpen: boolean;
  isLoading: boolean;
  error: string | null;
};
type Actions = {
  fetchRoutes: () => Promise<void>;
  addRoute: (route: Omit<Route, 'id'>) => Promise<void>;
  updateRoute: (route: Route) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;
  setSelectedRoute: (route: Partial<Route> | null) => void;
  setDeleteDialogOpen: (isOpen: boolean) => void;
};
export const useRoutingStore = create<State & Actions>()(
  immer((set) => ({
    routes: [],
    selectedRoute: null,
    isDeleteDialogOpen: false,
    isLoading: false,
    error: null,
    fetchRoutes: async () => {
      set({ isLoading: true, error: null });
      try {
        const data = await api<{ items: Route[] }>('/api/routes');
        set({ routes: data.items, isLoading: false });
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to fetch routes';
        set({ error, isLoading: false });
        toast.error(error);
      }
    },
    addRoute: async (route) => {
      set({ isLoading: true, error: null });
      try {
        const newRoute = await api<Route>('/api/routes', {
          method: 'POST',
          body: JSON.stringify(route),
        });
        set((state) => {
          state.routes.push(newRoute);
        });
        toast.success(`Route order #${newRoute.order} created successfully.`);
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to add route';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    updateRoute: async (route) => {
      set({ isLoading: true, error: null });
      try {
        const updatedRoute = await api<Route>(`/api/routes/${route.id}`, {
          method: 'PUT',
          body: JSON.stringify(route),
        });
        set((state) => {
          const index = state.routes.findIndex((r) => r.id === route.id);
          if (index !== -1) {
            state.routes[index] = updatedRoute;
          }
        });
        toast.success(`Route order #${updatedRoute.order} updated successfully.`);
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to update route';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    deleteRoute: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        await api(`/api/routes/${id}`, { method: 'DELETE' });
        set((state) => {
          state.routes = state.routes.filter((r) => r.id !== id);
        });
        toast.success('Route deleted successfully.');
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to delete route';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    setSelectedRoute: (route) => {
      set({ selectedRoute: route });
    },
    setDeleteDialogOpen: (isOpen) => {
      set({ isDeleteDialogOpen: isOpen });
    },
  }))
);