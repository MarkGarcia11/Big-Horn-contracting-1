import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { Group, Mesh } from "three";

function WallPiece({ x, y, delay, color }: { x: number; y: number; delay: number; color: string }) {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const progress = Math.min(1, Math.max(0, (state.clock.getElapsedTime() - delay) / 1.35));
    const eased = 1 - Math.pow(1 - progress, 3);
    mesh.current.position.y = y + (1 - eased) * 2.2;
    mesh.current.rotation.z = (1 - eased) * (x < 0 ? -.12 : .12);
    if (progress < 1) state.invalidate();
  });
  return <mesh ref={mesh} position={[x, y + 2.2, 0]}><boxGeometry args={[1.18, .67, .35]} /><meshStandardMaterial color={color} roughness={.94} metalness={0} /></mesh>;
}

function Wall() {
  const group = useRef<Group>(null);
  const target = useRef({ x: 0, y: -.26 });
  const visible = useRef(true);
  const invalidate = useThree((state) => state.invalidate);
  const gl = useThree((state) => state.gl);
  const colors = ["#e5b783", "#e0ad77", "#f3d1a0", "#d39a6c", "#f1c99a", "#e8b986", "#cf9064", "#eac196", "#f6d6a8", "#deb084", "#f1c89a", "#d69b6d"];
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!visible.current) return;
      target.current.y = -.26 + (event.clientX / window.innerWidth - .5) * .12;
      target.current.x = (event.clientY / window.innerHeight - .5) * -.045;
      invalidate();
    };
    const scroll = () => { if (!visible.current) return; target.current.x = Math.min(.08, window.scrollY * .00008); invalidate(); };
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; });
    observer.observe(gl.domElement);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("pointermove", move); window.removeEventListener("scroll", scroll); };
  }, [invalidate, gl]);
  useFrame((_, delta) => {
    if (!group.current) return;
    const speed = Math.min(1, delta * 4);
    group.current.rotation.x += (target.current.x - group.current.rotation.x) * speed;
    group.current.rotation.y += (target.current.y - group.current.rotation.y) * speed;
    if (Math.abs(target.current.x - group.current.rotation.x) + Math.abs(target.current.y - group.current.rotation.y) > .001) invalidate();
  });
  return <group ref={group} rotation={[0, -.26, 0]} position={[0, -.25, 0]}>
    {Array.from({ length: 12 }, (_, index) => {
      const row = Math.floor(index / 4);
      const column = index % 4;
      return <WallPiece key={index} x={(column - 1.5) * 1.27 + (row % 2 ? .19 : 0)} y={(row - 1) * .75} delay={.13 * index} color={colors[index]} />;
    })}
  </group>;
}

export default function HeroMasonryScene() {
  return <Canvas camera={{ position: [0, 0, 9.7], fov: 38 }} frameloop="demand" dpr={[1, 1.25]} gl={{ alpha: true, antialias: false, powerPreference: "low-power" }} aria-hidden="true">
    <ambientLight intensity={1.8} color="#fff0dc" />
    <directionalLight position={[-2, 5, 6]} intensity={2.4} color="#ffc787" />
    <directionalLight position={[4, 1, -1]} intensity={.6} color="#a45136" />
    <Wall />
  </Canvas>;
}