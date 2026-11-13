import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, History, Users, UserCircle, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useConfigStore } from "@/stores/config-store";

const navItems = [
    { icon: Home, label: 'Beranda', href: '/dashboard' },
    { icon: History, label: 'Riwayat', href: '/history' },
    { icon: Users, label: 'Referral', href: '/downline', hideForDemo: true },
    { icon: Megaphone, label: 'Informasi', href: '/information' },
    { icon: UserCircle, label: 'Akun', href: '/my-account' },
];

export function BottomNav() {
    const location = useLocation();
    const { user } = useAuthStore();
    const { checkFeature } = useConfigStore();
    
    // Demo account detection - same as MyAccountPage
    const isDemoAccount = user?.phone === "08900913";
    
    // Check MIX_ADDON_DOWNLINE addon status
    const hasDownlineAddon = checkFeature('MIX_ADDON_DOWNLINE');
    
    // Filter out hidden items (demo account or addon not active)
    const visibleNavItems = navItems.filter(item => {
        if (item.hideForDemo && isDemoAccount) return false;
        if (item.href === '/downline' && (!hasDownlineAddon || isDemoAccount)) return false;
        return true;
    });
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <nav className="w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl bg-background/95 backdrop-blur-2xl border-t border-border/30 shadow-top rounded-t-2xl pointer-events-auto safe-bottom">
                <div className="flex justify-around items-center h-14 px-1">
                    {visibleNavItems.map((item) => {
                        const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname?.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200 rounded-xl mx-0.5",
                                    isActive ? "text-primary" : "text-muted-foreground/70 active:text-foreground"
                                )}
                            >

                                <item.icon className="h-5 w-5 relative z-10 transition-all duration-200" />
                                <span className={cn(
                                    "text-label-xs relative z-10 transition-all duration-200 leading-none tracking-wide",
                                    isActive ? "font-semibold" : "font-medium"
                                )}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
