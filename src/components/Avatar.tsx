"use client";

import { User } from 'lucide-react';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const sizes = {
    sm: 'size-8 text-xs',
    md: 'size-10 text-sm',
    lg: 'size-16 text-xl',
    xl: 'size-24 text-2xl'
  };

  return (
    <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-brand/10 bg-brand/5 font-bold text-brand shadow-sm ${sizes[size]} ${className}`}>
      {src ? (
        <Image 
          src={src} 
          alt={name || 'User Avatar'} 
          fill 
          className="object-cover"
        />
      ) : name ? (
        <span>{name[0].toUpperCase()}</span>
      ) : (
        <User className="size-1/2" />
      )}
    </div>
  );
}
