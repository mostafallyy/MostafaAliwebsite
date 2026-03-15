import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Stars } from "@react-three/drei";
import * as THREE from "three";

interface EarthProps {
  scrollProgress: number;
}

// Subtle bloom — high threshold so only brightest city clusters glow
function BloomEffect({ scrollProgress }: { scrollProgress: number }) {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<any>(null);

  useMemo(() => {
    import("three/examples/jsm/postprocessing/EffectComposer.js").then(({ EffectComposer }) =>
      import("three/examples/jsm/postprocessing/RenderPass.js").then(({ RenderPass }) =>
        import("three/examples/jsm/postprocessing/UnrealBloomPass.js").then(({ UnrealBloomPass }) => {
          const composer = new EffectComposer(gl);
          composer.addPass(new RenderPass(scene, camera));
          const bloom = new UnrealBloomPass(
            new THREE.Vector2(size.width, size.height),
            0.3,  // strength — very subtle
            0.2,  // radius — tight, contained
            0.85  // threshold — only the brightest clusters
          );
          composer.addPass(bloom);
          composerRef.current = { composer, bloom };
        })
      )
    );
  }, [gl, scene, camera, size]);

  useFrame(() => {
    if (!composerRef.current) return;
    const { composer, bloom } = composerRef.current;
    // Slight bloom increase on scroll, but capped and subtle
    bloom.strength = 0.3 + scrollProgress * 0.4;
    bloom.threshold = 0.85 - scrollProgress * 0.1;
    composer.render();
  }, 1);

  return null;
}

function Earth({ scrollProgress }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture("/images/earth-night.jpg", (tex) => {
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
  });

  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        opacity: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float opacity;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vec4 texColor = texture2D(map, vUv);
          float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
          
          // Deep matte black oceans
          float isOcean = step(brightness, 0.03);
          vec3 oceanColor = vec3(0.0, 0.0, 0.002);
          
          // Crisp city lights — faithful to texture, minimal amplification
          vec3 cityColor = texColor.rgb * (1.0 + brightness * 1.2);
          // Warm tint only on bright spots
          cityColor.r *= 1.0 + brightness * 0.3;
          cityColor.g *= 1.0 + brightness * 0.1;
          
          vec3 finalColor = mix(cityColor, oceanColor, isOcean);
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true,
    });
  }, [texture]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const baseSpeed = 0.03;
    const hyperSpeed = 20;
    const speed = baseSpeed + scrollProgress * hyperSpeed;
    meshRef.current.rotation.y += delta * speed;

    // Fade to ~20% opacity on scroll
    const opacity = 1 - scrollProgress * 0.8;
    if (meshRef.current.material instanceof THREE.ShaderMaterial) {
      meshRef.current.material.uniforms.opacity.value = opacity;
    }
  });

  return (
    <mesh ref={meshRef} material={glowMaterial} rotation={[0.1, 0, 0]}>
      <sphereGeometry args={[2.5, 128, 128]} />
    </mesh>
  );
}

function FresnelAtmosphere({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        opacity: { value: 1.0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float opacity;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float fresnel = 1.0 - dot(vNormal, vViewDir);
          // Thin, tight rim — power 5 for sharp falloff
          float rim = pow(fresnel, 5.0) * 1.2;
          vec3 color = vec3(0.15, 0.4, 0.95);
          gl_FragColor = vec4(color, rim * opacity * 0.6);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
    });
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    material.uniforms.opacity.value = 1 - scrollProgress * 0.7;
  });

  return (
    <mesh ref={meshRef} rotation={[0.1, 0, 0]}>
      <sphereGeometry args={[2.53, 128, 128]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// Camera rig: starts close at horizon, zooms out on scroll, dims ambient light
function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const lightRef = useRef<THREE.AmbientLight>(null);

  useFrame(({ camera }) => {
    // Start at z=6.27 (5% closer than 6.6), pull back to z=11 on full scroll
    const startZ = 6.27;
    const endZ = 11.0;
    const startY = 0.5;
    const endY = 2.0;
    
    camera.position.z = startZ + scrollProgress * (endZ - startZ);
    camera.position.y = startY + scrollProgress * (endY - startY);
    camera.lookAt(0, -0.5, 0);

    // Dim ambient light by 40% on scroll start
    if (lightRef.current) {
      lightRef.current.intensity = 0.08 * (1 - scrollProgress * 0.4);
    }
  });

  return <ambientLight ref={lightRef} intensity={0.08} />;
}

export default function EarthScene({ scrollProgress }: EarthProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 6.27], fov: 55, near: 0.1, far: 1000 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9 }}
      style={{ background: "#0F0F0F" }}
    >
      <Stars radius={300} depth={100} count={4000} factor={3} fade speed={0} />
      <CameraRig scrollProgress={scrollProgress} />
      <Earth scrollProgress={scrollProgress} />
      <FresnelAtmosphere scrollProgress={scrollProgress} />
      <BloomEffect scrollProgress={scrollProgress} />
    </Canvas>
  );
}
