import { useEffect } from 'react';
import { useRoutingStore } from '@/stores/routing-store';
import { routingColumns } from '@/components/routing/routing-columns';
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
import { RouteForm } from '@/components/routing/RouteForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from '@/components/ui/sonner';
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
export function RoutingPage() {
  const {
    routes,
    fetchRoutes,
    isLoading,
    error,
    selectedRoute,
    setSelectedRoute,
    isDeleteDialogOpen,
    setDeleteDialogOpen,
    deleteRoute,
  } = useRoutingStore();
  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  const handleDialogClose = () => {
    setSelectedRoute(null);
  };
  const handleDelete = async () => {
    if (selectedRoute?.id) {
      await deleteRoute(selectedRoute.id);
      setDeleteDialogOpen(false);
      setSelectedRoute(null);
    }
  };
  if (isLoading && routes.length === 0) {
    return <LoadingSkeleton />;
  }
  return (
    <div className="space-y-6">
      <Toaster richColors />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Routing</h2>
          <p className="text-muted-foreground">
            Manage your routing rules.
          </p>
        </div>
        <Button onClick={() => setSelectedRoute({})}>Add Route</Button>
      </div>
      <DataTable columns={routingColumns} data={routes} />
      <Dialog open={!!selectedRoute && !isDeleteDialogOpen} onOpenChange={(isOpen) => !isOpen && handleDialogClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedRoute?.id ? 'Edit Route' : 'Add New Route'}</DialogTitle>
            <DialogDescription>
              {selectedRoute?.id ? 'Modify the details of your existing route.' : 'Fill in the details to create a new route.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RouteForm route={selectedRoute} onSuccess={handleDialogClose} />
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the route with order
              <span className="font-bold"> {selectedRoute?.order}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}