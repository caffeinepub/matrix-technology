import { Badge } from "@/components/ui/badge";
import { Compass, MapPin, Tag, Zap } from "lucide-react";
import type { StartupNode } from "../../backend.d";
import { getSectorColor } from "./Globe";

interface NodeCardProps {
  node: StartupNode;
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export function NodeCard({
  node,
  index,
  isSelected = false,
  onClick,
}: NodeCardProps) {
  const color = getSectorColor(node.sector);
  const ocidIndex = index + 1;

  return (
    <button
      type="button"
      className={`
        relative w-full p-3 rounded cursor-pointer transition-all duration-200
        border font-mono text-xs text-left
        ${
          isSelected
            ? "bg-matrix-elevated border-neon-green/60 glow-green"
            : "bg-matrix-surface/50 border-neon-green/15 hover:border-neon-green/40 hover:bg-matrix-elevated/70"
        }
      `}
      onClick={onClick}
      data-ocid={`dashboard.node.item.${ocidIndex}`}
    >
      {/* Sector color indicator */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l"
        style={{
          background: color,
          boxShadow: `0 0 6px ${color}60`,
        }}
      />

      <div className="pl-2 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <span
            className="font-display text-xs font-bold leading-tight"
            style={{ color: isSelected ? color : undefined }}
          >
            {node.companyName}
          </span>
          <Zap className="w-3 h-3 shrink-0 mt-0.5" style={{ color }} />
        </div>

        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{node.city}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 border-0 font-mono"
            style={{
              background: `${color}15`,
              color: color,
              borderColor: `${color}40`,
              border: `1px solid ${color}40`,
            }}
          >
            <Tag className="w-2.5 h-2.5 mr-1" />
            {node.sector}
          </Badge>

          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 border-neon-cyan/30 text-neon-cyan bg-neon-cyan/5 font-mono"
          >
            <Compass className="w-2.5 h-2.5 mr-1" />
            {node.directive.replace("Looking for ", "")}
          </Badge>
        </div>
      </div>
    </button>
  );
}
