import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { MoreVertical, MessageCircle, ArrowLeft, Search, X, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AppLogo } from "@/components/common/AppLogo";

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
}

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    showBackLabel?: boolean;
    showChatUs?: boolean;
    showMore?: boolean;
    onMoreClick?: () => void;  // Handler for more button
    branding?: boolean;
    showChatUsLabel?: boolean;
    className?: string;
    onBack?: () => void;
    action?: React.ReactNode;
    transparent?: boolean;
    showLogo?: boolean;
    userName?: string;
    logoPosition?: 'center' | 'left';
    // Custom background color
    backgroundColor?: string;
    // Search props
    showSearch?: boolean;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    onSearchSubmit?: () => void;
    searchPlaceholder?: string;
    isSearching?: boolean;
    // Refresh props
    showRefresh?: boolean;
    isRefreshing?: boolean;
    onRefresh?: () => void;
    // Shadow prop
    shadow?: boolean;
}

/**
 * Header Component - Standards
 * 
 * Typography:
 * - Title: text-heading-lg (18px) font-semibold - Page titles
 * - Greeting: text-label-xs (12px) font-medium uppercase - Greeting text
 * - Username: text-body-sm (14px) font-semibold - User name
 * - Button Label: text-label-xs (12px) font-semibold - Button text (desktop only)
 * 
 * Responsive Button Standards:
 * - Mobile/Tablet (< lg): Icon-only (20px), h-9 w-9 square buttons
 * - Desktop (>= lg): Icon (16px) + Text, h-9 w-auto
 * - Exception: If multiple buttons on right, always icon-only
 * 
 * Icon Sizes:
 * - Mobile/Tablet: h-5 w-5 (20px)
 * - Desktop: h-4 w-4 (16px)
 */
