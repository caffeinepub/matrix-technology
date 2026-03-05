import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Tag,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMyProfile, useUpsertProfile } from "../hooks/useQueries";

export function ProfilePage() {
  const { data: profile, isLoading } = useMyProfile();
  const upsertProfile = useUpsertProfile();
  const { identity } = useInternetIdentity();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    sector: "",
    startupName: "",
    bio: "",
  });

  // Sync form when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        city: profile.city ?? "",
        sector: profile.sector ?? "",
        startupName: profile.startupName ?? "",
        bio: profile.bio ?? "",
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await upsertProfile.mutateAsync(form);
  };

  const initials = form.name
    ? form.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-40 bg-neon-green/10" />
        <Skeleton className="h-96 w-full bg-neon-green/5" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto" data-ocid="profile.page">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-neon-green" />
        <h1 className="font-display text-xl text-neon-green glow-text-green tracking-widest uppercase">
          Profile
        </h1>
      </div>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-lg p-5 mb-5 flex items-center gap-4"
      >
        <Avatar className="w-14 h-14 border-2 border-neon-green/30">
          <AvatarFallback className="bg-neon-green/10 text-neon-green font-display text-lg">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="font-display text-lg text-foreground">
            {form.name || "Anonymous User"}
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            {identity?.getPrincipal().toString().slice(0, 20)}...
          </p>
          {form.sector && (
            <span className="inline-block font-mono text-[10px] text-neon-cyan border border-neon-cyan/20 bg-neon-cyan/5 px-2 py-0.5 rounded">
              {form.sector}
            </span>
          )}
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="glass-card rounded-lg p-6 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <User className="w-3 h-3" /> Name
            </Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Abhishek Kumar"
              className="bg-matrix-bg border-neon-green/20 font-mono text-sm focus:border-neon-green/60"
              data-ocid="profile.name.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> Email
            </Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="founder@startup.in"
              className="bg-matrix-bg border-neon-green/20 font-mono text-sm focus:border-neon-green/60"
              data-ocid="profile.email.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> Phone
            </Label>
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+91 9177631009"
              className="bg-matrix-bg border-neon-green/20 font-mono text-sm focus:border-neon-green/60"
              data-ocid="profile.phone.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> City
            </Label>
            <Input
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Hyderabad"
              className="bg-matrix-bg border-neon-green/20 font-mono text-sm focus:border-neon-green/60"
              data-ocid="profile.city.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Tag className="w-3 h-3" /> Sector
            </Label>
            <Input
              value={form.sector}
              onChange={(e) => handleChange("sector", e.target.value)}
              placeholder="AI/ML"
              className="bg-matrix-bg border-neon-green/20 font-mono text-sm focus:border-neon-green/60"
              data-ocid="profile.sector.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Building2 className="w-3 h-3" /> Startup Name
            </Label>
            <Input
              value={form.startupName}
              onChange={(e) => handleChange("startupName", e.target.value)}
              placeholder="NeuraSync AI"
              className="bg-matrix-bg border-neon-green/20 font-mono text-sm focus:border-neon-green/60"
              data-ocid="profile.startup_name.input"
            />
          </div>

          <div className="col-span-full space-y-1.5">
            <Label className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> Bio
            </Label>
            <Textarea
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell the Matrix about yourself and your startup journey..."
              rows={4}
              className="bg-matrix-bg border-neon-green/20 font-mono text-sm resize-none focus:border-neon-green/60"
              data-ocid="profile.bio.textarea"
            />
          </div>
        </div>

        {/* Status messages */}
        {upsertProfile.isSuccess && (
          <div
            className="flex items-center gap-2 p-3 rounded bg-neon-green/10 border border-neon-green/30 text-neon-green font-mono text-xs"
            data-ocid="profile.success_state"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>PROFILE SYNCHRONIZED SUCCESSFULLY</span>
          </div>
        )}

        {upsertProfile.isError && (
          <div
            className="flex items-center gap-2 p-3 rounded bg-destructive/10 border border-destructive/30 text-destructive font-mono text-xs"
            data-ocid="profile.error_state"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>SYNC FAILED — PLEASE RETRY</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={upsertProfile.isPending}
          className="w-full bg-neon-green/10 border border-neon-green/50 text-neon-green hover:bg-neon-green/20 glow-green font-mono text-xs tracking-widest h-10"
          data-ocid="profile.save_button"
        >
          {upsertProfile.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              SYNCHRONIZING...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              SAVE PROFILE
            </>
          )}
        </Button>
      </motion.form>
    </div>
  );
}
