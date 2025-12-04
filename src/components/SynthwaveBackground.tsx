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

    // Stars
    const stars: { x: number; y: number; size: number; speed: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.6,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1
      });
    }

    const draw = () => {
      time += 0.01;
      
      // Clear with gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0a0015');
      bgGradient.addColorStop(0.3, '#150025');
      bgGradient.addColorStop(0.5, '#1a0030');
      bgGradient.addColorStop(0.7, '#200040');
      bgGradient.addColorStop(1, '#0a0015');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars with twinkle
      stars.forEach((star, i) => {
        const twinkle = Math.sin(time * 2 + i) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.7})`;
        ctx.fill();
        
        // Slow drift
        star.x += star.speed * 0.1;
        if (star.x > canvas.width) star.x = 0;
      });

      // Sun/glow
      const sunY = canvas.height * 0.45;
      const sunGradient = ctx.createRadialGradient(
        canvas.width / 2, sunY, 0,
        canvas.width / 2, sunY, 200
      );
      sunGradient.addColorStop(0, 'rgba(255, 100, 150, 0.8)');
      sunGradient.addColorStop(0.3, 'rgba(255, 50, 100, 0.4)');
      sunGradient.addColorStop(0.6, 'rgba(150, 0, 100, 0.2)');
      sunGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Retro sun with horizontal lines
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, sunY, 120, 0, Math.PI * 2);
      ctx.clip();
      
      const sunFill = ctx.createLinearGradient(
        canvas.width / 2, sunY - 120,
        canvas.width / 2, sunY + 120
      );
      sunFill.addColorStop(0, '#ff6b9d');
      sunFill.addColorStop(0.5, '#ff4081');
      sunFill.addColorStop(1, '#ff1744');
      ctx.fillStyle = sunFill;
      ctx.fillRect(canvas.width / 2 - 120, sunY - 120, 240, 240);
      
      // Sun lines
      ctx.fillStyle = '#0a0015';
      for (let i = 0; i < 8; i++) {
        const lineY = sunY + 20 + i * 15;
        const lineHeight = 3 + i * 1.5;
        ctx.fillRect(canvas.width / 2 - 120, lineY, 240, lineHeight);
      }
      ctx.restore();

      // Horizon glow
      const horizonGradient = ctx.createLinearGradient(
        0, canvas.height * 0.5,
        0, canvas.height * 0.7
      );
      horizonGradient.addColorStop(0, 'rgba(255, 50, 150, 0.3)');
      horizonGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = horizonGradient;
      ctx.fillRect(0, canvas.height * 0.5, canvas.width, canvas.height * 0.2);

      // Grid
      const gridY = canvas.height * 0.55;
      const gridHeight = canvas.height - gridY;
      
      // Perspective grid lines (vertical)
      ctx.strokeStyle = 'rgba(255, 0, 150, 0.4)';
      ctx.lineWidth = 1;
      
      const numVerticalLines = 30;
      const vanishY = gridY;
      const vanishX = canvas.width / 2;
      
      for (let i = -numVerticalLines; i <= numVerticalLines; i++) {
        const bottomX = vanishX + (i * canvas.width / numVerticalLines);
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(bottomX, canvas.height);
        ctx.stroke();
      }

      // Horizontal grid lines with perspective
      const numHorizontalLines = 20;
      for (let i = 0; i < numHorizontalLines; i++) {
        const t = i / numHorizontalLines;
        const y = gridY + Math.pow(t, 1.5) * gridHeight;
        const lineOffset = Math.sin(time + i * 0.5) * 2;
        
        ctx.strokeStyle = `rgba(0, 200, 255, ${0.2 + (1 - t) * 0.3})`;
        ctx.lineWidth = 1 + (1 - t) * 2;
        ctx.beginPath();
        ctx.moveTo(0, y + lineOffset);
        ctx.lineTo(canvas.width, y + lineOffset);
        ctx.stroke();
      }

      // Floating particles
      for (let i = 0; i < 30; i++) {
        const px = ((time * 20 + i * 100) % canvas.width);
        const py = canvas.height * 0.3 + Math.sin(time * 0.5 + i) * 50;
        const size = 2 + Math.sin(time + i) * 1;
        
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 100, 200, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.fill();
      }

      // Ambient glow orbs
      const orbPositions = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, color: 'rgba(100, 0, 255, 0.1)', size: 200 },
        { x: canvas.width * 0.8, y: canvas.height * 0.4, color: 'rgba(255, 0, 150, 0.1)', size: 250 },
        { x: canvas.width * 0.5, y: canvas.height * 0.7, color: 'rgba(0, 150, 255, 0.1)', size: 300 }
      ];

      orbPositions.forEach((orb, i) => {
        const pulseSize = orb.size + Math.sin(time + i) * 30;
        const gradient = ctx.createRadialGradient(
          orb.x + Math.sin(time * 0.3 + i) * 20,
          orb.y + Math.cos(time * 0.3 + i) * 20,
          0,
          orb.x, orb.y, pulseSize
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

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
