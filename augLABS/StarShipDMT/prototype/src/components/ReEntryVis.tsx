import React, { useEffect, useRef } from 'react';
import type { SimState } from '../simulation';

interface Props {
    state: SimState;
}

const ReEntryVis: React.FC<Props> = ({ state }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: { x: number, y: number, v: number, life: number }[] = [];

        // Resize
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const render = () => {
            ctx.fillStyle = '#0a0a1f';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // 1. Draw Starship (Abstract Triangle)
            ctx.save();
            ctx.translate(cx, cy);

            // Shake based on Gamma (Decoherence)
            // High Gamma = More Shake
            const shake = Math.min(10, state.gamma_eff / 5) * (Math.random() - 0.5);
            ctx.translate(shake, shake);

            // Scale based on altitude (closer as it falls)
            const scale = 2 + (150 - state.altitude) / 50;
            ctx.scale(scale, scale);

            // Hull Color based on Integrity
            const hullColor = state.integrity > 50 ? '#e0e0ff' : '#ff4d4d';

            // Ship Body
            ctx.beginPath();
            ctx.moveTo(0, -40);
            ctx.quadraticCurveTo(20, 0, 25, 60);
            ctx.lineTo(-25, 60);
            ctx.quadraticCurveTo(-20, 0, 0, -40);
            ctx.fillStyle = hullColor;
            ctx.fill();

            // Shield Bow Shock
            // Color shifts from Red (Plasma) to Purple (Coherence) based on Ac
            const shieldColor = `rgba(${255 * (1 - state.Ac)}, ${80}, ${255 * state.Ac}, ${0.1 + state.Ac * 0.5})`;

            ctx.beginPath();
            ctx.arc(0, 20, 70, Math.PI, 0);
            ctx.strokeStyle = shieldColor;
            ctx.lineWidth = 4 + state.Ac * 10;
            ctx.shadowBlur = 20 * state.Ac;
            ctx.shadowColor = shieldColor;
            ctx.stroke();

            ctx.restore();

            // 2. Draw Plasma / Coherence Field
            // Adding particles
            // Low Ac -> Chaos/Fire particles
            // High Ac -> Flow/Geometry particles
            const particleCount = state.phase === 'PEAK_HEATING' ? 20 : 5;
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: cx + (Math.random() - 0.5) * 100,
                    y: cy + 150, // Start below ship
                    v: (5 + Math.random() * 10) * (state.phase === 'PEAK_HEATING' ? 2 : 1),
                    life: 1.0
                });
            }

            // Update and draw particles
            particles.forEach((p, idx) => {
                p.y -= p.v; // Move up past ship
                p.life -= 0.02;

                const dist = Math.abs(p.x - cx);
                // Deflection: If High Ac, particles avoid the center (Shielding)
                if (state.Ac > 0.5 && dist < 80 && p.y < cy + 50) {
                    p.x += (p.x > cx ? 2 : -2) * state.Ac * 5;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                // Color
                const r = 255;
                const g = state.Ac * 200; // More green/cyan as Ac goes up
                const b = state.Ac * 255;
                ctx.fillStyle = `rgba(${r},${g},${b},${p.life})`;
                ctx.fill();

                if (p.life <= 0) particles.splice(idx, 1);
            });

            requestAnimationFrame(render);
        };

        const anim = requestAnimationFrame(render);
        return () => cancelAnimationFrame(anim);
    }, [state]);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default ReEntryVis;
