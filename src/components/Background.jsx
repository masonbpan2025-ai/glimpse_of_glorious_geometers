import React, { useEffect, useState } from 'react';

export default function Background() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate normal offset (-0.5 to 0.5)
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate parallax offsets
  const parallaxStyle1 = {
    transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`,
    transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  const parallaxStyle2 = {
    transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
    transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#060a12] via-[#0b172a] to-[#04060b] -z-10">
      {/* Ambient Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #e9c46a 1px, transparent 1px),
            linear-gradient(to bottom, #e9c46a 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          ...parallaxStyle2
        }}
      />

      {/* Floating Constellation Stars */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={parallaxStyle1}>
        {/* Constellation lines */}
        <line x1="20%" y1="30%" x2="35%" y2="20%" stroke="#e9c46a" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="35%" y1="20%" x2="50%" y2="45%" stroke="#e9c46a" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="50%" y1="45%" x2="40%" y2="70%" stroke="#e9c46a" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="40%" y1="70%" x2="20%" y2="30%" stroke="#e9c46a" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="65%" y1="15%" x2="80%" y2="25%" stroke="#e76f51" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="80%" y1="25%" x2="75%" y2="60%" stroke="#e76f51" strokeWidth="0.5" strokeDasharray="4 4" />

        {/* Stars */}
        <circle cx="20%" cy="30%" r="2" fill="#e9c46a" className="animate-pulse" />
        <circle cx="35%" cy="20%" r="3" fill="#ffffff" />
        <circle cx="50%" cy="45%" r="2" fill="#e9c46a" />
        <circle cx="40%" cy="70%" r="4" fill="#ffffff" className="animate-pulse" />
        <circle cx="65%" cy="15%" r="3" fill="#e76f51" />
        <circle cx="80%" cy="25%" r="2.5" fill="#ffffff" />
        <circle cx="75%" cy="60%" r="3.5" fill="#e76f51" className="animate-pulse" />
      </svg>

      {/* Rotating Sacred Astrolabe / Geometry Wheel */}
      <div 
        className="absolute -right-40 -bottom-40 md:right-[-200px] md:bottom-[-200px] w-[600px] h-[600px] md:w-[850px] md:h-[850px] opacity-15 pointer-events-none"
        style={parallaxStyle2}
      >
        <svg 
          viewBox="0 0 500 500" 
          className="w-full h-full animate-spin-slow text-[#e9c46a]"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.75"
        >
          {/* Inner circle grids */}
          <circle cx="250" cy="250" r="230" strokeDasharray="4 4" />
          <circle cx="250" cy="250" r="200" />
          <circle cx="250" cy="250" r="160" strokeDasharray="10 5" />
          <circle cx="250" cy="250" r="120" />
          <circle cx="250" cy="250" r="80" strokeDasharray="2 2" />
          <circle cx="250" cy="250" r="40" />

          {/* Golden ratio spiral outline overlay */}
          <path 
            d="M250,250 A40,40 0 0,1 290,250 A80,80 0 0,1 250,330 A160,160 0 0,1 90,250 A200,200 0 0,1 250,50" 
            stroke="#e76f51" 
            strokeWidth="1.25" 
            strokeDasharray="2 4"
          />

          {/* Astrolabe spokes */}
          <line x1="250" y1="20" x2="250" y2="480" />
          <line x1="20" y1="250" x2="480" y2="250" />
          <line x1="87.4" y1="87.4" x2="412.6" y2="412.6" strokeDasharray="4 4" />
          <line x1="87.4" y1="412.6" x2="412.6" y2="87.4" strokeDasharray="4 4" />

          {/* Compass layout ticks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 10 * Math.PI) / 180;
            const x1 = 250 + 200 * Math.cos(angle);
            const y1 = 250 + 200 * Math.sin(angle);
            const x2 = 250 + 215 * Math.cos(angle);
            const y2 = 250 + 215 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>
      </div>

      {/* Floating Pyramids Overlay in Bottom Left */}
      <div 
        className="absolute left-[-50px] bottom-[-50px] w-[350px] h-[350px] md:w-[500px] md:h-[500px] opacity-[0.08] pointer-events-none"
        style={parallaxStyle1}
      >
        <svg 
          viewBox="0 0 200 200" 
          className="w-full h-full text-[#e76f51]"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1"
        >
          {/* Main Pyramid wireframe */}
          <polygon points="100,20 180,160 20,160" />
          <line x1="100" y1="20" x2="100" y2="160" />
          {/* Internal geometry overlays */}
          <line x1="20" y1="160" x2="100" y2="90" strokeDasharray="2 2" />
          <line x1="180" y1="160" x2="100" y2="90" strokeDasharray="2 2" />
          <circle cx="100" cy="113" r="47" stroke="#e9c46a" strokeDasharray="3 3" />
          
          {/* Mathematical height indicator */}
          <line x1="100" y1="20" x2="120" y2="20" stroke="#e9c46a" />
          <line x1="100" y1="160" x2="120" y2="160" stroke="#e9c46a" />
          <line x1="115" y1="20" x2="115" y2="160" stroke="#e9c46a" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* Radial ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#e9c46a]/[0.02] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-[#e76f51]/[0.02] blur-[120px] pointer-events-none" />
    </div>
  );
}
