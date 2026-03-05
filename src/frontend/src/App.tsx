import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AppLayout, type Page } from "./components/matrix/AppLayout";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { ContactPage } from "./pages/ContactPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { MyNodePage } from "./pages/MyNodePage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";

function SeedDataOnce() {
  const { actor, isFetching } = useActor();
  const seeded = useRef(false);

  useEffect(() => {
    if (actor && !isFetching && !seeded.current) {
      seeded.current = true;
      void actor.seedData().catch(() => {
        // Seed data failure is non-critical
      });
    }
  }, [actor, isFetching]);

  return null;
}

function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-matrix-bg">
      <div className="text-center space-y-4 font-mono">
        <div className="relative w-12 h-12 mx-auto">
          <div className="w-12 h-12 rounded-full border-2 border-neon-green/20 absolute" />
          <div className="w-12 h-12 rounded-full border-t-2 border-neon-green animate-spin absolute" />
        </div>
        <p className="text-neon-green text-xs tracking-[0.3em] glow-text-green">
          INITIALIZING MATRIX...
        </p>
      </div>
    </div>
  );
}

const PAGE_ORDER: Record<Page, number> = {
  dashboard: 0,
  mynode: 1,
  profile: 2,
  settings: 3,
  contact: 4,
};

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [page, setPage] = useState<Page>("dashboard");
  const [prevPage, setPrevPage] = useState<Page>("dashboard");

  const isAuthenticated = !!identity;

  const handleNavigate = (newPage: Page) => {
    setPrevPage(page);
    setPage(newPage);
  };

  const direction = PAGE_ORDER[page] > PAGE_ORDER[prevPage] ? 1 : -1;

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const pageVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 30 : -30,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -20 : 20,
    }),
  };

  return (
    <>
      <SeedDataOnce />
      <AppLayout activePage={page} onNavigate={handleNavigate}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full overflow-auto"
            style={{
              overflowY: page === "dashboard" ? "hidden" : "auto",
            }}
          >
            {page === "dashboard" && <DashboardPage />}
            {page === "mynode" && <MyNodePage />}
            {page === "profile" && <ProfilePage />}
            {page === "settings" && <SettingsPage />}
            {page === "contact" && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </AppLayout>

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              "bg-matrix-surface border border-neon-green/20 text-foreground font-mono text-xs",
            title: "text-neon-green",
            description: "text-muted-foreground",
          },
        }}
      />

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-5 flex items-center justify-center pointer-events-none z-50">
        <p className="font-mono text-[9px] text-muted-foreground/20 tracking-widest">
          © {new Date().getFullYear()} · Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neon-green/40 pointer-events-auto"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </>
  );
}
