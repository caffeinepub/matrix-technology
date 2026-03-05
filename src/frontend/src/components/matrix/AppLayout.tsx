import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronRight,
  Globe2,
  LogOut,
  Menu,
  Network,
  Phone,
  Settings,
  User,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useMyProfile } from "../../hooks/useQueries";

export type Page = "dashboard" | "mynode" | "profile" | "settings" | "contact";

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
  ocid: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Globe2 className="w-4 h-4" />,
    ocid: "nav.dashboard.link",
  },
  {
    id: "mynode",
    label: "My Node",
    icon: <Network className="w-4 h-4" />,
    ocid: "nav.mynode.link",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <User className="w-4 h-4" />,
    ocid: "nav.profile.link",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
    ocid: "nav.settings.link",
  },
  {
    id: "contact",
    label: "Contact",
    icon: <Phone className="w-4 h-4" />,
    ocid: "nav.contact.link",
  },
];

interface AppLayoutProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

export function AppLayout({
  activePage,
  onNavigate,
  children,
}: AppLayoutProps) {
  const { clear, identity } = useInternetIdentity();
  const { data: profile } = useMyProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const principalShort =
    identity?.getPrincipal().toString().slice(0, 8) ?? "??";
  const displayName = profile?.name || principalShort;
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : principalShort.slice(0, 2).toUpperCase();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-matrix-bg">
      {/* Top bar */}
      <header className="h-12 flex items-center gap-3 px-4 border-b border-neon-green/15 bg-matrix-surface/80 backdrop-blur-sm shrink-0 z-20">
        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <Zap className="w-5 h-5 text-neon-green" />
          </div>
          <span className="font-display text-sm font-bold tracking-[0.2em] text-neon-green glow-text-green animate-flicker hidden sm:block">
            MATRIX
          </span>
          <span className="font-display text-sm tracking-[0.25em] text-neon-cyan/70 hidden sm:block">
            TECHNOLOGY
          </span>
        </div>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-1.5 ml-4 font-mono text-xs text-muted-foreground">
          <ChevronRight className="w-3 h-3 text-neon-green/40" />
          <span className="text-foreground/60 capitalize">{activePage}</span>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {/* Status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-neon-green/60">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            ONLINE
          </div>

          {/* User avatar */}
          <div className="flex items-center gap-2">
            <Avatar className="w-7 h-7 border border-neon-green/25">
              <AvatarFallback className="bg-neon-green/10 text-neon-green font-mono text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block font-mono text-xs text-muted-foreground truncate max-w-[100px]">
              {displayName}
            </span>
          </div>

          {/* Logout */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clear}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  data-ocid="nav.logout.button"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-mono text-xs bg-matrix-elevated border-neon-green/20">
                Disconnect
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar - desktop */}
        <aside className="hidden md:flex w-52 border-r border-neon-green/10 bg-matrix-surface/40 backdrop-blur-sm flex-col shrink-0">
          <nav className="flex-1 p-2 space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded text-left
                  font-mono text-xs tracking-wide transition-all duration-150
                  ${
                    activePage === item.id
                      ? "bg-neon-green/10 text-neon-green border border-neon-green/25 glow-green"
                      : "text-muted-foreground hover:text-foreground hover:bg-matrix-elevated/60 border border-transparent"
                  }
                `}
                data-ocid={item.ocid}
              >
                <span
                  className={activePage === item.id ? "text-neon-green" : ""}
                >
                  {item.icon}
                </span>
                {item.label}
                {activePage === item.id && (
                  <div className="ml-auto w-1 h-1 rounded-full bg-neon-green" />
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="p-3 border-t border-neon-green/10">
            <p className="font-mono text-[9px] text-muted-foreground/30 tracking-widest text-center">
              MATRIX v1.0 · ICP NETWORK
            </p>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-30 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -200 }}
                animate={{ x: 0 }}
                exit={{ x: -200 }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className="fixed left-0 top-12 bottom-0 w-52 bg-matrix-surface border-r border-neon-green/20 z-40 md:hidden flex flex-col"
              >
                <nav className="flex-1 p-2 space-y-0.5">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded text-left
                        font-mono text-xs tracking-wide transition-all
                        ${
                          activePage === item.id
                            ? "bg-neon-green/10 text-neon-green border border-neon-green/25"
                            : "text-muted-foreground hover:text-foreground hover:bg-matrix-elevated/60 border border-transparent"
                        }
                      `}
                      data-ocid={item.ocid}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-hidden min-h-0 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
