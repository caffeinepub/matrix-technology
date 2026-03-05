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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  Settings,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function SettingsPage() {
  const { clear } = useInternetIdentity();
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwChanged, setPwChanged] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw === confirmPw && newPw.length >= 8) {
      setPwChanged(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setTimeout(() => setPwChanged(false), 3000);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6" data-ocid="settings.page">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-neon-green" />
        <h1 className="font-display text-xl text-neon-green glow-text-green tracking-widest uppercase">
          Settings
        </h1>
      </div>

      {/* Security section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card rounded-lg p-5 space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-neon-cyan" />
          <h2 className="font-display text-sm text-neon-cyan tracking-widest uppercase">
            Security
          </h2>
        </div>

        {/* Fingerprint toggle */}
        <div className="flex items-center justify-between py-3 border-b border-neon-green/10">
          <div className="flex items-center gap-3">
            <Fingerprint className="w-4 h-4 text-neon-purple" />
            <div>
              <p className="font-mono text-sm text-foreground">
                Biometric Lock
              </p>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest">
                FINGERPRINT / FACE ID AUTHENTICATION
              </p>
            </div>
          </div>
          <Switch
            checked={fingerprintEnabled}
            onCheckedChange={setFingerprintEnabled}
            className="data-[state=checked]:bg-neon-purple/80"
            data-ocid="settings.fingerprint.toggle"
          />
        </div>

        {fingerprintEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 p-3 rounded bg-neon-purple/10 border border-neon-purple/20 font-mono text-xs text-neon-purple"
          >
            <Fingerprint className="w-4 h-4 shrink-0" />
            <span>Biometric authentication enabled — scan to unlock</span>
          </motion.div>
        )}
      </motion.div>

      {/* Change password */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-lg p-5 space-y-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-neon-green" />
          <h2 className="font-display text-sm text-neon-green tracking-widest uppercase">
            Change Password
          </h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              Current Password
            </Label>
            <div className="relative">
              <Input
                type={showCurrentPw ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Enter current password"
                className="bg-matrix-bg border-neon-green/20 font-mono text-sm pr-10 focus:border-neon-green/60"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              New Password
            </Label>
            <div className="relative">
              <Input
                type={showNewPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min 8 characters"
                minLength={8}
                className="bg-matrix-bg border-neon-green/20 font-mono text-sm pr-10 focus:border-neon-green/60"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                type={showConfirmPw ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repeat new password"
                className={`bg-matrix-bg font-mono text-sm pr-10 focus:border-neon-green/60 ${
                  confirmPw && confirmPw !== newPw
                    ? "border-destructive/50"
                    : "border-neon-green/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmPw && confirmPw !== newPw && (
              <p className="font-mono text-[11px] text-destructive">
                Passwords do not match
              </p>
            )}
          </div>

          {pwChanged && (
            <div className="flex items-center gap-2 p-3 rounded bg-neon-green/10 border border-neon-green/30 text-neon-green font-mono text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>PASSWORD UPDATED SUCCESSFULLY</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={!currentPw || !newPw || !confirmPw || newPw !== confirmPw}
            className="w-full bg-neon-green/10 border border-neon-green/40 text-neon-green hover:bg-neon-green/20 glow-green font-mono text-xs tracking-widest h-10"
            data-ocid="settings.change_password.button"
          >
            <Lock className="w-4 h-4 mr-2" />
            UPDATE PASSWORD
          </Button>
        </form>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-lg p-5 space-y-4 border border-destructive/20 bg-destructive/5"
      >
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <h2 className="font-display text-sm text-destructive tracking-widest uppercase">
            Danger Zone
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-sm text-foreground">Delete Account</p>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest mt-0.5">
              PERMANENTLY REMOVES ALL DATA AND NODES
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-destructive/40 text-destructive hover:bg-destructive/10 font-mono text-xs tracking-widest"
                data-ocid="settings.delete_account.button"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                DELETE
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className="bg-matrix-surface border-destructive/30 text-foreground"
              data-ocid="settings.delete_account.dialog"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-destructive tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  WIPE ACCOUNT DATA?
                </AlertDialogTitle>
                <AlertDialogDescription className="font-mono text-sm text-muted-foreground space-y-2">
                  <p>
                    This will{" "}
                    <strong className="text-foreground">
                      permanently delete
                    </strong>{" "}
                    your account, profile, and all associated startup nodes from
                    the Matrix network.
                  </p>
                  <p className="text-destructive/80">
                    This action is irreversible.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="border-neon-green/20 font-mono text-xs tracking-widest"
                  data-ocid="settings.delete_account.cancel_button"
                >
                  ABORT
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={clear}
                  className="bg-destructive/10 border border-destructive/50 text-destructive hover:bg-destructive/20 font-mono text-xs tracking-widest"
                  data-ocid="settings.delete_account.confirm_button"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  TERMINATE ACCOUNT
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>
    </div>
  );
}
