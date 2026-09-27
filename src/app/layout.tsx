import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Settings } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Skill Dashboard",
  description: "Personal AI Skill and Agent Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-border font-bold text-xl text-sidebar-foreground">
              My Skills
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                <LayoutDashboard className="w-5 h-5" />
                Gallery
              </Link>
              <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent/50 text-muted-foreground font-medium cursor-pointer transition-colors">
                <Settings className="w-5 h-5" />
                Settings
              </div>
            </nav>
            <div className="p-4 border-t border-border flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">KOAI LABS</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/80" title="Active" />
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
