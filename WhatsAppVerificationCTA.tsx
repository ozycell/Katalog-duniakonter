import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AppService } from '@/services/app-service';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    phoneNumber: string; // The user's phone number
    onAlreadySent: () => void;
    ctaText?: string;
    ctaNumber?: string;
}

export function WhatsAppVerificationCTA({ phoneNumber, onAlreadySent, ctaText, ctaNumber }: Props) {
    const [botNumber, setBotNumber] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const text = ctaText ? encodeURIComponent(ctaText) : 'Kirim%20OTP';
        
        if (ctaNumber) {
            const cleanNumber = ctaNumber.replace(/\D/g, '');
            setBotNumber(`https://wa.me/${cleanNumber}?text=${text}`);
            setLoading(false);
            return;
        }

        // Fetch care center to get bot number
        AppService.getContactCenter().then((res: any) => {
            // Karena interceptor Axios mengembalikan response.data langsung, 
            // maka res sudah berisi { status, data: [...] }
            let data = [];
            if (Array.isArray(res?.data)) {
                data = res.data;
            } else if (Array.isArray(res?.data?.data)) {
                data = res.data.data;
            } else if (Array.isArray(res)) {
                data = res;
            }
            // Cari item yang url_redirect mengandung wa.me ATAU whatsapp.com/send
            const wa = data.find((item: any) => {
                if (!item.url_redirect) return false;
                return item.url_redirect.includes('wa.me') || item.url_redirect.includes('whatsapp.com');
            });

            if (wa) {
                let urlString = wa.url_redirect;
                if (!urlString.startsWith('http')) {
                    urlString = `https://${urlString}`;
                }
                
                // Append text parameter
                const separator = urlString.includes('?') ? '&' : '?';
                const finalUrl = `${urlString}${separator}text=${text}`;
                
                setBotNumber(finalUrl); // Disimpan seluruh URL-nya
            }
        }).catch(err => {
            console.error("Failed to get care center", err);
        }).finally(() => {
            setLoading(false);
        });
    }, [ctaNumber, ctaText]);

    const handleOpenWhatsApp = () => {
        if (!botNumber) {
            console.warn("URL WhatsApp bot belum tersedia");
            return;
        }
        
        // Coba buka dengan _system (untuk Capacitor/Cordova) jika tidak bisa fallback ke _blank
        if (window.hasOwnProperty('cordova') || (window as any).Capacitor) {
            window.open(botNumber, '_system');
        } else {
            window.open(botNumber, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center space-y-6 py-4 flex-1 flex flex-col justify-center"
        >
             <div className="w-20 h-20 bg-[#25D366]/10 dark:bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
             </div>
             
             <div>
                <h3 className="text-heading-lg font-bold text-foreground tracking-tight">Verifikasi WhatsApp</h3>
                <p className="text-body-sm text-muted-foreground mt-2 leading-relaxed px-4">
                    Pesan otomatis telah kami siapkan. Buka WhatsApp dan ketuk tombol kirim pesan berisi teks <strong className="text-foreground font-semibold">Kirim OTP</strong> ke nomor resmi kami.
                </p>
             </div>
             
             <div className="space-y-3 pt-6 w-full max-w-sm mx-auto px-4 mt-auto mb-4">
                 <Button 
                    className="w-full h-12 shadow-lg hover:shadow-xl bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold transition-all hover:-translate-y-0.5 active:scale-95" 
                    onClick={handleOpenWhatsApp}
                 >
                     Buka WhatsApp & Kirim
                 </Button>
                 <Button 
                    variant="outline" 
                    className="w-full h-12 font-medium" 
                    onClick={onAlreadySent}
                 >
                     Saya Sudah Mengirim Pesan
                 </Button>
             </div>
        </motion.div>
    );
}
