import React from "react";
import { Link, useLocation } from "wouter";
import { Shield, Home, Settings, FileSearch, LogOut } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-sidebar border-b md:border-b-0 md:border-r border-sidebar-border shrink-0 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-semibold text-lg leading-tight tracking-tight text-sidebar-foreground">PropScan AI</h1>
            <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider font-medium">Risk Analysis</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          <Link href="/">
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              location === "/" || location.startsWith("/documents") 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            }`}>
              <Home className="w-4 h-4" />
              Dashboard
            </div>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/40 cursor-not-allowed">
            <FileSearch className="w-4 h-4" />
            Search Archive
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/40 cursor-not-allowed">
            <Settings className="w-4 h-4" />
            Settings
          </div>
        </nav>
        
        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" />
            Sign Out
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-8 shrink-0 sticky top-0 z-10">
          <div className="ml-auto flex items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">Attorney Portal</div>
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-medium text-sm">
              JD
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
