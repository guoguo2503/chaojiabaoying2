/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useRef, useMemo, useLayoutEffect } from "react";
import { Color } from "three";

const hexToNormalizedRGB = (hex: string) => {
  hex = hex.replace("#", "");
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation + uTime * 0.1);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  // 增强波浪效果
  tex.y += 0.1 * sin(6.0 * tex.x - tOffset * 2.0);
  tex.x += 0.05 * cos(8.0 * tex.y - tOffset * 1.5);

  float pattern = 0.5 +
                  0.5 * sin(3.0 * (tex.x + tex.y +
                                   cos(2.0 * tex.x + 3.0 * tex.y) +
                                   0.1 * tOffset) +
                           sin(15.0 * (tex.x + tex.y - 0.2 * tOffset)));

  // 添加时间变化的颜色强度
  float intensity = 0.8 + 0.2 * sin(uTime * 0.5);
  
  vec4 col = vec4(uColor * intensity, 1.0) * vec4(pattern) - rnd / 20.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

interface SilkPlaneProps {
  uniforms: any;
}

const SilkPlane = forwardRef<any, SilkPlaneProps>(function SilkPlane({ uniforms }, ref) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (ref && typeof ref === 'object' && ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useFrame((_, delta) => {
    if (ref && typeof ref === 'object' && ref.current) {
      // 增加时间更新速度，让动画更明显
      ref.current.material.uniforms.uTime.value += delta * 2.0;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});
SilkPlane.displayName = "SilkPlane";

interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
}

const Silk = ({
  speed = 8,
  scale = 2,
  color = "#1e293b",
  noiseIntensity = 1.0,
  rotation = 0,
}: SilkProps) => {
  const meshRef = useRef();

  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, color, rotation]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas 
        dpr={[1, 2]} 
        frameloop="always"
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <SilkPlane ref={meshRef} uniforms={uniforms} />
      </Canvas>
    </div>
  );
};

export default Silk; 