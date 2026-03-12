import { Globe, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-4 md:px-12 py-12 mt-12 border-t border-border">
      <div className="max-w-5xl mx-auto">
        {/* Social */}
        <div className="flex gap-4 mb-6">
          <Facebook className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          <Instagram className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          <Twitter className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          <Youtube className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            "Audio Description", "Help Center", "Gift Cards", "Media Center",
            "Investor Relations", "Jobs", "Terms of Use", "Privacy",
            "Legal Notices", "Cookie Preferences", "Corporate Information", "Contact Us",
          ].map((link) => (
            <a key={link} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline">
              {link}
            </a>
          ))}
        </div>

        {/* Language */}
        <button className="flex items-center gap-2 border border-muted-foreground/30 px-3 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
          <Globe className="w-4 h-4" />
          English
        </button>

        <p className="text-xs text-muted-foreground">© 2024 Streamflix. A demo project.</p>
      </div>
    </footer>
  );
}
