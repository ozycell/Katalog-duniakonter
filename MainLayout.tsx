import { useState, useEffect, useRef, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/common/BottomNav";
import { motion } from "framer-motion";
import { useConfigStore } from "@/stores/config-store";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";
import { isCapacitor } from "@/lib/capacitor";

// Pages yang TIDAK menampilkan bottom nav
// Hanya 5 menu utama yang punya bottom nav: /dashboard, /history, /downline, /information, /my-account
const NO_BOTTOM_NAV_PAGES = [
    // Deposit & Transfer
    '/deposit', '/transfer', '/transfer/member', '/transfer/bank',
    // Note: /deposit/:id is matched by startsWith('/deposit')

    // Purchase
    '/prabayar', '/pascabayar', '/omni', '/pin-transaction',

    // Transaction Detail
    '/transaction/', '/print/', '/checkout',

    // Downline sub-pages
    '/downline/withdraw', '/downline/add',

    // Information sub-pages (detail pages only, not /information itself)
    '/information/',

    // My Account sub-pages (all except /my-account itself)
    '/my-account/account-', '/my-account/balance-', '/my-account/delete-',
    '/my-account/identity-', '/my-account/verify-', '/my-account/outlet-',
    '/my-account/personal-', '/my-account/referral-', '/my-account/transaction-', '/my-account/verification',
    '/my-account/photo-instruction', '/my-account/change-pin',

    // Other standalone pages
    '/contact', '/contacts', '/help', '/contact-us', '/about', '/report'
];

export default function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const { fetchAssets, getAddOns, isCacheExpired } = useConfigStore();
    const { isAuthenticated, token } = useAuthStore();
    const [isReady, setIsReady] = useState(false);

    // Redirect jika tidak authenticated
    useEffect(() => {
        if (!isAuthenticated || !token) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, token, navigate]);

    const shouldHideBottomNav = useMemo(() => {
        return NO_BOTTOM_NAV_PAGES.some(path => {
            // Exact match
            if (location.pathname === path) return true;
            // Starts with path (for prefix matching like /information/ or /my-account/account-)
            if (location.pathname.startsWith(path)) return true;
            return false;
        });
    }, [location.pathname]);

    useEffect(() => {
        const init = async () => {
            const addOns = getAddOns();
            if (!addOns || isCacheExpired()) {
                // Non-blocking: don't let fetchAssets block the UI
                fetchAssets().catch((err) => {
                    console.warn('[MainLayout] fetchAssets failed, continuing anyway:', err);
                });
            }
            // Always set ready immediately - don't block UI on asset fetch
            setIsReady(true);
        };
        init();
    }, [fetchAssets, getAddOns, isCacheExpired]);

    useEffect(() => {
        if (containerRef.current) containerRef.current.scrollTop = 0;
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }, [location.pathname]);

    // Handle Android hardware back button (APK only)
    useEffect(() => {
        if (!isCapacitor()) return;

        let listenerRemove: (() => void) | null = null;

        const initBackButton = async () => {
            const { App } = await import('@capacitor/app');
            const listener = await App.addListener('backButton', ({ canGoBack }) => {
                if (canGoBack) {
                    window.history.back();
                } else {
                    App.exitApp();
                }
            });
            listenerRemove = listener.remove;
        };

        initBackButton();

        return () => {
            if (listenerRemove) {
                listenerRemove();
            }
        };
    }, []);

    // Loading state saat init atau redirecting
    if (!isReady || !isAuthenticated || !token) {
        return (
            <div className="min-h-dvh bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-body-sm text-muted-foreground">Memuat...</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-dvh bg-muted/30">
            <div className="w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto min-h-dvh bg-background relative shadow-[0_0_40px_-10px_rgba(0,0,0,0.08)]">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.08 }}
                    className={shouldHideBottomNav ? "" : "pt-safe-header pb-safe-nav"}
                >
                    <Outlet />
                </motion.div>
                {!shouldHideBottomNav && <BottomNav />}
            </div>
        </div>
    );
}
