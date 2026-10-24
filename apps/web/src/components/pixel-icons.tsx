import * as React from 'react';

interface PixelIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Pixel-art icon: Přímé těsto (Direct single-phase dough mixing)
 */
export function PixelDirectIcon({ className = 'w-6 h-6', ...props }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      {/* Bowl background */}
      <g fill="#475569">
        <rect x={3} y={9} width={14} height={2} />
        <rect x={4} y={11} width={12} height={4} />
        <rect x={6} y={15} width={8} height={2} />
        <rect x={7} y={17} width={6} height={1} />
      </g>
      {/* Bowl highlight / rim */}
      <g fill="#94A3B8">
        <rect x={2} y={8} width={16} height={1} />
        <rect x={4} y={11} width={1} height={4} />
      </g>
      {/* Dough inside bowl */}
      <g fill="#EAD9B8">
        <rect x={5} y={5} width={10} height={4} />
        <rect x={6} y={4} width={8} height={2} />
        <rect x={7} y={3} width={6} height={1} />
      </g>
      {/* Dough shadow / texture */}
      <g fill="#C9B48F">
        <rect x={6} y={7} width={8} height={2} />
        <rect x={8} y={4} width={2} height={1} />
      </g>
      {/* Outline */}
      <g fill="#000000">
        <rect x={7} y={2} width={6} height={1} />
        <rect x={6} y={3} width={1} height={1} />
        <rect x={13} y={3} width={1} height={1} />
        <rect x={5} y={4} width={1} height={1} />
        <rect x={14} y={4} width={1} height={1} />
        <rect x={1} y={7} width={18} height={1} />
        <rect x={2} y={8} width={1} height={2} />
        <rect x={17} y={8} width={1} height={2} />
        <rect x={3} y={10} width={1} height={3} />
        <rect x={16} y={10} width={1} height={3} />
        <rect x={4} y={13} width={1} height={2} />
        <rect x={15} y={13} width={1} height={2} />
        <rect x={5} y={15} width={1} height={2} />
        <rect x={14} y={15} width={1} height={2} />
        <rect x={6} y={17} width={1} height={1} />
        <rect x={13} y={17} width={1} height={1} />
        <rect x={6} y={18} width={8} height={1} />
      </g>
    </svg>
  );
}

/**
 * Pixel-art icon: Biga (Stiff preferment jagged pieces)
 */
export function PixelBigaIcon({ className = 'w-6 h-6', ...props }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      {/* Box container */}
      <g fill="#B45309">
        <rect x={3} y={11} width={14} height={6} />
      </g>
      <g fill="#D97706">
        <rect x={2} y={10} width={16} height={2} />
      </g>
      {/* Jagged dry Biga chunks */}
      <g fill="#F3E5C8">
        <rect x={4} y={5} width={3} height={3} />
        <rect x={8} y={3} width={4} height={4} />
        <rect x={13} y={6} width={3} height={3} />
        <rect x={6} y={7} width={8} height={3} />
      </g>
      {/* Shaded Biga chunks */}
      <g fill="#C7AD80">
        <rect x={5} y={6} width={2} height={2} />
        <rect x={9} y={5} width={3} height={2} />
        <rect x={14} y={7} width={2} height={2} />
        <rect x={7} y={9} width={6} height={2} />
      </g>
      {/* Outlines */}
      <g fill="#000000">
        <rect x={8} y={2} width={4} height={1} />
        <rect x={4} y={4} width={3} height={1} />
        <rect x={13} y={5} width={3} height={1} />
        <rect x={1} y={9} width={18} height={1} />
        <rect x={1} y={10} width={1} height={3} />
        <rect x={18} y={10} width={1} height={3} />
        <rect x={2} y={13} width={1} height={4} />
        <rect x={17} y={13} width={1} height={4} />
        <rect x={2} y={17} width={16} height={1} />
      </g>
    </svg>
  );
}

/**
 * Pixel-art icon: Poolish (Bubbling liquid preferment jar)
 */
