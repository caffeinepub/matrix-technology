import { ExternalLink, Mail, MapPin, Network, Phone } from "lucide-react";
import { motion } from "motion/react";

const TEAM = [
  {
    name: "Obulesh",
    role: "Co-Founder & CEO",
    phone: "9177631009",
    location: "India",
    color: "#00ff41",
  },
  {
    name: "Abhishek",
    role: "Co-Founder & CTO",
    phone: "9959970072",
    location: "India",
    color: "#00d4ff",
  },
];

export function ContactPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto" data-ocid="contact.page">
      <div className="flex items-center gap-3 mb-6">
        <Network className="w-6 h-6 text-neon-green" />
        <h1 className="font-display text-xl text-neon-green glow-text-green tracking-widest uppercase">
          Contact
        </h1>
      </div>

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-lg p-5 mb-6"
      >
        <p className="font-mono text-sm text-foreground/80 leading-relaxed">
          Connect with the Matrix Technology team. We&apos;re building
          India&apos;s most innovative startup collaboration ecosystem and would
          love to hear from you — whether you&apos;re a founder, investor, or
          potential collaborator.
        </p>
      </motion.div>

      {/* Team cards */}
      <div className="space-y-4 mb-6">
        {TEAM.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="glass-card rounded-lg p-5 relative overflow-hidden"
            style={{ borderColor: `${member.color}30` }}
          >
            {/* Color strip */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
              style={{
                background: member.color,
                boxShadow: `0 0 12px ${member.color}60`,
              }}
            />

            <div className="pl-3 space-y-3">
              <div>
                <h2
                  className="font-display text-xl font-bold"
                  style={{ color: member.color }}
                >
                  {member.name}
                </h2>
                <p className="font-mono text-xs text-muted-foreground tracking-widest">
                  {member.role}
                </p>
              </div>

              <div className="space-y-2">
                <a
                  href={`tel:+91${member.phone}`}
                  className="flex items-center gap-3 font-mono text-sm text-foreground/80 hover:text-foreground group transition-colors"
                >
                  <Phone
                    className="w-4 h-4 shrink-0 group-hover:text-neon-green transition-colors"
                    style={{ color: member.color }}
                  />
                  <span>+91 {member.phone}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-muted-foreground ml-auto" />
                </a>

                <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                  <MapPin
                    className="w-4 h-4 shrink-0"
                    style={{ color: member.color }}
                  />
                  <span>{member.location}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Email card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card-cyan rounded-lg p-5"
      >
        <div className="flex items-center gap-3 mb-3">
          <Mail className="w-5 h-5 text-neon-cyan" />
          <h2 className="font-display text-sm text-neon-cyan tracking-widest uppercase">
            Email Contact
          </h2>
        </div>
        <a
          href="mailto:goudabhi7890@gmail.com"
          className="group flex items-center gap-3 p-3 rounded border border-neon-cyan/20 bg-neon-cyan/5 hover:bg-neon-cyan/10 transition-colors"
        >
          <span className="font-mono text-sm text-foreground/80 group-hover:text-neon-cyan transition-colors">
            goudabhi7890@gmail.com
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-neon-cyan ml-auto transition-colors" />
        </a>
        <p className="font-mono text-[11px] text-muted-foreground mt-3 tracking-wide">
          For partnerships, investment inquiries, or collaboration requests
        </p>
      </motion.div>

      {/* Decorative connection lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 pt-6 border-t border-neon-green/10"
      >
        <div className="grid grid-cols-3 gap-4 text-center font-mono text-xs">
          {[
            { label: "Response Time", value: "< 24h" },
            { label: "Availability", value: "24/7" },
            { label: "Network", value: "Pan-India" },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="text-neon-green font-display text-base glow-text-green">
                {item.value}
              </div>
              <div className="text-muted-foreground/50 text-[10px] tracking-widest">
                {item.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
