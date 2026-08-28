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

    // Mouse tracking for interactive glow
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle nodes
    const particleCount = Math.min(Math.floor(window.innerWidth / 22), 65);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      radius: Math.random() * 2.2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.35 ? '#00f0ff' : (Math.random() > 0.5 ? '#a855f7' : '#10b981')
    }));

    // Matrix Rain Drops
    const katakana = '0123456789ABCDEF01CYBERSHIELD';
    const fontSize = 13;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

    // Floating cyber hex code fragments
    const hexCodes = ['0x4F', '0x99', '0xA2', 'SEC', 'AI_V2', 'PORT443', 'SSH', 'SHA256', 'DES', 'AES', 'XAI_99', 'TLS_1.3'];
    const floatingTexts = Array.from({ length: 16 }, () => ({
      text: hexCodes[Math.floor(Math.random() * hexCodes.length)],
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speedY: Math.random() * 0.4 + 0.15,
      opacity: Math.random() * 0.25 + 0.08
    }));

    let frameCounter = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCounter++;

      // Render Matrix Rain columns (subtle background stream)
      if (frameCounter % 2 === 0) {
        ctx.font = `${fontSize}px monospace`;
        for (let i = 0; i < drops.length; i += 3) {
          const char = katakana[Math.floor(Math.random() * katakana.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          ctx.fillStyle = 'rgba(0, 240, 255, 0.09)';
          ctx.fillText(char, x, y);

          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

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

      // Render particle nodes & connecting mesh with mouse interactivity
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        // Mouse proximity reaction
        const mdx = p1.x - mouse.x;
        const mdy = p1.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - mdist / 140) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

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

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 140) * 0.18})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-85"
    />
  );
}

