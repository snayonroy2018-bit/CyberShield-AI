import React, { useEffect, useRef } from 'react';

export default function Cyber3DVisualizer({ className = '', height = 300 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let h = (canvas.height = height);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        h = canvas.height = height;
      }
    };
    window.addEventListener('resize', handleResize);

    // Mouse tilt tracking
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - width / 2) * 0.002;
      mouseY = (e.clientY - rect.top - h / 2) * 0.002;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3D Cube Vertices (8 corners of a 3D cube)
    const size = 65;
    const vertices = [
      { x: -size, y: -size, z: -size },
      { x: size, y: -size, z: -size },
      { x: size, y: size, z: -size },
      { x: -size, y: size, z: -size },
      { x: -size, y: -size, z: size },
      { x: size, y: -size, z: size },
      { x: size, y: size, z: size },
      { x: -size, y: size, z: size }
    ];

    // 3D Cube Edges (12 lines connecting the corners)
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back face
      [4, 5], [5, 6], [6, 7], [7, 4], // Front face
      [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
    ];

    // Floating 3D threat particles (30 random 3D coordinates)
    const particles = Array.from({ length: 35 }, () => ({
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      z: (Math.random() - 0.5) * 300,
      speed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.3 ? '#00f0ff' : '#a855f7'
    }));

    let rotX = 0;
    let rotY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, h);

      // Smooth rotation with mouse tilt influence
      rotX += 0.01 + mouseY * 0.1;
      rotY += 0.015 + mouseX * 0.1;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const fov = 280; // Field of view depth distance
      const centerX = width / 2;
      const centerY = h / 2;

      // Project 3D Point to 2D Screen
      const project3D = (point) => {
        // Rotate Y
        let x1 = point.x * cosY - point.z * sinY;
        let z1 = point.z * cosY + point.x * sinY;

        // Rotate X
        let y2 = point.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + point.y * sinX;

        const scale = fov / (fov + z2 + 150);
        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;

        return { x: screenX, y: screenY, scale, z: z2 };
      };

      // 1. Draw 3D Threat Particles Field
      particles.forEach((p) => {
        p.x += Math.sin(rotY) * p.speed * 10;
        p.y += Math.cos(rotX) * p.speed * 10;

        const projected = project3D(p);
        if (projected.scale > 0) {
          ctx.beginPath();
          ctx.arc(projected.x, projected.y, Math.max(1, 2.5 * projected.scale), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(1, Math.max(0.1, projected.scale * 0.8));
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      // Project Cube Vertices
      const projectedVertices = vertices.map(project3D);

      // 2. Draw 3D Wireframe Edges
      ctx.lineWidth = 1.8;
      edges.forEach(([startIdx, endIdx]) => {
        const p1 = projectedVertices[startIdx];
        const p2 = projectedVertices[endIdx];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        // Glowing Gradient Cyber Laser Stroke
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, '#00f0ff');
        grad.addColorStop(0.5, '#a855f7');
        grad.addColorStop(1, '#00f0ff');
        ctx.strokeStyle = grad;
        ctx.stroke();
      });

      // 3. Draw 3D Vertex Glowing Nodes
      projectedVertices.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 4. Draw Orbiting 3D Hologram Ring
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 90, 30, rotY, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [height]);

  return (
    <div className={`relative w-full ${className}`}>
      <canvas ref={canvasRef} className="w-full block" />
    </div>
  );
}