export function PixelPoolishIcon({ className = 'w-6 h-6', ...props }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      {/* Glass Jar Body */}
      <g fill="#93C5FD">
        <rect x={6} y={2} width={8} height={2} />
        <rect x={5} y={4} width={10} height={13} />
      </g>
      {/* Liquid Poolish */}
      <g fill="#FEF3C7">
        <rect x={6} y={7} width={8} height={9} />
      </g>
      {/* Fermentation bubbles */}
      <g fill="#F59E0B">
        <rect x={7} y={9} width={2} height={2} />
        <rect x={11} y={8} width={2} height={2} />
        <rect x={8} y={13} width={2} height={2} />
        <rect x={12} y={12} width={1} height={1} />
        <rect x={9} y={5} width={1} height={1} />
      </g>
      {/* Jar lid */}
      <g fill="#D84A1B">
        <rect x={5} y={1} width={10} height={2} />
      </g>
      {/* Outline */}
      <g fill="#000000">
        <rect x={5} y={0} width={10} height={1} />
        <rect x={4} y={1} width={1} height={2} />
        <rect x={15} y={1} width={1} height={2} />
        <rect x={4} y={3} width={1} height={14} />
        <rect x={15} y={3} width={1} height={14} />
        <rect x={5} y={17} width={10} height={1} />
      </g>
    </svg>
  );
}

/**
 * Pixel-art icon: Fáze 1 (Preferment / Jar)
 */
export function PixelPhase1Icon({ className = 'w-4 h-4', ...props }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <g fill="#D84A1B">
        <rect x={4} y={1} width={8} height={2} />
      </g>
      <g fill="#BAE6FD">
        <rect x={4} y={3} width={8} height={10} />
      </g>
      <g fill="#FEF3C7">
        <rect x={5} y={6} width={6} height={6} />
      </g>
      <g fill="#F59E0B">
        <rect x={6} y={7} width={1} height={1} />
        <rect x={8} y={9} width={1} height={1} />
        <rect x={7} y={10} width={1} height={1} />
      </g>
      <g fill="#000000">
        <rect x={3} y={0} width={10} height={1} />
        <rect x={3} y={1} width={1} height={2} />
        <rect x={12} y={1} width={1} height={2} />
        <rect x={3} y={3} width={1} height={11} />
        <rect x={12} y={3} width={1} height={11} />
        <rect x={4} y={14} width={8} height={1} />
      </g>
    </svg>
  );
}

/**
 * Pixel-art icon: Fáze 2 (Final Dough on Peel)
 */
export function PixelPhase2Icon({ className = 'w-4 h-4', ...props }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      {/* Wooden Peel */}
      <g fill="#B45309">
        <rect x={2} y={9} width={12} height={4} />
        <rect x={7} y={13} width={2} height={3} />
      </g>
      {/* Smooth Dough Ball */}
      <g fill="#FEF3C7">
        <rect x={5} y={3} width={6} height={6} />
        <rect x={4} y={4} width={8} height={4} />
      </g>
      {/* Dough Shadow */}
      <g fill="#E2C99A">
        <rect x={5} y={7} width={6} height={2} />
      </g>
      {/* Outline */}
      <g fill="#000000">
        <rect x={5} y={2} width={6} height={1} />
        <rect x={4} y={3} width={1} height={1} />
        <rect x={11} y={3} width={1} height={1} />
        <rect x={3} y={4} width={1} height={4} />
        <rect x={12} y={4} width={1} height={4} />
        <rect x={1} y={8} width={14} height={1} />
        <rect x={1} y={9} width={1} height={4} />
        <rect x={14} y={9} width={1} height={4} />
        <rect x={6} y={13} width={1} height={3} />
        <rect x={9} y={13} width={1} height={3} />
        <rect x={6} y={15} width={4} height={1} />
      </g>
    </svg>
  );
}

/**
 * Pixel-art icon: Domácí trouba (Home Oven max 250°C)
 */
