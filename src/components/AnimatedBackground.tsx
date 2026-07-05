import { useEffect, useRef } from 'react';
import type { TabType } from '../types.ts';

interface Props {
  activeTab: TabType;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function AnimatedBackground({ activeTab }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const tabRef = useRef<TabType>(activeTab);

  // Smooth color transition values
  const colorRef = useRef({ r: 1, g: 0, b: 0 }); // start red

  useEffect(() => {
    tabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      for (let i = 0; i < 60; i++) {
        particles.push(createParticle(canvas.width, canvas.height));
      }
      particlesRef.current = particles;
    };
    initParticles();

    let time = 0;

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isPortador = tabRef.current === 'portador';

      // Smooth color lerp
      const targetR = isPortador ? 1 : 0;
      const targetG = 0;
      const targetB = isPortador ? 0 : 1;
      const lerpSpeed = 0.02;
      colorRef.current.r += (targetR - colorRef.current.r) * lerpSpeed;
      colorRef.current.g += (targetG - colorRef.current.g) * lerpSpeed;
      colorRef.current.b += (targetB - colorRef.current.b) * lerpSpeed;

      const { r, g, b } = colorRef.current;

      // Update and draw particles
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        // Gentle drift toward focus point
        const focusX = isPortador ? canvas.width * 0.2 : canvas.width * 0.8;
        const focusY = isPortador ? canvas.height * 0.2 : canvas.height * 0.8;
        p.vx += (focusX - p.x) * 0.00003;
        p.vy += (focusY - p.y) * 0.00003;

        // Sine wave wobble
        p.x += Math.sin(time * 2 + i) * 0.15;
        p.y += Math.cos(time * 1.5 + i * 0.7) * 0.1;

        const lifeRatio = p.life / p.maxLife;
        const alpha = p.opacity * lifeRatio;

        // Glow
        const glowR = Math.round(r * 255);
        const glowG = Math.round(g * 50);
        const glowB = Math.round(b * 255);

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `rgba(${glowR}, ${glowG}, ${glowB}, ${alpha * 0.8})`);
        gradient.addColorStop(0.4, `rgba(${glowR}, ${glowG}, ${glowB}, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${glowR}, ${glowG}, ${glowB}, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.fillStyle = `rgba(${Math.min(255, glowR + 100)}, ${Math.min(255, glowG + 100)}, ${Math.min(255, glowB + 100)}, ${alpha})`;
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Respawn
        if (p.life <= 0 || p.x < -50 || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) {
          particlesRef.current[i] = createParticle(canvas.width, canvas.height);
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Background image position animation
  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    let bgTime = 0;
    let bgAnim: number;

    const animateBg = () => {
      bgTime += 0.001;

      const isPortador = tabRef.current === 'portador';

      // Smooth pan: portador focuses top-left, avatar focuses bottom-right
      const targetX = isPortador ? 0 : -15;
      const targetY = isPortador ? 0 : -15;

      // Add slow sine wave drift
      const driftX = Math.sin(bgTime * 0.8) * 3;
      const driftY = Math.cos(bgTime * 0.6) * 2;

      // Lerp current transform
      const currentTransform = bg.style.transform || 'translate(0%, 0%)';
      const match = currentTransform.match(/translate\(([-\d.]+)%,\s*([-\d.]+)%\)/);
      let curX = match ? parseFloat(match[1]) : 0;
      let curY = match ? parseFloat(match[2]) : 0;

      curX += ((targetX + driftX) - curX) * 0.01;
      curY += ((targetY + driftY) - curY) * 0.01;

      bg.style.transform = `translate(${curX}%, ${curY}%)`;

      bgAnim = requestAnimationFrame(animateBg);
    };

    animateBg();
    return () => cancelAnimationFrame(bgAnim);
  }, []);

  // Update overlay color filter smoothly via CSS transition
  const isPortador = activeTab === 'portador';

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Background image layer */}
      <div
        ref={bgRef}
        className="absolute"
        style={{
          top: '-15%',
          left: '-15%',
          width: '130%',
          height: '130%',
          backgroundImage: 'url(./img/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'translate(0%, 0%)',
        }}
      />

      {/* Color overlay with smooth transition */}
      <div
        className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
        style={{
          background: isPortador
            ? 'radial-gradient(ellipse at 20% 20%, rgba(120,0,0,0.6) 0%, rgba(30,0,0,0.85) 60%, rgba(0,0,0,0.95) 100%)'
            : 'radial-gradient(ellipse at 80% 80%, rgba(0,0,120,0.6) 0%, rgba(0,0,30,0.85) 60%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.5 + 0.1,
    life: Math.random() * 400 + 200,
    maxLife: 600,
  };
}
