import { Disc3 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Disc3 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg tracking-wider text-platinum">
              REWIND
            </span>
          </div>

          {/* TLC Easter Egg */}
          <p className="text-xs text-muted-foreground/50 tracking-[0.15em] text-center">
            <span className="text-primary">T</span>LC STUDIOS PRESENTS •{" "}
            <span className="text-silver">L</span>EGENDARY{" "}
            <span className="text-accent">C</span>OLLECTION • PLATINUM EDITION
          </p>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © 2024 TLC Studios. For testing only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