export function Header({
    title = "Serpul",
    showBack = false,
    showBackLabel = false,
    showChatUs = false,
    showMore = false,
    onMoreClick,
    branding = false,
    showChatUsLabel = false,
    className,
    onBack,
    action,
    transparent = false,
    showLogo = false,
    userName,
    logoPosition = 'center',
    shadow = true,
    backgroundColor,
    // Search
    showSearch = false,
    searchValue = '',
    onSearchChange,
    onSearchSubmit,
    searchPlaceholder = 'Cari...',
    isSearching = false,
    // Refresh
    showRefresh = false,
    isRefreshing = false,
    onRefresh,
}: HeaderProps) {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const handleBack = () => { onBack ? onBack() : navigate(-1); };

    // Focus input when search opens
    React.useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleSearchSubmit = () => {
        if (onSearchSubmit) {
            onSearchSubmit();
        }
    };

    const handleClearSearch = () => {
        if (onSearchChange) {
            onSearchChange('');
        }
        if (!searchValue) {
            setIsSearchOpen(false);
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                    "w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl safe-header-y flex items-center px-4 pointer-events-auto transition-colors duration-300",
                    "justify-center relative flex-col",
                    shadow && !transparent && "shadow-md",
                    transparent ? "bg-transparent shadow-none" : (backgroundColor ? "text-white" : "bg-primary text-primary-foreground"),
                    className
                )}
                style={backgroundColor ? { backgroundColor } : undefined}
            >
                {/* Search Overlay - Full width inside header */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex items-center px-4 z-20"
                            style={{ backgroundColor: backgroundColor || 'hsl(var(--primary))' }}
                        >
                            <div className="relative flex-1">
                                {/* Search Icon Left */}
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 z-10">
                                    <Search className="h-5 w-5" />
                                </div>
                                
                                <Input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => onSearchChange?.(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearchSubmit();
                                        }
                                    }}
                                    placeholder={searchPlaceholder}
                                    className="h-11 w-full pl-12 pr-24 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/30 text-body-md"
                                />
                                
                                {/* Right Actions */}
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    {searchValue && (
                                        <button
                                            onClick={handleClearSearch}
                                            className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsSearchOpen(false)}
                                        className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-label-sm font-medium hover:bg-white/30 transition-colors"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toolbar Content — simetris padding atas & bawah */}
                <div className="header-toolbar w-full flex items-center justify-between">
                    {/* Left Section - Must match Right Section width for perfect centering */}
                    <div className={cn(
                        "flex items-center",
                        showBackLabel ? "min-w-[84px]" : "min-w-[72px]"
                    )}>
                        {showLogo && logoPosition === 'left' ? (
                            <div className="flex items-center gap-2.5">
                                <AppLogo height={32} />
                                <div className="hidden sm:flex flex-col">
                                    <span className="text-label-xs uppercase tracking-widest text-white/50 font-medium leading-none">{getGreeting()}</span>
                                    <span className="text-body-sm text-white/90 font-semibold truncate max-w-[120px] leading-tight mt-0.5">{userName || 'Agen'}</span>
                                </div>
                            </div>
                        ) : showBack ? (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleBack} 
                                className="text-white hover:text-white hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all duration-150 h-9 w-9 lg:w-auto lg:px-2.5 rounded-xl p-0 lg:gap-1.5" 
                                aria-label="Kembali"
                            >
                                <ArrowLeft className="h-5 w-5 lg:h-4 lg:w-4" />
                                {showBackLabel && (
                                    <span className="text-label-xs font-semibold hidden lg:flex lg:items-center">Kembali</span>
                                )}
                            </Button>
                        ) : <div className="w-9" />}
                    </div>

                    {/* Center Section */}
                    <div className="flex-1 flex justify-center min-w-0 px-2">
                        {showLogo && logoPosition === 'center' ? (
                            <AppLogo height={32} />
                        ) : showLogo && logoPosition === 'left' ? null : branding ? (
                            <div className="flex items-center gap-2.5">
                                <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center text-label-md font-bold", transparent ? "bg-gradient-primary text-white" : "bg-white/20 backdrop-blur-sm text-white")}>S</div>
                                <div className="flex flex-col">
                                    <span className="text-body-md font-semibold truncate leading-tight tracking-tight">{title}</span>
                                    <span className="text-label-xs opacity-60 leading-none font-medium">Agen Pulsa & PPOB</span>
                                </div>
                            </div>
                        ) : (
                            <span className={cn("text-heading-lg font-semibold truncate tracking-tight", transparent && "text-white")}>{title}</span>
                        )}
                    </div>

                    {/* Right Section - Mirror width of Left Section for perfect centering */}
                    <div className={cn(
                        "flex items-center gap-0.5 lg:gap-1 justify-end",
                        showBackLabel ? "min-w-[84px]" : "min-w-[72px]"
                    )}>
                        {(() => {
                            const actionButtonCount = action
                                ? (Array.isArray(action) ? action.filter(Boolean).length : 1)
                                : 0;
                            const rightButtonCount = (showChatUs ? 1 : 0) + (showMore ? 1 : 0) + actionButtonCount + (showSearch && !isSearchOpen ? 1 : 0) + (showRefresh ? 1 : 0);
                            const hasMultipleButtons = rightButtonCount >= 2;

                            return (
                                <>
                                    {showSearch && !isSearchOpen && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsSearchOpen(true)}
                                            className={cn(
                                                "text-white hover:text-white hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all duration-150 rounded-xl h-9",
                                                hasMultipleButtons 
                                                    ? "w-9 p-0" 
                                                    : "w-9 lg:w-auto p-0 lg:px-2.5 lg:gap-1.5"
                                            )}
                                            aria-label="Cari"
                                        >
                                            <Search className="h-5 w-5 lg:h-4 lg:w-4" />
                                        </Button>
                                    )}
                                    {showChatUs && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => navigate('/contact-us')}
                                            className={cn(
                                                "text-white hover:text-white hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all duration-150 rounded-xl h-9",
                                                hasMultipleButtons 
                                                    ? "w-9 p-0" 
                                                    : "w-9 lg:w-auto p-0 lg:px-2.5 lg:gap-1.5"
                                            )}
                                            aria-label="Hubungi Kami"
                                        >
                                            <MessageCircle className="h-5 w-5 lg:h-4 lg:w-4" />
                                            {!hasMultipleButtons && showChatUsLabel && (
                                                <span className="text-label-xs font-semibold hidden lg:flex lg:items-center">
                                                    Bantuan
                                                </span>
                                            )}
                                        </Button>
                                    )}
                                    {showMore && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            className="text-white hover:text-white hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all duration-150 rounded-xl h-9 w-9 p-0" 
                                            aria-label="Menu Lainnya"
                                            onClick={onMoreClick}
                                        >
                                            <MoreVertical className="h-5 w-5 lg:h-4 lg:w-4" />
                                        </Button>
                                    )}

                                    {showRefresh && onRefresh && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={onRefresh}
                                            disabled={isRefreshing}
                                            className={cn(
                                                "text-white hover:text-white hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all duration-150 rounded-xl h-9",
                                                hasMultipleButtons 
                                                    ? "w-9 p-0" 
                                                    : "w-9 lg:w-auto p-0 lg:px-2.5 lg:gap-1.5"
                                            )}
                                            aria-label="Refresh"
                                        >
                                            {isRefreshing ? (
                                                <Loader2 className="h-5 w-5 lg:h-4 lg:w-4 animate-spin" />
                                            ) : (
                                                <RefreshCw className="h-5 w-5 lg:h-4 lg:w-4" />
                                            )}
                                            {!hasMultipleButtons && (
                                                <span className="text-label-xs font-semibold hidden lg:flex lg:items-center">
                                                    Refresh
                                                </span>
                                            )}
                                        </Button>
                                    )}
                                    {action && (
                                        <div className={cn(
                                            "action-wrapper",
                                            hasMultipleButtons && "[&_span]:hidden [&_.button-text]:hidden [&_button]:lg:w-9 [&_button]:lg:p-0"
                                        )}>
                                            {action}
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            </motion.header>
        </div>
    );
}