export function PixelHomeOvenIcon({ className = 'w-6 h-6', ...props }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      {/* Oven Frame */}
      <g fill="#64748B">
        <rect x={2} y={2} width={16} height={16} />
      </g>
      {/* Knobs */}
      <g fill="#CBD5E1">
        <rect x={4} y={4} width={2} height={2} />
        <rect x={8} y={4} width={2} height={2} />
        <rect x={14} y={4} width={2} height={2} />
      </g>
      {/* Oven Window (warm glow 250°C) */}
      <g fill="#EA580C">
        <rect x={4} y={8} width={12} height={8} />
      </g>
      <g fill="#FBBF24">
        <rect x={6} y={10} width={8} height={4} />
      </g>
      {/* Outline */}
      <g fill="#000000">
        <rect x={2} y={1} width={16} height={1} />
        <rect x={1} y={2} width={1} height={16} />
        <rect x={18} y={2} width={1} height={16} />
        <rect x={2} y={18} width={16} height={1} />
        <rect x={3} y={7} width={14} height={1} />
      </g>
    </svg>
  );
}

/**
 * Pixel-art icon: Dedikovaná pizza trouba (Pizza Oven 400–450°C)
 */
export function PixelPizzaOvenIcon({ className = 'w-6 h-6', ...props }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      {/* Compact Ooni-style Arch Body */}
      <g fill="#334155">
        <rect x={3} y={6} width={14} height={10} />
        <rect x={5} y={4} width={10} height={2} />
      </g>
      {/* Chimney */}
      <g fill="#1E293B">
        <rect x={12} y={1} width={2} height={4} />
      </g>
      {/* Glowing Mouth (450°C) */}
      <g fill="#F97316">
        <rect x={5} y={10} width={10} height={5} />
      </g>
      <g fill="#FEF08A">
        <rect x={7} y={12} width={6} height={3} />
      </g>
      {/* Legs */}
      <g fill="#000000">
        <rect x={3} y={16} width={2} height={3} />
        <rect x={15} y={16} width={2} height={3} />
        <rect x={5} y={3} width={10} height={1} />
        <rect x={2} y={6} width={1} height={10} />
        <rect x={17} y={6} width={1} height={10} />
      </g>
    </svg>
  );
}

/**
 * Pixel-art icon: Pec na dřevo / AVPN Verace (Wood-fired 485°C)
 */
export function PixelWoodOvenIcon({ className = 'w-6 h-6', ...props }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      {/* Brick Dome */}
      <g fill="#9A3412">
        <rect x={6} y={2} width={8} height={3} />
        <rect x={4} y={5} width={12} height={3} />
        <rect x={2} y={8} width={16} height={9} />
      </g>
      {/* Brick Texture Highlights */}
      <g fill="#C2410C">
        <rect x={5} y={3} width={2} height={1} />
        <rect x={10} y={3} width={2} height={1} />
        <rect x={4} y={6} width={3} height={1} />
        <rect x={12} y={6} width={3} height={1} />
      </g>
      {/* Fire mouth (485°C roaring flames) */}
      <g fill="#000000">
        <rect x={5} y={10} width={10} height={7} />
      </g>
      <g fill="#EF4444">
        <rect x={6} y={12} width={8} height={5} />
      </g>
      <g fill="#F59E0B">
        <rect x={7} y={13} width={6} height={4} />
      </g>
      <g fill="#FEF08A">
        <rect x={8} y={14} width={4} height={3} />
      </g>
      {/* Outline */}
      <g fill="#000000">
        <rect x={6} y={1} width={8} height={1} />
        <rect x={4} y={2} width={2} height={1} />
        <rect x={14} y={2} width={2} height={1} />
        <rect x={2} y={4} width={2} height={1} />
        <rect x={16} y={4} width={2} height={1} />
        <rect x={1} y={7} width={1} height={10} />
        <rect x={18} y={7} width={1} height={10} />
        <rect x={1} y={17} width={18} height={1} />
      </g>
    </svg>
  );
}
