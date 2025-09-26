import { useEffect } from 'react';
import { useConnectorStore } from '@/stores/connector-store';
import { columns } from '@/components/connectors/columns';
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
import { ConnectorForm } from '@/components/connectors/ConnectorForm';
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
export function ConnectorsPage() {
  const {
    connectors,
    fetchConnectors,
    isLoading,
    error,
    selectedConnector,
    setSelectedConnector,
    isDeleteDialogOpen,
    setDeleteDialogOpen,
    deleteConnector,
  } = useConnectorStore();
  useEffect(() => {
    fetchConnectors();
  }, [fetchConnectors]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  const handleDialogClose = () => {
    setSelectedConnector(null);
  };
  const handleDelete = async () => {
    if (selectedConnector) {
      await deleteConnector(selectedConnector.id);
      setDeleteDialogOpen(false);
      setSelectedConnector(null);
    }
  };
  if (isLoading && connectors.length === 0) {
    return <LoadingSkeleton />;
  }
  return (
    <div className="space-y-6">
      <Toaster richColors />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Connectors</h2>
          <p className="text-muted-foreground">
            Manage your SMPP and HTTP connectors.
          </p>
        </div>
        <Button onClick={() => setSelectedConnector({})}>Add Connector</Button>
      </div>
      <DataTable columns={columns} data={connectors} />
      <Dialog open={!!selectedConnector && !isDeleteDialogOpen} onOpenChange={(isOpen) => !isOpen && handleDialogClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedConnector?.id ? 'Edit Connector' : 'Add New Connector'}</DialogTitle>
            <DialogDescription>
              {selectedConnector?.id ? 'Modify the details of your existing connector.' : 'Fill in the details to create a new connector.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ConnectorForm connector={selectedConnector} onSuccess={handleDialogClose} />
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the connector
              <span className="font-bold"> {selectedConnector?.cid}</span>.
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