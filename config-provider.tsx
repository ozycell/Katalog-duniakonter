import { useEffect } from 'react';
import { useConfigStore } from '@/stores/config-store';
import { hexToHsl } from '@/lib/utils';

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const { getConfig } = useConfigStore();
    const config = getConfig();

    // Apply theme color from already-loaded config (set by loadFromStorage on store init)
    // Actual fetch is handled by MainLayout or individual pages
    useEffect(() => {
        if (config?.color_theme) {
            try {
                const hslColor = hexToHsl(config.color_theme);
                document.documentElement.style.setProperty('--primary', hslColor);
            } catch (e) {
                console.error('Failed to apply theme color:', e);
            }
        }
    }, [config]);

    return <>{children}</>;
}
