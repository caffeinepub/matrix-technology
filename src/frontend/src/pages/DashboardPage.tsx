import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  ChevronRight,
  Compass,
  Cpu,
  Globe2,
  MapPin,
  Network,
  Plus,
  Tag,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { StartupNode } from "../backend.d";
import { Globe, getSectorColor } from "../components/matrix/Globe";
import { NodeCard } from "../components/matrix/NodeCard";
import { NodeFormDialog } from "../components/matrix/NodeFormDialog";
import { useAllNodes, useMyNode } from "../hooks/useQueries";

export function DashboardPage() {
  const { data: nodes = [], isLoading } = useAllNodes();
  const { data: myNode } = useMyNode();
  const [selectedNode, setSelectedNode] = useState<StartupNode | null>(null);
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => {
    const cities = new Set(nodes.map((n) => n.city)).size;
    const sectors = new Set(nodes.map((n) => n.sector)).size;
    return { total: nodes.length, cities, sectors };
  }, [nodes]);

  const handleSelectNode = (node: StartupNode | null) => {
    setSelectedNode((prev) => (prev?.id === node?.id ? null : node));
  };

  return (
    <div className="h-full flex flex-col" data-ocid="dashboard.page">
      {/* Stats bar */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-neon-green/10 bg-matrix-surface/50 shrink-0">
        <div className="flex items-center gap-5 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Network className="w-3.5 h-3.5 text-neon-green" />
            <span className="text-muted-foreground">NODES:</span>
            <span className="text-neon-green font-display glow-text-green">
              {stats.total}
            </span>
          </div>
          <div className="w-px h-3 bg-neon-green/20" />
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="text-muted-foreground">CITIES:</span>
            <span className="text-neon-cyan font-display">{stats.cities}</span>
          </div>
          <div className="w-px h-3 bg-neon-green/20" />
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-neon-purple" />
            <span className="text-muted-foreground">SECTORS:</span>
            <span className="text-neon-purple font-display">
              {stats.sectors}
            </span>
          </div>
        </div>

        <div className="ml-auto">
          {!myNode && (
            <Button
              onClick={() => setShowForm(true)}
              size="sm"
              className="bg-neon-green/10 border border-neon-green/40 text-neon-green hover:bg-neon-green/20 glow-green font-mono text-xs tracking-widest h-7"
              data-ocid="dashboard.initialize_node.button"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              INITIALIZE NODE
            </Button>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Globe */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="h-full flex items-center justify-center bg-matrix-bg">
              <div className="text-center space-y-3 font-mono">
                <Globe2 className="w-10 h-10 text-neon-green mx-auto animate-spin" />
                <p className="text-neon-green text-xs tracking-widest glow-text-green">
                  LOADING MATRIX...
                </p>
              </div>
            </div>
          ) : (
            <Globe
              nodes={nodes}
              selectedNode={selectedNode}
              onSelectNode={handleSelectNode}
            />
          )}

          {/* Selected node popup */}
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: -10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-6 left-6 max-w-xs glass-card rounded-lg p-4 font-mono text-xs space-y-3 z-10 pointer-events-auto"
              style={{
                borderColor: `${getSectorColor(selectedNode.sector)}40`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3
                    className="font-display text-sm font-bold"
                    style={{ color: getSectorColor(selectedNode.sector) }}
                  >
                    {selectedNode.companyName}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedNode.city}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="text-muted-foreground hover:text-foreground shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-muted-foreground leading-relaxed text-[11px] line-clamp-3">
                {selectedNode.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border-0 font-mono"
                  style={{
                    background: `${getSectorColor(selectedNode.sector)}15`,
                    color: getSectorColor(selectedNode.sector),
                    border: `1px solid ${getSectorColor(selectedNode.sector)}40`,
                  }}
                >
                  <Tag className="w-2.5 h-2.5 mr-1" />
                  {selectedNode.sector}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border-neon-cyan/30 text-neon-cyan bg-neon-cyan/5"
                >
                  <Compass className="w-2.5 h-2.5 mr-1" />
                  {selectedNode.directive.replace("Looking for ", "")}
                </Badge>
              </div>

              <div className="text-muted-foreground/40 text-[10px] font-display">
                NODE #{selectedNode.id.slice(-8).toUpperCase()}
              </div>
            </motion.div>
          )}
        </div>

        {/* Node list sidebar */}
        <div className="w-72 border-l border-neon-green/10 bg-matrix-surface/30 flex flex-col shrink-0">
          <div className="px-3 py-2.5 border-b border-neon-green/10 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-neon-green" />
            <span className="font-mono text-xs text-muted-foreground tracking-widest">
              ACTIVE NODES
            </span>
            <span className="ml-auto font-display text-xs text-neon-green">
              {nodes.length}
            </span>
          </div>

          <ScrollArea className="flex-1">
            <div
              className="p-2 space-y-1.5"
              data-ocid="dashboard.node_list.list"
            >
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loading placeholders
                  <div key={i} className="p-3 space-y-2">
                    <Skeleton className="h-3 w-3/4 bg-neon-green/10" />
                    <Skeleton className="h-2 w-1/2 bg-neon-green/5" />
                    <Skeleton className="h-2 w-2/3 bg-neon-green/5" />
                  </div>
                ))
              ) : nodes.length === 0 ? (
                <div className="p-6 text-center space-y-3 font-mono">
                  <Network className="w-8 h-8 text-neon-green/30 mx-auto" />
                  <p className="text-muted-foreground text-xs tracking-widest">
                    NO NODES ACTIVE
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    size="sm"
                    className="bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 font-mono text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    BE FIRST
                  </Button>
                </div>
              ) : (
                nodes.map((node, i) => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    index={i}
                    isSelected={selectedNode?.id === node.id}
                    onClick={() => handleSelectNode(node)}
                  />
                ))
              )}
            </div>
          </ScrollArea>

          {/* Sector legend */}
          <div className="p-3 border-t border-neon-green/10 space-y-1.5">
            <p className="font-mono text-[10px] text-muted-foreground/50 tracking-widest mb-2">
              SECTOR LEGEND
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {[
                { sector: "Fintech", label: "FIN" },
                { sector: "Edtech", label: "EDU" },
                { sector: "AI/ML", label: "AI" },
                { sector: "SaaS", label: "SaaS" },
                { sector: "Healthtech", label: "HEALTH" },
                { sector: "Agritech", label: "AGRI" },
              ].map(({ sector, label }) => (
                <div
                  key={sector}
                  className="flex items-center gap-1.5 font-mono text-[10px]"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background: getSectorColor(sector),
                      boxShadow: `0 0 4px ${getSectorColor(sector)}`,
                    }}
                  />
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Node view quick action */}
      {selectedNode && (
        <div className="px-4 py-2 border-t border-neon-green/10 bg-matrix-surface/50 flex items-center gap-3 shrink-0">
          <span className="font-mono text-xs text-muted-foreground">
            SELECTED:
          </span>
          <span
            className="font-display text-xs"
            style={{ color: getSectorColor(selectedNode.sector) }}
          >
            {selectedNode.companyName}
          </span>
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">
            {selectedNode.city} · {selectedNode.sector}
          </span>
        </div>
      )}

      <NodeFormDialog open={showForm} onOpenChange={setShowForm} />
    </div>
  );
}
