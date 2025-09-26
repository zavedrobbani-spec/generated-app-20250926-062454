import { useEffect } from 'react';
import { useFilterStore } from '@/stores/filter-store';
import { filterColumns } from '@/components/filters/filter-columns';
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
import { FilterForm } from '@/components/filters/FilterForm';
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
export function FiltersPage() {
  const {
    filters,
    fetchFilters,
    isLoading,
    error,
    selectedFilter,
    setSelectedFilter,
    isDeleteDialogOpen,
    setDeleteDialogOpen,
    deleteFilter,
  } = useFilterStore();
  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  const handleDialogClose = () => {
    setSelectedFilter(null);
  };
  const handleDelete = async () => {
    if (selectedFilter?.id) {
      await deleteFilter(selectedFilter.id);
      setDeleteDialogOpen(false);
      setSelectedFilter(null);
    }
  };
  if (isLoading && filters.length === 0) {
    return <LoadingSkeleton />;
  }
  return (
    <div className="space-y-6">
      <Toaster richColors />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Filters</h2>
          <p className="text-muted-foreground">
            Manage your message filters.
          </p>
        </div>
        <Button onClick={() => setSelectedFilter({})}>Add Filter</Button>
      </div>
      <DataTable columns={filterColumns} data={filters} />
      <Dialog open={!!selectedFilter && !isDeleteDialogOpen} onOpenChange={(isOpen) => !isOpen && handleDialogClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedFilter?.id ? 'Edit Filter' : 'Add New Filter'}</DialogTitle>
            <DialogDescription>
              {selectedFilter?.id ? 'Modify the details of your existing filter.' : 'Fill in the details to create a new filter.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FilterForm filter={selectedFilter} onSuccess={handleDialogClose} />
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the filter
              <span className="font-bold"> {selectedFilter?.fid}</span>.
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