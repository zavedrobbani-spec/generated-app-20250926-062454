import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { api } from '@/lib/api-client';
import { JasminUser, Group } from '@shared/types';
import { toast } from 'sonner';
type UserManagementState = {
  users: JasminUser[];
  groups: Group[];
  selectedUser: Partial<JasminUser> | null;
  selectedGroup: Partial<Group> | null;
  isUserDeleteDialogOpen: boolean;
  isGroupDeleteDialogOpen: boolean;
  isLoading: boolean;
  error: string | null;
};
type UserManagementActions = {
  fetchUsersAndGroups: () => Promise<void>;
  // User actions
  addUser: (user: Omit<JasminUser, 'uid' | 'id'>) => Promise<void>;
  updateUser: (user: JasminUser) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
  setSelectedUser: (user: Partial<JasminUser> | null) => void;
  setUserDeleteDialogOpen: (isOpen: boolean) => void;
  // Group actions
  addGroup: (group: Omit<Group, 'id'>) => Promise<void>;
  updateGroup: (group: Group) => Promise<void>;
  deleteGroup: (gid: string) => Promise<void>;
  setSelectedGroup: (group: Partial<Group> | null) => void;
  setGroupDeleteDialogOpen: (isOpen: boolean) => void;
};
export const useUserStore = create<UserManagementState & UserManagementActions>()(
  immer((set, get) => ({
    users: [],
    groups: [],
    selectedUser: null,
    selectedGroup: null,
    isUserDeleteDialogOpen: false,
    isGroupDeleteDialogOpen: false,
    isLoading: false,
    error: null,
    fetchUsersAndGroups: async () => {
      if (get().users.length > 0 && get().groups.length > 0) return;
      set({ isLoading: true, error: null });
      try {
        const [usersRes, groupsRes] = await Promise.all([
          api<{ items: JasminUser[] }>('/api/jasmin-users'),
          api<{ items: Group[] }>('/api/groups'),
        ]);
        set({ users: usersRes.items, groups: groupsRes.items, isLoading: false });
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to fetch data';
        set({ error, isLoading: false });
      }
    },
    // User actions
    addUser: async (user) => {
      set({ isLoading: true });
      try {
        const newUser = await api<JasminUser>('/api/jasmin-users', { method: 'POST', body: JSON.stringify(user) });
        set((state) => {
          state.users.push(newUser);
        });
        toast.success(`User "${newUser.username}" created successfully.`);
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to add user';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    updateUser: async (user) => {
      set({ isLoading: true });
      try {
        const updatedUser = await api<JasminUser>(`/api/jasmin-users/${user.uid}`, { method: 'PUT', body: JSON.stringify(user) });
        set((state) => {
          const index = state.users.findIndex((u) => u.uid === user.uid);
          if (index !== -1) state.users[index] = updatedUser;
        });
        toast.success(`User "${updatedUser.username}" updated successfully.`);
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to update user';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    deleteUser: async (uid) => {
      set({ isLoading: true });
      try {
        await api(`/api/jasmin-users/${uid}`, { method: 'DELETE' });
        set((state) => {
          state.users = state.users.filter((u) => u.uid !== uid);
        });
        toast.success('User deleted successfully.');
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to delete user';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    setSelectedUser: (user) => set({ selectedUser: user }),
    setUserDeleteDialogOpen: (isOpen) => set({ isUserDeleteDialogOpen: isOpen }),
    // Group actions
    addGroup: async (group) => {
      set({ isLoading: true });
      try {
        const newGroup = await api<Group>('/api/groups', { method: 'POST', body: JSON.stringify(group) });
        set((state) => {
          state.groups.push(newGroup);
        });
        toast.success(`Group "${newGroup.gid}" created successfully.`);
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to add group';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    updateGroup: async (group) => {
      set({ isLoading: true });
      try {
        const updatedGroup = await api<Group>(`/api/groups/${group.gid}`, { method: 'PUT', body: JSON.stringify(group) });
        set((state) => {
          const index = state.groups.findIndex((g) => g.gid === group.gid);
          if (index !== -1) state.groups[index] = updatedGroup;
        });
        toast.success(`Group "${updatedGroup.gid}" updated successfully.`);
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to update group';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    deleteGroup: async (gid) => {
      set({ isLoading: true });
      try {
        await api(`/api/groups/${gid}`, { method: 'DELETE' });
        set((state) => {
          state.groups = state.groups.filter((g) => g.gid !== gid);
        });
        toast.success('Group deleted successfully.');
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to delete group';
        set({ error });
        toast.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    setSelectedGroup: (group) => set({ selectedGroup: group }),
    setGroupDeleteDialogOpen: (isOpen) => set({ isGroupDeleteDialogOpen: isOpen }),
  }))
);