import { useEffect } from 'react';
import { useUserStore } from '@/stores/user-store';
import { userColumns } from '@/components/users/user-columns';
import { groupColumns } from '@/components/users/group-columns';
import { DataTable } from '@/components/connectors/data-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UserForm } from '@/components/users/UserForm';
import { GroupForm } from '@/components/users/GroupForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-28" />
    </div>
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
);
export function UsersPage() {
  const {
    users,
    groups,
    isLoading,
    error,
    selectedUser,
    selectedGroup,
    isUserDeleteDialogOpen,
    isGroupDeleteDialogOpen,
    fetchUsersAndGroups,
    setSelectedUser,
    setSelectedGroup,
    deleteUser,
    deleteGroup,
    setUserDeleteDialogOpen,
    setGroupDeleteDialogOpen,
  } = useUserStore();
  useEffect(() => {
    fetchUsersAndGroups();
  }, [fetchUsersAndGroups]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  const handleUserDialogClose = () => setSelectedUser(null);
  const handleGroupDialogClose = () => setSelectedGroup(null);
  const handleDeleteUser = async () => {
    if (selectedUser?.uid) {
      await deleteUser(selectedUser.uid);
      setUserDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };
  const handleDeleteGroup = async () => {
    if (selectedGroup?.gid) {
      await deleteGroup(selectedGroup.gid);
      setGroupDeleteDialogOpen(false);
      setSelectedGroup(null);
    }
  };
  if (isLoading && users.length === 0 && groups.length === 0) {
    return <LoadingSkeleton />;
  }
  return (
    <div className="space-y-6">
      <Toaster richColors />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users & Groups</h2>
          <p className="text-muted-foreground">
            Manage your Jasmin users and groups.
          </p>
        </div>
      </div>
      <Tabs defaultValue="users">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="m-0">
            <Button onClick={() => setSelectedUser({})}>Add User</Button>
          </TabsContent>
          <TabsContent value="groups" className="m-0">
            <Button onClick={() => setSelectedGroup({})}>Add Group</Button>
          </TabsContent>
        </div>
        <TabsContent value="users">
          <DataTable columns={userColumns} data={users} />
        </TabsContent>
        <TabsContent value="groups">
          <DataTable columns={groupColumns} data={groups} />
        </TabsContent>
      </Tabs>
      {/* User Modals */}
      <Dialog open={!!selectedUser && !isUserDeleteDialogOpen} onOpenChange={(isOpen) => !isOpen && handleUserDialogClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedUser?.uid ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {selectedUser?.uid ? 'Modify the details of the existing user.' : 'Fill in the details to create a new user.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <UserForm user={selectedUser} onSuccess={handleUserDialogClose} />
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isUserDeleteDialogOpen} onOpenChange={setUserDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              <span className="font-bold"> {selectedUser?.username}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Group Modals */}
      <Dialog open={!!selectedGroup && !isGroupDeleteDialogOpen} onOpenChange={(isOpen) => !isOpen && handleGroupDialogClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedGroup?.gid ? 'Edit Group' : 'Add New Group'}</DialogTitle>
            <DialogDescription>
              {selectedGroup?.gid ? 'Modify the details of the existing group.' : 'Fill in the details to create a new group.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <GroupForm group={selectedGroup} onSuccess={handleGroupDialogClose} />
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isGroupDeleteDialogOpen} onOpenChange={setGroupDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the group
              <span className="font-bold"> {selectedGroup?.gid}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGroup} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}