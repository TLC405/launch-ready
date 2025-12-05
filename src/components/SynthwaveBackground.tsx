import { useEffect, useRef } from 'react';

export function SynthwaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Enhanced star field with multiple layers
    interface Star {
      x: number;
      y: number;
      z: number;
      size: number;
      speed: number;
      color: string;
      twinkleSpeed: number;
    }

    const stars: Star[] = [];
    const starColors = [
      'rgba(255, 255, 255, 1)',
      'rgba(200, 220, 255, 1)',
      'rgba(255, 200, 200, 1)',
      'rgba(200, 255, 255, 1)',
      'rgba(255, 220, 180, 1)',
    ];

    // Create 3 layers of stars
    for (let i = 0; i < 400; i++) {
      const z = Math.random();
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.65,
        z,
        size: (1 - z) * 2.5 + 0.5,
        speed: (1 - z) * 0.3 + 0.05,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        twinkleSpeed: Math.random() * 3 + 1
      });
    }

    // Nebula clouds
    interface Nebula {
      x: number;
      y: number;
      radius: number;
      color1: string;
      color2: string;
      phase: number;
      speed: number;
    }

    const nebulae: Nebula[] = [
      { x: 0.15, y: 0.2, radius: 400, color1: 'rgba(100, 0, 180, 0.08)', color2: 'rgba(50, 0, 100, 0)', phase: 0, speed: 0.0003 },
      { x: 0.85, y: 0.25, radius: 350, color1: 'rgba(180, 0, 100, 0.06)', color2: 'rgba(100, 0, 50, 0)', phase: 2, speed: 0.0004 },
      { x: 0.5, y: 0.15, radius: 500, color1: 'rgba(0, 80, 180, 0.05)', color2: 'rgba(0, 40, 100, 0)', phase: 4, speed: 0.0002 },
      { x: 0.3, y: 0.4, radius: 300, color1: 'rgba(150, 50, 200, 0.04)', color2: 'rgba(75, 25, 100, 0)', phase: 1, speed: 0.0005 },
      { x: 0.7, y: 0.35, radius: 280, color1: 'rgba(200, 100, 150, 0.05)', color2: 'rgba(100, 50, 75, 0)', phase: 3, speed: 0.0003 },
    ];

    // Shooting stars
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      active: boolean;
      angle: number;
      opacity: number;
    }

    const shootingStars: ShootingStar[] = [];
    for (let i = 0; i < 3; i++) {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.4,
        length: 80 + Math.random() * 60,
        speed: 8 + Math.random() * 6,
        active: false,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 0
      });
    }

    const draw = () => {
      time += 0.016;
      
      // Deep space gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#030008');
      bgGradient.addColorStop(0.2, '#080015');
      bgGradient.addColorStop(0.4, '#0c0020');
      bgGradient.addColorStop(0.55, '#100030');
      bgGradient.addColorStop(0.7, '#150040');
      bgGradient.addColorStop(0.85, '#180050');
      bgGradient.addColorStop(1, '#0a0020');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebulae (background layer)
      nebulae.forEach((nebula) => {
        const pulseScale = 1 + Math.sin(time * nebula.speed * 1000 + nebula.phase) * 0.15;
        const offsetX = Math.sin(time * 0.1 + nebula.phase) * 30;
        const offsetY = Math.cos(time * 0.08 + nebula.phase) * 20;
        
        const gradient = ctx.createRadialGradient(
          nebula.x * canvas.width + offsetX,
          nebula.y * canvas.height + offsetY,
          0,
          nebula.x * canvas.width + offsetX,
          nebula.y * canvas.height + offsetY,
          nebula.radius * pulseScale
        );
        gradient.addColorStop(0, nebula.color1);
        gradient.addColorStop(0.5, nebula.color1.replace('0.0', '0.0'));
        gradient.addColorStop(1, nebula.color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Draw stars with parallax and twinkle
      stars.forEach((star) => {
        const twinkle = (Math.sin(time * star.twinkleSpeed) + 1) / 2;
        const size = star.size * (0.5 + twinkle * 0.5);
        const alpha = 0.3 + twinkle * 0.7;
        
        // Star glow
        if (star.size > 1.5) {
          const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 4);
          glowGradient.addColorStop(0, star.color.replace('1)', `${alpha * 0.5})`));
          glowGradient.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGradient;
          ctx.fillRect(star.x - size * 4, star.y - size * 4, size * 8, size * 8);
        }
        
        // Star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fillStyle = star.color.replace('1)', `${alpha})`);
        ctx.fill();
        
        // Parallax movement
        star.x += star.speed * 0.3;
        if (star.x > canvas.width + 10) star.x = -10;
      });

      // Shooting stars
      shootingStars.forEach((ss) => {
        if (!ss.active && Math.random() < 0.001) {
          ss.active = true;
          ss.x = Math.random() * canvas.width * 0.7;
          ss.y = Math.random() * canvas.height * 0.3;
          ss.opacity = 1;
        }
        
        if (ss.active) {
          const gradient = ctx.createLinearGradient(
            ss.x, ss.y,
            ss.x - Math.cos(ss.angle) * ss.length,
            ss.y + Math.sin(ss.angle) * ss.length
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.moveTo(ss.x, ss.y);
          ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.length, ss.y + Math.sin(ss.angle) * ss.length);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          ss.x += Math.cos(ss.angle) * ss.speed;
          ss.y += Math.sin(ss.angle) * ss.speed;
          ss.opacity -= 0.015;
          
          if (ss.opacity <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
            ss.active = false;
          }
        }
      });

      // Retro sun with premium gradient
      const sunY = canvas.height * 0.48;
      const sunX = canvas.width / 2;
      const sunRadius = Math.min(150, canvas.width * 0.12);
      
      // Sun outer glow
      const sunOuterGlow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.8, sunX, sunY, sunRadius * 3);
      sunOuterGlow.addColorStop(0, 'rgba(255, 80, 120, 0.3)');
      sunOuterGlow.addColorStop(0.3, 'rgba(255, 50, 100, 0.15)');
      sunOuterGlow.addColorStop(0.6, 'rgba(200, 0, 100, 0.05)');
      sunOuterGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sunOuterGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sun core with scan lines
      ctx.save();
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.clip();
      
      const sunGradient = ctx.createLinearGradient(sunX, sunY - sunRadius, sunX, sunY + sunRadius);
      sunGradient.addColorStop(0, '#ff8c94');
      sunGradient.addColorStop(0.3, '#ff6b7a');
      sunGradient.addColorStop(0.5, '#ff4d6a');
      sunGradient.addColorStop(0.7, '#ff2d5a');
      sunGradient.addColorStop(1, '#d41050');
      ctx.fillStyle = sunGradient;
      ctx.fillRect(sunX - sunRadius, sunY - sunRadius, sunRadius * 2, sunRadius * 2);
      
      // Horizontal scan lines on sun
      ctx.fillStyle = 'rgba(3, 0, 8, 0.9)';
      const lineCount = 10;
      for (let i = 0; i < lineCount; i++) {
        const lineY = sunY + (i / lineCount) * sunRadius * 0.8 + sunRadius * 0.15;
        const lineHeight = 2 + (i / lineCount) * 4;
        ctx.fillRect(sunX - sunRadius, lineY, sunRadius * 2, lineHeight);
      }
      ctx.restore();

      // Horizon glow
      const horizonGradient = ctx.createLinearGradient(0, canvas.height * 0.48, 0, canvas.height * 0.65);
      horizonGradient.addColorStop(0, 'rgba(255, 50, 100, 0.2)');
      horizonGradient.addColorStop(0.5, 'rgba(200, 0, 150, 0.1)');
      horizonGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = horizonGradient;
      ctx.fillRect(0, canvas.height * 0.48, canvas.width, canvas.height * 0.17);

      // Premium perspective grid
      const gridY = canvas.height * 0.55;
      const gridHeight = canvas.height - gridY;
      const vanishY = gridY - 20;
      const vanishX = canvas.width / 2;
      
      // Vertical perspective lines
      const numVerticalLines = 40;
      for (let i = -numVerticalLines; i <= numVerticalLines; i++) {
        const bottomX = vanishX + (i * canvas.width * 1.5 / numVerticalLines);
        const distanceFromCenter = Math.abs(i) / numVerticalLines;
        const alpha = 0.4 - distanceFromCenter * 0.3;
        
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(bottomX, canvas.height + 50);
        ctx.strokeStyle = `rgba(255, 0, 150, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Horizontal grid lines with wave animation
      const numHorizontalLines = 25;
      for (let i = 0; i < numHorizontalLines; i++) {
        const t = i / numHorizontalLines;
        const y = gridY + Math.pow(t, 1.3) * gridHeight;
        const wave = Math.sin(time * 2 + i * 0.3) * (1 - t) * 3;
        const alpha = 0.15 + (1 - t) * 0.35;
        const lineWidth = 0.5 + (1 - t) * 2.5;
        
        // Main line
        ctx.beginPath();
        ctx.moveTo(0, y + wave);
        ctx.lineTo(canvas.width, y + wave);
        ctx.strokeStyle = `rgba(0, 220, 255, ${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        
        // Glow line
        if (lineWidth > 1.5) {
          ctx.beginPath();
          ctx.moveTo(0, y + wave);
          ctx.lineTo(canvas.width, y + wave);
          ctx.strokeStyle = `rgba(0, 220, 255, ${alpha * 0.3})`;
          ctx.lineWidth = lineWidth * 3;
          ctx.stroke();
        }
      }

      // Floating light particles
      for (let i = 0; i < 50; i++) {
        const px = ((time * 15 + i * 73) % (canvas.width + 100)) - 50;
        const py = canvas.height * 0.25 + Math.sin(time * 0.4 + i * 0.7) * 80;
        const pz = (Math.sin(i * 0.5) + 1) / 2;
        const size = 1.5 + pz * 2;
        const alpha = 0.2 + pz * 0.4;
        
        const particleGradient = ctx.createRadialGradient(px, py, 0, px, py, size * 3);
        particleGradient.addColorStop(0, `rgba(255, 150, 220, ${alpha})`);
        particleGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = particleGradient;
        ctx.fillRect(px - size * 3, py - size * 3, size * 6, size * 6);
        
        ctx.beginPath();
        ctx.arc(px, py, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 255, ${alpha})`;
        ctx.fill();
      }

      // Subtle vignette
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
        canvas.width / 2, canvas.height / 2, canvas.height
      );
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
