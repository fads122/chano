import * as THREE from "three";

const TILE_WIDTH = 128;
const STRAP_HEIGHT = 64;
/** One logo tile + one blank tile = seamless logo, blank, logo, blank repeat. */
const TILE_COUNT = 2;

type LogoImage = CanvasImageSource & { width: number; height: number };

function drawStrapBase(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const baseGradient = ctx.createLinearGradient(0, 0, 0, height);
  baseGradient.addColorStop(0, "#101010");
  baseGradient.addColorStop(0.35, "#1c1c1c");
  baseGradient.addColorStop(0.65, "#1c1c1c");
  baseGradient.addColorStop(1, "#101010");
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, 0, width, height);

  const edgeGradient = ctx.createLinearGradient(0, 0, width, 0);
  edgeGradient.addColorStop(0, "rgba(45, 156, 219, 0.18)");
  edgeGradient.addColorStop(0.5, "rgba(26, 188, 156, 0.18)");
  edgeGradient.addColorStop(1, "rgba(45, 156, 219, 0.18)");
  ctx.fillStyle = edgeGradient;
  ctx.fillRect(0, 0, width, 2);
  ctx.fillRect(0, height - 2, width, 2);
}

function drawLogoTile(
  ctx: CanvasRenderingContext2D,
  logo: LogoImage,
  offsetX: number,
  height: number,
) {
  const padding = 10;
  const maxWidth = TILE_WIDTH * 0.72;
  const maxHeight = height - padding * 2;
  const scale = Math.min(maxWidth / logo.width, maxHeight / logo.height);
  const drawWidth = logo.width * scale;
  const drawHeight = logo.height * scale;
  const drawX = offsetX + (TILE_WIDTH - drawWidth) / 2;
  const drawY = (height - drawHeight) / 2;

  ctx.drawImage(logo, drawX, drawY, drawWidth, drawHeight);
}

export function createLanyardTexture(logo: LogoImage): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TILE_WIDTH * TILE_COUNT;
  canvas.height = STRAP_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create lanyard texture canvas context.");
  }

  drawStrapBase(ctx, canvas.width, STRAP_HEIGHT);

  for (let tileIndex = 0, x = 0; x < canvas.width; x += TILE_WIDTH, tileIndex++) {
    if (tileIndex % 2 === 0) {
      drawLogoTile(ctx, logo, x, STRAP_HEIGHT);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.needsUpdate = true;

  return texture;
}
