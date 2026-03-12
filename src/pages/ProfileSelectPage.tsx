import { Link } from "react-router-dom";
import { profiles } from "@/lib/mockData";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfileSelectPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-foreground mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Who's watching?
      </motion.h1>

      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {profiles.map((profile, i) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to="/"
              className="group flex flex-col items-center gap-3"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden border-2 border-transparent group-hover:border-foreground transition-all">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover bg-secondary"
                />
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {profile.name}
              </span>
            </Link>
          </motion.div>
        ))}

        {/* Add profile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: profiles.length * 0.1 }}
        >
          <button className="group flex flex-col items-center gap-3">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-md bg-secondary flex items-center justify-center group-hover:bg-accent transition-colors">
              <Plus className="w-10 h-10 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              Add Profile
            </span>
          </button>
        </motion.div>
      </div>

      <button className="border border-muted-foreground/50 text-muted-foreground px-6 py-2 text-sm tracking-widest hover:text-foreground hover:border-foreground transition-colors">
        MANAGE PROFILES
      </button>
    </div>
  );
}
