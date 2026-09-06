import React, { useEffect, useRef } from 'react';

export type FlowDirection = 'inward' | 'outward';

export interface LightTunnelProps {
    cableColor?: string;
    pulseColor?: string;
    tunnelColor?: string;
    tunnelOpacity?: number;
    speed?: number;
    flowDirection?: FlowDirection;
    pulseSpeed?: number;
    pulseLength?: number;
    pulseBlend?: number;
    pulseWidth?: number;
    cableCount?: number;
    thickness?: number;
    rimWidth?: number;
    waviness?: number;
    sway?: number;
    size?: number;
    centerX?: number;
    centerY?: number;
    glow?: number;
    fadeNear?: number;
    fadeFar?: number;
    brightness?: number;
    colorVariance?: boolean;
    grain?: boolean;
    grainIntensity?: number;
    opacity?: number;
    mouseInteraction?: boolean;
    mouseStrength?: number;
    className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [1, 1, 1];
    return [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
    ];
};

const VERT_SRC = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG_SRC = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uFlowDir;
uniform float uPulseSpeed;
uniform float uPulseLength;
uniform float uPulseBlend;
uniform float uPulseWidth;
uniform float uCableCount;
uniform float uThickness;
uniform float uRimWidth;
uniform float uWaviness;
uniform float uSway;
uniform float uSize;
uniform vec2 uCenter;
uniform vec2 uMouseOffset;
uniform float uGlow;
uniform float uFadeNear;
uniform float uFadeFar;
uniform float uBrightness;
uniform float uColorVariance;
uniform float uOpacity;
uniform vec3 uCableColor;
uniform vec3 uPulseColor;
uniform vec3 uTunnelColor;
uniform float uTunnelOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
out vec4 fragColor;

