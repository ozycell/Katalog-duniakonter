import * as React from 'react';
import { SafeImage } from '@/components/ui/safe-image';

interface LogoImageProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fallback?: React.ReactNode;
}

const sizeMap = {
  sm: { container: 'h-9 w-9', width: 36, height: 36 },
  md: { container: 'h-10 w-10', width: 40, height: 40 },
  lg: { container: 'h-12 w-12', width: 48, height: 48 },
};

export function LogoImage({ src, alt = '', size = 'md', className, fallback }: LogoImageProps) {
  const { container, width, height } = sizeMap[size];
  
  return (
    <div className={`${container} rounded-xl overflow-hidden flex items-center justify-center ${className || ''}`}>
      <SafeImage 
        src={src} 
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-contain"
        fallbackClassName="h-full w-full"
        fallback={fallback}
      />
    </div>
  );
}
