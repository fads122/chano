/* eslint-disable react/no-unknown-property */
"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { createLanyardTexture } from "@/lib/createLanyardTexture";
import * as THREE from "three";

// meshline exports custom Three.js classes consumed via R3F extend()
extend({ MeshLineGeometry, MeshLineMaterial } as Parameters<typeof extend>[0]);

const CARD_GLB = "/lanyard/card.glb";

const BLANK_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const BASE_CARD_SCALE = 2.25;
const BASE_HOOK_Y = 1.45;
const BASE_VISUAL_Y = -1.2;
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };

interface LanyardProps {
  className?: string;
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  backImageFit?: "cover" | "contain";
  lanyardImage?: string | null;
  lanyardLogo?: string | null;
  lanyardWidth?: number;
  /** World-space anchor for the top of the strap (higher = strap extends above viewport). */
  anchorPosition?: [number, number, number];
  /** Visual scale of the ID card mesh. */
  cardScale?: number;
  /** Vertical point the camera looks at — tune so the card face sits centered. */
  lookAtY?: number;
  /** Horizontal look-at offset — tune to center the card in the viewport. */
  lookAtX?: number;
}

function CameraRig({
  position,
  fov,
  lookAtY,
  lookAtX = 0,
}: {
  position: [number, number, number];
  fov: number;
  lookAtY: number;
  lookAtX?: number;
}) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    camera.position.set(position[0], position[1], position[2]);

    if ("fov" in camera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    camera.lookAt(lookAtX, lookAtY, 0);
  }, [camera, fov, lookAtX, lookAtY, position]);

  return null;
}

export default function Lanyard({
  className = "",
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  backImageFit,
  lanyardImage = null,
  lanyardLogo = null,
  lanyardWidth = 1,
  anchorPosition = [0, 4, 0],
  cardScale = 2.25,
  lookAtY = 0,
  lookAtX = 0,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 1024,
  );

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`relative z-0 flex h-full min-h-[280px] w-full items-center justify-center overflow-visible lg:min-h-[520px] ${className}`}
    >
      <Canvas
        className="h-full w-full touch-none overflow-visible"
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent, antialias: true }}
        style={{ background: "transparent", overflow: "visible" }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
        }}
      >
        <CameraRig
          position={position}
          fov={fov}
          lookAtY={lookAtY}
          lookAtX={lookAtX}
        />
        <ambientLight intensity={Math.PI} />
        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              backImageFit={backImageFit}
              lanyardImage={lanyardImage}
              lanyardLogo={lanyardLogo}
              lanyardWidth={lanyardWidth}
              anchorPosition={anchorPosition}
              cardScale={cardScale}
            />
          </Physics>
          <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  backImageFit?: "cover" | "contain";
  lanyardImage?: string | null;
  lanyardLogo?: string | null;
  lanyardWidth?: number;
  anchorPosition?: [number, number, number];
  cardScale?: number;
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  backImageFit,
  lanyardImage = null,
  lanyardLogo = null,
  lanyardWidth = 1,
  anchorPosition = [0, 4, 0],
  cardScale = 2.25,
}: BandProps) {
  const meshScale = cardScale;
  const scaleRatio = meshScale / BASE_CARD_SCALE;
  const hookAnchorY = BASE_HOOK_Y * scaleRatio;
  const visualYOffset = BASE_VISUAL_Y * scaleRatio;
  const ropeLength = scaleRatio;

  const band = useRef<THREE.Mesh | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fixed = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const j1 = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const j2 = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const j3 = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: "dynamic" as RigidBodyProps["type"],
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nodes, materials } = useGLTF(CARD_GLB) as any;

  const fileTexture = useTexture(lanyardImage || BLANK_PIXEL);
  const logoTex = useTexture(lanyardLogo || BLANK_PIXEL);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  const texture = useMemo(() => {
    if (lanyardImage) return fileTexture;

    if (lanyardLogo && logoTex.image) {
      return createLanyardTexture(
        logoTex.image as CanvasImageSource & { width: number; height: number },
      );
    }

    return fileTexture;
  }, [fileTexture, lanyardImage, lanyardLogo, logoTex.image]);

  useEffect(() => {
    return () => {
      if (!lanyardImage && lanyardLogo && texture !== fileTexture) {
        texture.dispose();
      }
    };
  }, [fileTexture, lanyardImage, lanyardLogo, texture]);

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image as CanvasImageSource & {
      width: number;
      height: number;
    };
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return baseMap;

    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (
      img: CanvasImageSource & { width: number; height: number },
      rect: typeof FRONT_UV_RECT,
      fit: "cover" | "contain",
    ) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = fit === "contain" ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image)
      drawFitted(
        frontTex.image as CanvasImageSource & {
          width: number;
          height: number;
        },
        FRONT_UV_RECT,
        imageFit,
      );
    if (backImage && backTex.image)
      drawFitted(
        backTex.image as CanvasImageSource & {
          width: number;
          height: number;
        },
        BACK_UV_RECT,
        backImageFit ?? imageFit,
      );

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, backImageFit, frontTex, backTex, materials.base.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, hookAnchorY, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== "boolean") {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      [j1, j2].forEach((ref) => {
        const body = ref.current;
        if (!body) return;
        if (!(body as typeof body & { lerped?: THREE.Vector3 }).lerped) {
          (body as typeof body & { lerped: THREE.Vector3 }).lerped =
            new THREE.Vector3().copy(body.translation());
        }
        const lerped = (body as typeof body & { lerped: THREE.Vector3 }).lerped;
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, lerped.distanceTo(body.translation())),
        );
        lerped.lerp(
          body.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(
        (j2.current as typeof j2.current & { lerped: THREE.Vector3 }).lerped,
      );
      curve.points[2].copy(
        (j1.current as typeof j1.current & { lerped: THREE.Vector3 }).lerped,
      );
      curve.points[3].copy(fixed.current.translation());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (band.current?.geometry as any)?.setPoints(
        curve.getPoints(isMobile ? 16 : 32),
      );
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={anchorPosition}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody
          position={[0.5 * scaleRatio, 0, 0]}
          ref={j1}
          {...segmentProps}
          type="dynamic"
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1 * scaleRatio, 0, 0]}
          ref={j2}
          {...segmentProps}
          type="dynamic"
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.5 * scaleRatio, 0, 0]}
          ref={j3}
          {...segmentProps}
          type="dynamic"
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2 * scaleRatio, 0, 0]}
          ref={card}
          {...segmentProps}
          type={
            dragged
              ? ("kinematicPosition" as RigidBodyProps["type"])
              : ("dynamic" as RigidBodyProps["type"])
          }
        >
          <CuboidCollider
            args={[0.8 * scaleRatio, 1.125 * scaleRatio, 0.01]}
          />
          <group
            scale={meshScale}
            position={[0, visualYOffset, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element & { releasePointerCapture: (id: number) => void }).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element & { setPointerCapture: (id: number) => void }).setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current!.translation())),
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#f5f8fa"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={isMobile ? [-6, 1] : [-9, 1]}
          lineWidth={lanyardWidth * scaleRatio}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(CARD_GLB);
useTexture.preload("/profile/photo.jpg");
useTexture.preload("/profile/logo.png");
