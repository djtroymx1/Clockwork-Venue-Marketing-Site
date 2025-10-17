import React from 'react';
import { legalConfig } from '@/lib/legal';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`${legalConfig.brandName} Logo`}
      >
        <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="#F6C744"/>
        <path d="M22 11L16 22L10 11L16 0L22 11Z" fill="#FFDCA8"/>
      </svg>
      <span className="text-2xl font-bold text-foreground">{legalConfig.brandWithMark()}</span>
    </div>
  );
}
