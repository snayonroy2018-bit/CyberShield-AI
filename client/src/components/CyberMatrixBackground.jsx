import React, { useEffect, useRef } from 'react';

export default function CyberMatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle nodes
    const particleCount = Math.min(Math.floor(window.innerWidth / 25), 50);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.4 ? '#00f0ff' : '#a855f7'
    }));

    // Floating cyber hex code fragments
    const hexCodes = ['0x4F', '0x99', '0xA2', 'SEC', 'AI_V2', 'PORT443', 'SSH', 'SHA256', 'DES', 'AES'];
    const floatingTexts = Array.from({ length: 12 }, () => ({
      text: hexCodes[Math.floor(Math.random() * hexCodes.length)],
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speedY: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.25 + 0.05
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render floating code fragments
      ctx.font = '10px "JetBrains Mono", monospace';
      floatingTexts.forEach((ft) => {
        ctx.fillStyle = `rgba(0, 240, 255, ${ft.opacity})`;
        ctx.fillText(ft.text, ft.x, ft.y);
        ft.y -= ft.speedY;
        if (ft.y < 0) {
          ft.y = canvas.height;
          ft.x = Math.random() * canvas.width;
        }
      });

      // Render particle nodes & connecting mesh
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        // Connect nearby nodes with glowing cyber laser lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 130) * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
