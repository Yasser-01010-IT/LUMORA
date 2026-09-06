import { useEffect, useRef } from 'react';

type Props = {
  className?: string;
};

/**
 * Animated aurora / light-tunnel background built on a canvas.
 * Draws flowing radial light beams + drifting particles for a premium hero feel.
 */
const AuroraBackground: React.FC<Props> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let animationId = 0;

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Light beams
    const beams = Array.from({ length: 24 }, (_, i) => ({
      angle: (i / 24) * Math.PI * 2,
      length: 0.3 + Math.random() * 0.5,
      speed: 0.0008 + Math.random() * 0.0012,
      thickness: 0.5 + Math.random() * 1.5,
      hue: 250 + Math.random() * 40,
      phase: Math.random() * Math.PI * 2,
    }));

    // Particles
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.5 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: 0.1 + Math.random() * 0.4,
    }));

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Base radial glow
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      grad.addColorStop(0, 'rgba(40, 20, 80, 0.4)');
      grad.addColorStop(0.5, 'rgba(20, 10, 40, 0.2)');
      grad.addColorStop(1, 'rgba(8, 8, 15, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Light beams from center
      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.max(width, height);

      beams.forEach((b) => {
        const a = b.angle + t * b.speed;
        const len = maxR * b.length * (0.8 + Math.sin(t * 0.001 + b.phase) * 0.2);
        const x2 = cx + Math.cos(a) * len;
        const y2 = cy + Math.sin(a) * len;

        const beamGrad = ctx.createLinearGradient(cx, cy, x2, y2);
        beamGrad.addColorStop(0, `hsla(${b.hue}, 80%, 60%, 0.0)`);
        beamGrad.addColorStop(0.3, `hsla(${b.hue}, 80%, 60%, 0.15)`);
        beamGrad.addColorStop(1, `hsla(${b.hue}, 80%, 60%, 0.0)`);

        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = b.thickness;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 180, 255, ${p.alpha})`;
        ctx.fill();
      });

      t += 16;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
};

export default AuroraBackground;
