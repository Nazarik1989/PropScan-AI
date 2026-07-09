import React from "react";
import { Link } from "wouter";
import { useListDocuments, useDeleteDocument, getListDocumentsQueryKey, getGetDocumentStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatBytes, formatRelative } from "@/lib/format";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, ChevronRight, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function DocumentList() {
  const { data: documents, isLoading } = useListDocuments();
  const deleteMutation = useDeleteDocument();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this document?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDocumentsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDocumentStatsQueryKey() });
          toast({ title: "Document deleted" });
        },
        onError: () => {
          toast({ title: "Failed to delete document", variant: "destructive" });
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Filename</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map(i => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-xl border bg-card/50 border-dashed">
        <div className="bg-primary/5 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No documents yet</h3>
        <p className="text-sm text-muted-foreground">Upload a property document above to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[40%] font-medium">Document</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Size</TableHead>
            <TableHead className="font-medium">Uploaded</TableHead>
            <TableHead className="text-right font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} className="group hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium">
                <Link href={`/documents/${doc.id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate max-w-[300px] block" title={doc.filename}>{doc.filename}</span>
                </Link>
              </TableCell>
              <TableCell>
                {doc.status === 'completed' && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Analyzed</Badge>}
                {doc.status === 'processing' && <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 flex w-fit items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Processing</Badge>}
                {doc.status === 'pending' && <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Pending</Badge>}
                {doc.status === 'failed' && <Badge variant="destructive">Failed</Badge>}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{formatBytes(doc.filesize)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{formatRelative(doc.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleDelete(e, doc.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`btn-delete-${doc.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/documents/${doc.id}`}>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
