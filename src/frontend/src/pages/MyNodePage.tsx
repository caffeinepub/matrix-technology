import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Compass,
  Edit,
  Hash,
  Loader2,
  MapPin,
  Network,
  Plus,
  Tag,
  Trash2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { getSectorColor } from "../components/matrix/Globe";
import { NodeFormDialog } from "../components/matrix/NodeFormDialog";
import { useDeleteNode, useMyNode } from "../hooks/useQueries";

export function MyNodePage() {
  const { data: myNode, isLoading } = useMyNode();
  const deleteNode = useDeleteNode();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleDelete = async () => {
    if (!myNode) return;
    await deleteNode.mutateAsync(myNode.id);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48 bg-neon-green/10" />
        <Skeleton className="h-64 w-full bg-neon-green/5" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto" data-ocid="mynode.page">
      <div className="flex items-center gap-3 mb-6">
        <Network className="w-6 h-6 text-neon-green" />
        <h1 className="font-display text-xl text-neon-green glow-text-green tracking-widest uppercase">
          My Node
        </h1>
      </div>

      {!myNode ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-lg p-12 text-center space-y-5"
          data-ocid="mynode.empty_state"
        >
          <div className="w-16 h-16 rounded-full border border-neon-green/20 bg-neon-green/5 flex items-center justify-center mx-auto">
            <Network className="w-8 h-8 text-neon-green/50" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-lg text-neon-green tracking-widest">
              NO NODE DEPLOYED
            </h2>
            <p className="text-muted-foreground font-mono text-sm max-w-sm mx-auto">
              You haven&apos;t initialized a startup node yet. Deploy your node
              to appear on the Matrix globe and connect with collaborators.
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-neon-green/10 border border-neon-green/50 text-neon-green hover:bg-neon-green/20 glow-green font-mono text-xs tracking-widest h-10"
            data-ocid="mynode.create.button"
          >
            <Plus className="w-4 h-4 mr-2" />
            INITIALIZE NODE
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Main node card */}
          <div
            className="glass-card rounded-lg p-6 space-y-5 relative overflow-hidden"
            data-ocid="mynode.card"
            style={{
              borderColor: `${getSectorColor(myNode.sector)}35`,
            }}
          >
            {/* Sector color strip */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
              style={{
                background: getSectorColor(myNode.sector),
                boxShadow: `0 0 12px ${getSectorColor(myNode.sector)}60`,
              }}
            />

            <div className="pl-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2
                    className="font-display text-2xl font-bold tracking-wide"
                    style={{ color: getSectorColor(myNode.sector) }}
                  >
                    {myNode.companyName}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{myNode.city}</span>
                  </div>
                </div>
                <Zap
                  className="w-6 h-6 mt-1 shrink-0"
                  style={{ color: getSectorColor(myNode.sector) }}
                />
              </div>

              {/* Description */}
              <p className="text-foreground/80 font-mono text-sm leading-relaxed mt-4">
                {myNode.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge
                  variant="outline"
                  className="font-mono text-xs"
                  style={{
                    background: `${getSectorColor(myNode.sector)}15`,
                    color: getSectorColor(myNode.sector),
                    border: `1px solid ${getSectorColor(myNode.sector)}40`,
                  }}
                >
                  <Tag className="w-3 h-3 mr-1.5" />
                  {myNode.sector}
                </Badge>
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-neon-cyan/30 text-neon-cyan bg-neon-cyan/5"
                >
                  <Compass className="w-3 h-3 mr-1.5" />
                  {myNode.directive}
                </Badge>
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-neon-green/10">
                <div className="space-y-1 font-mono text-xs">
                  <div className="text-muted-foreground/50 tracking-widest text-[10px]">
                    NODE ID
                  </div>
                  <div className="flex items-center gap-1.5 text-neon-green/70">
                    <Hash className="w-3 h-3" />
                    <span className="truncate font-display">
                      {myNode.id.slice(-12).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 font-mono text-xs">
                  <div className="text-muted-foreground/50 tracking-widest text-[10px]">
                    COORDINATES
                  </div>
                  <div className="text-foreground/60 font-display text-[11px]">
                    {myNode.latitude.toFixed(4)}, {myNode.longitude.toFixed(4)}
                  </div>
                </div>
                <div className="space-y-1 font-mono text-xs">
                  <div className="text-muted-foreground/50 tracking-widest text-[10px]">
                    DEPLOYED
                  </div>
                  <div className="flex items-center gap-1.5 text-foreground/60">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(
                        Number(myNode.createdAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => setShowEditForm(true)}
              className="flex-1 bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/20 font-mono text-xs tracking-widest"
              data-ocid="mynode.edit_button"
            >
              <Edit className="w-4 h-4 mr-2" />
              EDIT NODE
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 font-mono text-xs tracking-widest"
                  data-ocid="mynode.delete_button"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  DELETE NODE
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-matrix-surface border-destructive/30 text-foreground">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display text-destructive tracking-widest">
                    TERMINATE NODE?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-mono text-sm text-muted-foreground">
                    This will permanently remove{" "}
                    <span className="text-foreground font-bold">
                      {myNode.companyName}
                    </span>{" "}
                    from the Matrix network. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="border-neon-green/20 font-mono text-xs tracking-widest"
                    data-ocid="mynode.delete.cancel_button"
                  >
                    ABORT
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleteNode.isPending}
                    className="bg-destructive/10 border border-destructive/50 text-destructive hover:bg-destructive/20 font-mono text-xs tracking-widest"
                    data-ocid="mynode.delete.confirm_button"
                  >
                    {deleteNode.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        TERMINATING...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        TERMINATE
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>
      )}

      {/* Dialogs */}
      <NodeFormDialog open={showCreateForm} onOpenChange={setShowCreateForm} />
      {myNode && (
        <NodeFormDialog
          open={showEditForm}
          onOpenChange={setShowEditForm}
          existingNode={myNode}
        />
      )}
    </div>
  );
}
