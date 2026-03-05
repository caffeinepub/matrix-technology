import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Loader2, Zap } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { StartupNode } from "../../backend.d";
import { useCreateNode, useUpdateNode } from "../../hooks/useQueries";

const SECTORS = [
  "Fintech",
  "Edtech",
  "Healthtech",
  "Agritech",
  "SaaS",
  "AI/ML",
  "E-commerce",
  "CleanTech",
  "Other",
];

const DIRECTIVES = [
  "Looking for Investors",
  "Looking for Co-Founders",
  "Looking for Developers",
  "Looking for Collaborators",
  "Open to All",
];

interface NodeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingNode?: StartupNode | null;
}

export function NodeFormDialog({
  open,
  onOpenChange,
  existingNode,
}: NodeFormDialogProps) {
  const isEdit = !!existingNode;

  const [form, setForm] = useState({
    companyName: existingNode?.companyName ?? "",
    description: existingNode?.description ?? "",
    sector: existingNode?.sector ?? "",
    city: existingNode?.city ?? "",
    latitude: existingNode?.latitude?.toString() ?? "",
    longitude: existingNode?.longitude?.toString() ?? "",
    directive: existingNode?.directive ?? "",
  });

  const [successId, setSuccessId] = useState<string | null>(null);

  const createNode = useCreateNode();
  const updateNode = useUpdateNode();
  const mutation = isEdit ? updateNode : createNode;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessId(null);

    const data = {
      companyName: form.companyName,
      description: form.description,
      sector: form.sector,
      city: form.city,
      latitude: Number.parseFloat(form.latitude),
      longitude: Number.parseFloat(form.longitude),
      directive: form.directive,
    };

    try {
      let result: string;
      if (isEdit && existingNode) {
        result = await updateNode.mutateAsync({ id: existingNode.id, ...data });
      } else {
        result = await createNode.mutateAsync(data);
      }
      setSuccessId(result);
    } catch {
      // error handled by mutation.isError
    }
  };

  const handleClose = () => {
    setSuccessId(null);
    createNode.reset();
    updateNode.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-lg bg-matrix-surface border-neon-green matrix-border text-foreground"
        data-ocid="node_form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-neon-green glow-text-green text-lg tracking-widest uppercase flex items-center gap-2">
            <Zap className="w-5 h-5" />
            {isEdit ? "Update Node" : "Initialize Startup Node"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-mono text-xs">
            {isEdit
              ? "Modify your startup node parameters"
              : "Deploy your startup node onto the Matrix network"}
          </DialogDescription>
        </DialogHeader>

        {successId ? (
          <div
            className="p-6 text-center space-y-4"
            data-ocid="node_form.success_state"
          >
            <CheckCircle2 className="w-12 h-12 text-neon-green mx-auto glow-green" />
            <p className="text-neon-green font-display glow-text-green text-sm tracking-widest">
              NODE INITIALIZED
            </p>
            <p className="text-muted-foreground font-mono text-xs break-all">
              ID: {successId}
            </p>
            <Button
              onClick={handleClose}
              className="bg-neon-green/10 border border-neon-green/40 text-neon-green hover:bg-neon-green/20 font-mono"
            >
              CLOSE TERMINAL
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mutation.isError && (
              <div
                className="flex items-center gap-2 p-3 rounded bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono"
                data-ocid="node_form.error_state"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : "Initialization failed"}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Company Name
                </Label>
                <Input
                  required
                  value={form.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="e.g. NeuraSync AI"
                  className="bg-matrix-bg border-neon-green/20 font-mono text-sm focus:border-neon-green/60 focus:ring-neon-green/20"
                  data-ocid="node_form.company_name.input"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Description
                </Label>
                <Textarea
                  required
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Briefly describe your startup..."
                  rows={3}
                  className="bg-matrix-bg border-neon-green/20 font-mono text-sm resize-none focus:border-neon-green/60"
                  data-ocid="node_form.description.textarea"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Sector
                </Label>
                <Select
                  value={form.sector}
                  onValueChange={(v) => handleChange("sector", v)}
                  required
                >
                  <SelectTrigger
                    className="bg-matrix-bg border-neon-green/20 font-mono text-sm"
                    data-ocid="node_form.sector.select"
                  >
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent className="bg-matrix-surface border-neon-green/20">
                    {SECTORS.map((s) => (
                      <SelectItem
                        key={s}
                        value={s}
                        className="font-mono text-sm"
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  City
                </Label>
                <Input
                  required
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="e.g. Bangalore"
                  className="bg-matrix-bg border-neon-green/20 font-mono text-sm focus:border-neon-green/60"
                  data-ocid="node_form.city.input"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Latitude
                </Label>
                <Input
                  required
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  value={form.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                  placeholder="12.9716"
                  className="bg-matrix-bg border-neon-green/20 font-mono text-sm focus:border-neon-green/60"
                  data-ocid="node_form.latitude.input"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Longitude
                </Label>
                <Input
                  required
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  value={form.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                  placeholder="77.5946"
                  className="bg-matrix-bg border-neon-green/20 font-mono text-sm focus:border-neon-green/60"
                  data-ocid="node_form.longitude.input"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Directive
                </Label>
                <Select
                  value={form.directive}
                  onValueChange={(v) => handleChange("directive", v)}
                  required
                >
                  <SelectTrigger
                    className="bg-matrix-bg border-neon-green/20 font-mono text-sm"
                    data-ocid="node_form.directive.select"
                  >
                    <SelectValue placeholder="What are you looking for?" />
                  </SelectTrigger>
                  <SelectContent className="bg-matrix-surface border-neon-green/20">
                    {DIRECTIVES.map((d) => (
                      <SelectItem
                        key={d}
                        value={d}
                        className="font-mono text-sm"
                      >
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="flex-1 border border-neon-green/20 text-muted-foreground hover:text-foreground font-mono text-xs tracking-widest"
              >
                ABORT
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 bg-neon-green/10 border border-neon-green/50 text-neon-green hover:bg-neon-green/20 glow-green font-mono text-xs tracking-widest"
                data-ocid="node_form.submit_button"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    DEPLOYING...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    {isEdit ? "UPDATE NODE" : "INITIALIZE NODE"}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
