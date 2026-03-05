import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn, Network, Shield, UserPlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useState } from "react";
import { MatrixRain } from "../components/matrix/MatrixRain";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LoginPage() {
  const { login, isLoggingIn, isLoginError, isInitializing } =
    useInternetIdentity();
  const [_tab, setTab] = useState<"login" | "register">("login");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-matrix-bg"
      data-ocid="auth.login_page"
    >
      {/* Matrix rain background */}
      <MatrixRain />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Scan line animation */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/30 to-transparent"
          style={{
            animation: "scan-line 8s linear infinite",
            top: 0,
          }}
        />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo area */}
        <div className="text-center mb-8 space-y-3">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-neon-green/40 bg-neon-green/5 glow-green mb-4"
          >
            <Network className="w-8 h-8 text-neon-green" />
          </motion.div>

          <h1 className="font-display text-3xl font-bold tracking-[0.2em] text-neon-green animate-neon-pulse uppercase">
            MATRIX
          </h1>
          <h2 className="font-display text-lg tracking-[0.3em] text-neon-cyan/80 uppercase">
            TECHNOLOGY
          </h2>
          <p className="text-muted-foreground font-mono text-xs tracking-widest">
            PAN-INDIA AI POWERED 3D STARTUP COLLABORATION
          </p>

          <div className="flex items-center justify-center gap-3 pt-1">
            {["CONNECT", "COLLABORATE", "GROW"].map((word, i) => (
              <span key={word} className="flex items-center gap-3">
                <span className="text-neon-green/60 font-mono text-[10px] tracking-widest">
                  {word}
                </span>
                {i < 2 && <span className="w-px h-3 bg-neon-green/30" />}
              </span>
            ))}
          </div>
        </div>

        {/* Auth card */}
        <div className="glass-card rounded-lg p-6 space-y-6">
          {/* Tab switcher */}
          <div className="flex rounded border border-neon-green/20 overflow-hidden font-mono text-xs">
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setTab(tab)}
                className={`flex-1 py-2 px-4 tracking-widest uppercase transition-all duration-200 ${
                  _tab === tab
                    ? "bg-neon-green/15 text-neon-green"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={tab === "login" ? undefined : "auth.register.toggle"}
              >
                {tab === "login" ? (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-3 h-3" /> LOGIN
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-3 h-3" /> REGISTER
                  </span>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={_tab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              {_tab === "register" && (
                <div className="space-y-1.5">
                  <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="Abhishek Kumar"
                    className="bg-matrix-bg border-neon-green/20 font-mono text-sm focus:border-neon-green/60 focus:ring-neon-green/20"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="founder@startup.in"
                  className="bg-matrix-bg border-neon-green/20 font-mono text-sm focus:border-neon-green/60 focus:ring-neon-green/20"
                  data-ocid="auth.email.input"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••••"
                  className="bg-matrix-bg border-neon-green/20 font-mono text-sm focus:border-neon-green/60 focus:ring-neon-green/20"
                  data-ocid="auth.password.input"
                />
              </div>

              {isLoginError && (
                <p className="text-destructive font-mono text-xs text-center">
                  Authentication failed. Please try again.
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoggingIn || isInitializing}
                className="w-full bg-neon-green/10 border border-neon-green/50 text-neon-green hover:bg-neon-green/20 glow-green font-mono text-xs tracking-widest uppercase h-11"
                data-ocid="auth.submit_button"
              >
                {isLoggingIn || isInitializing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    {_tab === "login" ? "ENTER THE MATRIX" : "JOIN THE NETWORK"}
                  </>
                )}
              </Button>
            </motion.form>
          </AnimatePresence>

          <div className="text-center">
            <p className="font-mono text-[10px] text-muted-foreground/50 tracking-widest">
              SECURED BY INTERNET IDENTITY PROTOCOL
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center font-mono text-xs">
          {[
            { label: "STARTUPS", value: "500+" },
            { label: "CITIES", value: "50+" },
            { label: "SECTORS", value: "9" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="text-neon-green font-display text-lg glow-text-green">
                {stat.value}
              </div>
              <div className="text-muted-foreground/60 text-[10px] tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-neon-green/30" />
      <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-neon-green/30" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-neon-green/30" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-neon-green/30" />
    </div>
  );
}
