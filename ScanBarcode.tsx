import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, X } from 'lucide-react';
import { isCapacitor } from '@/lib/capacitor';
import { toast } from 'sonner';

interface ScanBarcodeProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (value: string) => void;
  title?: string;
  placeholder?: string;
}

let BrowserMultiFormatReader: any = null;

export function ScanBarcode({
  isOpen,
  onClose,
  onScan,
  title = 'Scan Barcode'
}: ScanBarcodeProps) {
  // ============================================================
  // NATIVE PATH: Capacitor APK
  // ============================================================
  React.useEffect(() => {
    if (!isOpen || !isCapacitor()) return;

    let cancelled = false;

    const scanNative = async () => {
      try {
        const { CapacitorBarcodeScanner, CapacitorBarcodeScannerAndroidScanningLibrary } = await import(
          '@capacitor/barcode-scanner'
        );

        const result = await CapacitorBarcodeScanner.scanBarcode({
          hint: 17, // ALL formats
          scanInstructions: 'Arahkan kamera ke barcode/QR code',
          scanButton: false,
          cameraDirection: 1, // BACK
          scanOrientation: 1, // PORTRAIT
          android: {
            scanningLibrary: CapacitorBarcodeScannerAndroidScanningLibrary.ZXING,
          },
        });

        if (cancelled) return;

        if (result?.ScanResult) {
          onScan(result.ScanResult);
        }
      } catch (error: any) {
        if (cancelled) return;
        // User cancelled or error
        if (error?.message?.includes('cancel') || error?.message?.includes('User')) {
          // Silent on user cancel
        } else {
          console.error('[ScanBarcode] Native scan error:', error);
          toast.error('Gagal memindai barcode');
        }
      } finally {
        if (!cancelled) {
          onClose();
        }
      }
    };

    scanNative();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // ============================================================
  // WEB PATH: ZXing Browser
  // ============================================================
  const [hasCamera, setHasCamera] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [facingMode, setFacingMode] = React.useState<'environment' | 'user'>('environment');
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const controlsRef = React.useRef<any>(null);
  const isActiveRef = React.useRef(false);

  // Load library
  React.useEffect(() => {
    if (!BrowserMultiFormatReader && typeof window !== 'undefined') {
      import('@zxing/browser').then(m => {
        BrowserMultiFormatReader = m.BrowserMultiFormatReader;
      });
    }
  }, []);

  // Start camera when opened (web only)
  React.useEffect(() => {
    if (isCapacitor()) return; // Native handles its own flow

    if (isOpen) {
      isActiveRef.current = true;
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);

      // Try environment (back) camera first
      let stream: MediaStream | null = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      } catch {
        // Fallback to any available camera
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } }
          });
        } catch {
          setHasCamera(false);
          setIsLoading(false);
          return;
        }
      }

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setHasCamera(true);
      setIsLoading(false);

      // Start scanning
      startScanning();
    } catch (err) {
      console.error('Camera error:', err);
      setHasCamera(false);
      setIsLoading(false);
    }
  };

  const startScanning = async () => {
    if (!videoRef.current || !isActiveRef.current || !BrowserMultiFormatReader) {
      if (!BrowserMultiFormatReader && isActiveRef.current) {
        setTimeout(startScanning, 500);
      }
      return;
    }

    try {
      const reader = new BrowserMultiFormatReader();

      controlsRef.current = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result: any) => {
          if (result?.getText() && isActiveRef.current) {
            handleScan(result.getText());
          }
        }
      );
    } catch (err) {
      console.error('Scan error:', err);
    }
  };

  const stopCamera = () => {
    isActiveRef.current = false;

    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch {}
      controlsRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  };

  const handleScan = (value: string) => {
    stopCamera();
    onScan(value);
    onClose();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const toggleCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleRetry = () => {
    setHasCamera(true);
    startCamera();
  };

  // Native path: don't render any UI, let the plugin handle it
  if (isCapacitor()) {
    return null;
  }

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0 [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-body-md font-semibold">{title}</span>
          <button
            onClick={handleClose}
            className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
            aria-label="Tutup"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Camera View */}
        <div className="p-4">
          <div className="relative aspect-[4/3] bg-black overflow-hidden rounded-xl">
            {hasCamera ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Scan Overlay - Corner markers only */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-[20%] left-[10%] w-16 h-16 border-l-4 border-t-4 border-primary rounded-tl-xl" />
                  <div className="absolute top-[20%] right-[10%] w-16 h-16 border-r-4 border-t-4 border-primary rounded-tr-xl" />
                  <div className="absolute bottom-[20%] left-[10%] w-16 h-16 border-l-4 border-b-4 border-primary rounded-bl-xl" />
                  <div className="absolute bottom-[20%] right-[10%] w-16 h-16 border-r-4 border-b-4 border-primary rounded-br-xl" />

                  <motion.div
                    className="absolute left-[10%] right-[10%] h-0.5 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]"
                    initial={{ top: '20%' }}
                    animate={{ top: ['20%', '80%', '20%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  />
                </div>

                {/* Camera toggle button */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm border-0"
                    onClick={toggleCamera}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Ganti Kamera
                  </Button>
                </div>

                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <RefreshCw className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white p-8 text-center">
                <Camera className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-body-sm opacity-80 mb-3">Tidak dapat mengakses kamera</p>
                <Button variant="secondary" onClick={handleRetry}>
                  Coba Lagi
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Supported formats info */}
        <div className="px-4 pb-4 text-center">
          <p className="text-caption text-muted-foreground">
            Mendukung: QR Code, EAN-13, EAN-8, Code 128, Code 39, Code 93, ITF, UPC, Data Matrix, PDF417, Aztec
          </p>
        </div>

        {/* Cancel button */}
        <div className="px-4 pb-4">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl"
            onClick={handleClose}
          >
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useScanBarcode() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [callback, setCallback] = React.useState<((value: string) => void) | null>(null);

  const openScanner = (onScan: (value: string) => void) => {
    setCallback(() => onScan);
    setIsOpen(true);
  };

  const closeScanner = () => {
    setIsOpen(false);
    setCallback(null);
  };

  const handleScan = (value: string) => {
    if (callback) callback(value);
    closeScanner();
  };

  return {
    isOpen,
    openScanner,
    closeScanner,
    handleScan,
    ScanBarcodeComponent: (
      <ScanBarcode
        isOpen={isOpen}
        onClose={closeScanner}
        onScan={handleScan}
      />
    )
  };
}

export default ScanBarcode;
