export type IdCardDetails = {
  name: string;
  title: string;
  idCode: string;
  location?: string;
};

type ImageSource = CanvasImageSource & { width: number; height: number };

const COLORS = {
  card: "#161616",
  cardDeep: "#0e0e0e",
  accent: "#2d9cdb",
  text: "#ffffff",
  muted: "#8a8a8a",
  faint: "#4a4a4a",
  border: "rgba(255, 255, 255, 0.08)",
  borderStrong: "rgba(255, 255, 255, 0.14)",
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawCornerTicks(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  inset: number,
  len: number,
) {
  ctx.strokeStyle = "rgba(45, 156, 219, 0.45)";
  ctx.lineWidth = Math.max(1, w * 0.003);
  const corners = [
    [x + inset, y + inset + len, x + inset, y + inset, x + inset + len, y + inset],
    [x + w - inset - len, y + inset, x + w - inset, y + inset, x + w - inset, y + inset + len],
    [x + inset, y + h - inset - len, x + inset, y + h - inset, x + inset + len, y + h - inset],
    [
      x + w - inset - len,
      y + h - inset,
      x + w - inset,
      y + h - inset,
      x + w - inset,
      y + h - inset - len,
    ],
  ] as const;

  corners.forEach(([mx, my, cx, cy, ex, ey]) => {
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(cx, cy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
  });
}

export function paintIdCardFront(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  photo: ImageSource,
  logo: ImageSource | null,
  details: IdCardDetails,
): void {
  const pad = w * 0.06;
  const headerH = h * 0.105;
  const footerH = h * 0.105;
  const photoW = w - pad * 2;
  const photoH = h * 0.46;
  const photoX = x + pad;
  const photoY = y + headerH + h * 0.028;

  ctx.save();
  roundRect(ctx, x, y, w, h, w * 0.042);
  ctx.clip();

  const cardGrad = ctx.createLinearGradient(x, y, x + w * 0.2, y + h);
  cardGrad.addColorStop(0, "#1c1c1c");
  cardGrad.addColorStop(0.5, COLORS.card);
  cardGrad.addColorStop(1, COLORS.cardDeep);
  ctx.fillStyle = cardGrad;
  ctx.fillRect(x, y, w, h);

  const sheen = ctx.createLinearGradient(x, y, x + w, y + h * 0.35);
  sheen.addColorStop(0, "rgba(255,255,255,0.035)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(x, y, w, h * 0.35);

  ctx.fillStyle = COLORS.accent;
  ctx.globalAlpha = 0.85;
  ctx.fillRect(x, y, w, Math.max(1.5, h * 0.004));
  ctx.globalAlpha = 1;

  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = Math.max(1, w * 0.0025);
  ctx.beginPath();
  ctx.moveTo(x + pad * 0.6, y + headerH);
  ctx.lineTo(x + w - pad * 0.6, y + headerH);
  ctx.stroke();

  if (logo) {
    const logoH = headerH * 0.58;
    const logoW = logoH * 2.4;
    const logoScale = Math.min(logoW / logo.width, logoH / logo.height);
    const lw = logo.width * logoScale;
    const lh = logo.height * logoScale;
    ctx.drawImage(logo, x + pad, y + (headerH - lh) / 2, lw, lh);
  }

  ctx.fillStyle = COLORS.faint;
  ctx.font = `600 ${Math.round(h * 0.028)}px system-ui, sans-serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText("DEVELOPER ID", x + w - pad, y + headerH / 2);

  const framePad = w * 0.012;
  const frameX = photoX - framePad;
  const frameY = photoY - framePad;
  const frameW = photoW + framePad * 2;
  const frameH = photoH + framePad * 2;

  ctx.strokeStyle = "rgba(45, 156, 219, 0.22)";
  ctx.lineWidth = Math.max(1, w * 0.004);
  roundRect(ctx, frameX, frameY, frameW, frameH, w * 0.028);
  ctx.stroke();

  ctx.strokeStyle = COLORS.borderStrong;
  ctx.lineWidth = Math.max(1, w * 0.0025);
  roundRect(ctx, photoX, photoY, photoW, photoH, w * 0.024);
  ctx.stroke();

  ctx.save();
  roundRect(ctx, photoX, photoY, photoW, photoH, w * 0.022);
  ctx.clip();
  ctx.fillStyle = "#080808";
  ctx.fillRect(photoX, photoY, photoW, photoH);

  const photoScale = Math.max(photoW / photo.width, photoH / photo.height);
  const pw = photo.width * photoScale;
  const ph = photo.height * photoScale;
  ctx.drawImage(
    photo,
    photoX + (photoW - pw) / 2,
    photoY + (photoH - ph) / 2 - photoH * 0.02,
    pw,
    ph,
  );

  const photoFade = ctx.createLinearGradient(0, photoY + photoH * 0.55, 0, photoY + photoH);
  photoFade.addColorStop(0, "rgba(14,14,14,0)");
  photoFade.addColorStop(1, "rgba(14,14,14,0.55)");
  ctx.fillStyle = photoFade;
  ctx.fillRect(photoX, photoY, photoW, photoH);
  ctx.restore();

  const infoY = photoY + photoH + h * 0.038;
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.text;
  ctx.font = `700 ${Math.round(h * 0.052)}px system-ui, sans-serif`;
  ctx.fillText(details.name, x + w / 2, infoY);

  const accentLineW = w * 0.12;
  ctx.strokeStyle = COLORS.accent;
  ctx.lineWidth = Math.max(1.5, w * 0.004);
  ctx.beginPath();
  ctx.moveTo(x + w / 2 - accentLineW / 2, infoY + h * 0.028);
  ctx.lineTo(x + w / 2 + accentLineW / 2, infoY + h * 0.028);
  ctx.stroke();

  ctx.fillStyle = COLORS.muted;
  ctx.font = `500 ${Math.round(h * 0.031)}px system-ui, sans-serif`;
  const titleLines = wrapText(ctx, details.title, w - pad * 2.2);
  let titleY = infoY + h * 0.058;
  titleLines.forEach((line) => {
    ctx.fillText(line, x + w / 2, titleY);
    titleY += h * 0.034;
  });

  const footerY = y + h - footerH;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(x, footerY, w, footerH);

  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + pad * 0.6, footerY);
  ctx.lineTo(x + w - pad * 0.6, footerY);
  ctx.stroke();

  ctx.fillStyle = COLORS.accent;
  ctx.font = `600 ${Math.round(h * 0.028)}px ui-monospace, monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(details.idCode, x + pad, footerY + footerH / 2);

  if (details.location) {
    ctx.fillStyle = COLORS.faint;
    ctx.font = `500 ${Math.round(h * 0.027)}px system-ui, sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText(details.location, x + w - pad, footerY + footerH / 2);
  }

  drawCornerTicks(ctx, x, y, w, h, pad * 0.55, w * 0.045);

  ctx.restore();

  ctx.save();
  roundRect(ctx, x, y, w, h, w * 0.042);
  ctx.strokeStyle = COLORS.borderStrong;
  ctx.lineWidth = Math.max(1, w * 0.0035);
  ctx.stroke();
  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = words[0] ?? "";

  for (let i = 1; i < words.length; i += 1) {
    const next = `${current} ${words[i]}`;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      lines.push(current);
      current = words[i] ?? "";
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 2);
}