void mainImage(out vec4 o, in vec2 fragCoord) {
  float size = uSize * 2.0;
  float flowDir = uFlowDir;
  float speedBase = uSpeed * 4.0 * flowDir;
  float waviness = uWaviness * 0.15;
  float rotationOsc = uSway * 0.5;
  float baseThick = uThickness * 0.35 + 0.05;
  float borderWeight = uRimWidth * 0.15 + 0.01;
  float cablesCount = floor(uCableCount);

  vec2 res = iResolution.xy;
  vec2 uv = (fragCoord - 0.5 * res) / min(res.y, res.x);
  uv -= (uCenter + uMouseOffset);
  uv /= (size + 0.0001);

  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  float depth = -log(r + 0.0001);

  float swing = sin(iTime * (uSpeed * 0.5 + 0.1)) * rotationOsc;
  float waveOffset = sin(depth * 1.2 + iTime * speedBase * 0.25) * waviness;

  float angleNormalized = (angle / 6.2831853) + 0.5;
  float finalAngle = fract(angleNormalized + waveOffset + swing);

  float cableID = floor(finalAngle * cablesCount);
  float gvX = (fract(finalAngle * cablesCount) - 0.5);

  float rand = fract(sin(cableID * 12.9898) * 43758.5453);
  float randSpeed = (0.4 + rand * 0.6) * speedBase * uPulseSpeed;
  float cableThick = baseThick * (0.6 + rand * 0.4);

  vec3 cableCol = uCableColor;
  cableCol *= 1.0 + (rand - 0.5) * 0.4 * uColorVariance;
  cableCol = mix(cableCol, uPulseColor, rand * 0.25 * uColorVariance);

  float scroll = depth + (iTime * randSpeed);
  float pulseFact = fract(scroll);

  float distToCore = abs(gvX);
  float wireMask = smoothstep(cableThick, cableThick - 0.05, distToCore);
  float rimGlow = smoothstep(borderWeight, 0.0, abs(distToCore - cableThick));

  float pulseThick = cableThick * uPulseWidth;
  float pulseMask = smoothstep(pulseThick, pulseThick - 0.05 * uPulseWidth, distToCore);

  float pulseDist = abs(pulseFact - 0.5);
  float pulseTotal = uPulseLength;
  float pulseCore = pulseTotal * (1.0 - uPulseBlend);
  float pulseLo = min(pulseCore, pulseTotal - max(fwidth(scroll), 1e-4));
  float dataPulse = 1.0 - smoothstep(pulseLo, pulseTotal, pulseDist);

  float aBody = wireMask * uTunnelOpacity;
  float aRim = rimGlow;
  float aPulse = clamp(dataPulse * pulseMask, 0.0, 1.0);

  vec3 fiberCol = uTunnelColor * aBody
    + cableCol * aRim * 1.3 * uGlow
    + uPulseColor * dataPulse * 3.0 * pulseMask;

  float distFade = smoothstep(0.0, uFadeNear, r) * smoothstep(uFadeFar, uFadeFar - 0.9, r);
  float inten = clamp(aBody + aRim + aPulse, 0.0, 1.0) * distFade;

  vec3 finalCol = fiberCol * uBrightness;
  float alpha = clamp(inten, 0.0, 1.0) * uOpacity;
  vec3 outRgb = finalCol * alpha;

  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    outRgb = clamp(outRgb + gv, 0.0, 1.0);
    alpha = clamp(alpha + gv, 0.0, 1.0);
  }

  o = vec4(outRgb, alpha);
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  fragColor = o;
}`;

// ─── minimal raw-WebGL runner (no OGL dependency at runtime) ─────────────────
function createProgram(gl: WebGL2RenderingContext, vert: string, frag: string) {
    const compile = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
            throw new Error(gl.getShaderInfoLog(s) ?? 'shader error');
        return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(prog) ?? 'link error');
    return prog;
}

function setUniform(
    gl: WebGL2RenderingContext,
    prog: WebGLProgram,
    name: string,
    value: number | Float32Array
) {
    const loc = gl.getUniformLocation(prog, name);
    if (loc === null) return;
    if (value instanceof Float32Array) {
        if (value.length === 2) gl.uniform2fv(loc, value);
        else if (value.length === 3) gl.uniform3fv(loc, value);
        else gl.uniform1fv(loc, value);
    } else {
        gl.uniform1f(loc, value);
    }
}

// ─── Component ───────────────────────────────────────────────────────────────
const LightTunnel: React.FC<LightTunnelProps> = ({
    cableColor = '#A855F7',
    pulseColor = '#A855F7',
    tunnelColor = '#5227FF',
    tunnelOpacity = 0,
    speed = 0.1,
    flowDirection = 'outward',
    pulseSpeed = 2,
    pulseLength = 0.28,
    pulseBlend = 1,
    pulseWidth = 1,
    cableCount = 20,
    thickness = 0.35,
    rimWidth = 0.15,
    waviness = 0.3,
    sway = 0.5,
    size = 1.0,
    centerX = 0.0,
    centerY = 0.0,
    glow = 1.0,
    fadeNear = 0.5,
    fadeFar = 2,
    brightness = 1.0,
    colorVariance = true,
    grain = true,
    grainIntensity = 0.05,
    opacity = 1.0,
    mouseInteraction = true,
    mouseStrength = 0.1,
    className = '',
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Store mutable values without causing re-renders
    const state = useRef({
        mouseInteraction,
        mouseStrength,
        speed,
        flowDirection,
        pulseSpeed,
        pulseLength,
        pulseBlend,
        pulseWidth,
        cableCount,
        thickness,
        rimWidth,
        waviness,
        sway,
        size,
        centerX,
        centerY,
        glow,
        fadeNear,
        fadeFar,
        brightness,
        colorVariance,
        grain,
        grainIntensity,
        opacity,
        cableColor,
        pulseColor,
        tunnelColor,
        tunnelOpacity,
    });

    // Keep state ref in sync
    useEffect(() => {
        state.current = {
            mouseInteraction,
            mouseStrength,
            speed,
            flowDirection,
            pulseSpeed,
            pulseLength,
            pulseBlend,
            pulseWidth,
            cableCount,
            thickness,
            rimWidth,
            waviness,
            sway,
            size,
            centerX,
            centerY,
            glow,
            fadeNear,
            fadeFar,
            brightness,
            colorVariance,
            grain,
            grainIntensity,
            opacity,
            cableColor,
            pulseColor,
            tunnelColor,
            tunnelOpacity,
        };
    });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // ── Check WebGL2 support ──
        const testCanvas = document.createElement('canvas');
        const testCtx = testCanvas.getContext('webgl2');
        if (!testCtx) {
            console.warn('LightTunnel: WebGL2 not supported — skipping animation.');
            return;
        }

        // ── Create canvas ──
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'width:100%;height:100%;display:block;';
        container.appendChild(canvas);

        const gl = canvas.getContext('webgl2', {
            alpha: true,
            premultipliedAlpha: true,
            antialias: false,
        }) as WebGL2RenderingContext | null;

        if (!gl) {
            console.warn('LightTunnel: Failed to get WebGL2 context.');
            try { container.removeChild(canvas); } catch { /* */ }
            return;
        }

        // ── Build shader program ──
        let prog: WebGLProgram;
        try {
            prog = createProgram(gl, VERT_SRC, FRAG_SRC);
        } catch (e) {
            console.error('LightTunnel shader error:', e);
            try { container.removeChild(canvas); } catch { /* */ }
            return;
        }

        // Full-screen triangle
        const buf = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 3, -1, -1, 3]),
            gl.STATIC_DRAW
        );
        const posLoc = gl.getAttribLocation(prog, 'position');

        const vao = gl.createVertexArray()!;
        gl.bindVertexArray(vao);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);

        gl.useProgram(prog);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        // ── Resize helper ──
        const resize = () => {
            const rect = container.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = Math.max(1, Math.floor(rect.width * dpr));
            const h = Math.max(1, Math.floor(rect.height * dpr));
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(container);
        resize();

        // ── Mouse ──
        let curMouse = [0.5, 0.5];
        let tgtMouse = [0.5, 0.5];

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            tgtMouse = [
                (e.clientX - rect.left) / rect.width,
                1 - (e.clientY - rect.top) / rect.height,
            ];
        };
        const onMouseLeave = () => { tgtMouse = [0.5, 0.5]; };
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mouseleave', onMouseLeave);

        // ── Render loop ──
        let raf = 0;
        let isVisible = true;
        let isPageVisible = !document.hidden;
        const t0 = performance.now();

        const loop = (t: number) => {
            const s = state.current;
            const elapsed = (t - t0) * 0.001;

            if (s.mouseInteraction) {
                curMouse[0] += 0.05 * (tgtMouse[0] - curMouse[0]);
                curMouse[1] += 0.05 * (tgtMouse[1] - curMouse[1]);
            } else {
                curMouse[0] += 0.05 * (0.5 - curMouse[0]);
                curMouse[1] += 0.05 * (0.5 - curMouse[1]);
            }

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(prog);

            setUniform(gl, prog, 'iTime', elapsed);
            setUniform(gl, prog, 'iResolution', new Float32Array([canvas.width, canvas.height]));
            setUniform(gl, prog, 'uSpeed', s.speed);
            setUniform(gl, prog, 'uFlowDir', s.flowDirection === 'outward' ? -1 : 1);
            setUniform(gl, prog, 'uPulseSpeed', s.pulseSpeed);
            setUniform(gl, prog, 'uPulseLength', s.pulseLength);
            setUniform(gl, prog, 'uPulseBlend', s.pulseBlend);
            setUniform(gl, prog, 'uPulseWidth', s.pulseWidth);
            setUniform(gl, prog, 'uCableCount', s.cableCount);
            setUniform(gl, prog, 'uThickness', s.thickness);
            setUniform(gl, prog, 'uRimWidth', s.rimWidth);
            setUniform(gl, prog, 'uWaviness', s.waviness);
            setUniform(gl, prog, 'uSway', s.sway);
            setUniform(gl, prog, 'uSize', s.size);
            setUniform(gl, prog, 'uCenter', new Float32Array([s.centerX, s.centerY]));
            setUniform(
                gl, prog, 'uMouseOffset',
                new Float32Array([
                    (curMouse[0] - 0.5) * s.mouseStrength,
                    (curMouse[1] - 0.5) * s.mouseStrength,
                ])
            );
            setUniform(gl, prog, 'uGlow', s.glow);
            setUniform(gl, prog, 'uFadeNear', s.fadeNear);
            setUniform(gl, prog, 'uFadeFar', s.fadeFar);
            setUniform(gl, prog, 'uBrightness', s.brightness);
            setUniform(gl, prog, 'uColorVariance', s.colorVariance ? 1 : 0);
            setUniform(gl, prog, 'uOpacity', s.opacity);
            setUniform(gl, prog, 'uGrain', s.grain ? 1 : 0);
            setUniform(gl, prog, 'uGrainIntensity', s.grainIntensity);
            setUniform(gl, prog, 'uTunnelOpacity', s.tunnelOpacity);

            const cable = hexToRgb(s.cableColor);
            setUniform(gl, prog, 'uCableColor', new Float32Array(cable));
            const pulse = hexToRgb(s.pulseColor);
            setUniform(gl, prog, 'uPulseColor', new Float32Array(pulse));
            const tunnel = hexToRgb(s.tunnelColor);
            setUniform(gl, prog, 'uTunnelColor', new Float32Array(tunnel));

            gl.bindVertexArray(vao);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            gl.bindVertexArray(null);

            raf = requestAnimationFrame(loop);
        };

        const tryStart = () => {
            if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
        };
        const tryStop = () => {
            if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; }
        };

        const io = new IntersectionObserver(([e]) => {
            isVisible = e.isIntersecting;
            isVisible ? tryStart() : tryStop();
        }, { threshold: 0 });
        io.observe(container);

        const onPageVis = () => {
            isPageVisible = !document.hidden;
            isPageVisible ? tryStart() : tryStop();
        };
        document.addEventListener('visibilitychange', onPageVis);

        tryStart();

        return () => {
            tryStop();
            ro.disconnect();
            io.disconnect();
            document.removeEventListener('visibilitychange', onPageVis);
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mouseleave', onMouseLeave);
            gl.deleteProgram(prog);
            gl.deleteBuffer(buf);
            gl.deleteVertexArray(vao);
            gl.getExtension('WEBGL_lose_context')?.loseContext();
            try { container.removeChild(canvas); } catch { /* */ }
        };
    }, []); // run once

    return (
        <div
            ref={containerRef}
            style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
            className={className}
        />
    );
};

export default LightTunnel;
