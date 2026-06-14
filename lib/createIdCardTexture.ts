export type IdCardDetails = {
  name: string;
  title: string;
  idCode: string;
  location?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  skills?: readonly string[];
};

type ImageSource = CanvasImageSource & { width: number; height: number };

const COLORS = {
  cardTop: "#1a1a1a",
  cardMid: "#161616",
  cardBottom: "#111111",
  accent: "#2d9cdb",
  text: "#ffffff",
  muted: "#888888",
  faint: "#555555",
  border: "rgba(255, 255, 255, 0.08)",
  borderStrong: "rgba(255, 255, 255, 0.14)",
  photoBg: "#0e0e0e",
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
  ctx.strokeStyle = "rgba(45, 156, 219, 0.4)";
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

function drawCardPattern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const spacing = Math.max(8, w * 0.028);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.028)";
  ctx.lineWidth = 1;

  for (let gx = x; gx < x + w; gx += spacing) {
    ctx.beginPath();
    ctx.moveTo(gx, y);
    ctx.lineTo(gx, y + h);
    ctx.stroke();
  }

  for (let gy = y; gy < y + h; gy += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, gy);
    ctx.lineTo(x + w, gy);
    ctx.stroke();
  }
}

function drawCoverPhoto(
  ctx: CanvasRenderingContext2D,
  photo: ImageSource,
  destX: number,
  destY: number,
  destW: number,
  destH: number,
  focalX = 0.5,
  focalY = 0.36,
) {
  const imgAspect = photo.width / photo.height;
  const destAspect = destW / destH;

  let sx = 0;
  let sy = 0;
  let sw = photo.width;
  let sh = photo.height;

  if (imgAspect > destAspect) {
    sw = photo.height * destAspect;
    sx = (photo.width - sw) * focalX;
  } else {
    sh = photo.width / destAspect;
    sy = (photo.height - sh) * focalY;
  }

  ctx.drawImage(photo, sx, sy, sw, sh, destX, destY, destW, destH);
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
  const photoH = h * 0.47;
  const photoX = x + pad;
  const photoY = y + headerH + h * 0.024;

  ctx.save();
  roundRect(ctx, x, y, w, h, w * 0.042);
  ctx.clip();

  const cardGrad = ctx.createLinearGradient(x, y, x + w * 0.25, y + h);
  cardGrad.addColorStop(0, COLORS.cardTop);
  cardGrad.addColorStop(0.5, COLORS.cardMid);
  cardGrad.addColorStop(1, COLORS.cardBottom);
  ctx.fillStyle = cardGrad;
  ctx.fillRect(x, y, w, h);

  drawCardPattern(ctx, x, y, w, h);

  const sheen = ctx.createLinearGradient(x, y, x + w, y + h * 0.35);
  sheen.addColorStop(0, "rgba(255,255,255,0.035)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(x, y, w, h * 0.35);

  ctx.fillStyle = COLORS.accent;
  ctx.globalAlpha = 0.9;
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
  ctx.fillStyle = COLORS.photoBg;
  ctx.fillRect(photoX, photoY, photoW, photoH);
  drawCoverPhoto(ctx, photo, photoX, photoY, photoW, photoH, 0.5, 0.36);
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
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
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

function truncateMiddle(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const keep = Math.max(4, Math.floor((maxLen - 1) / 2));
  return `${text.slice(0, keep)}…${text.slice(-keep + 1)}`;
}

export function paintIdCardBack(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  logo: ImageSource | null,
  details: IdCardDetails,
): void {
  const pad = w * 0.06;
  const headerH = h * 0.105;
  const footerH = h * 0.105;

  ctx.save();
  roundRect(ctx, x, y, w, h, w * 0.042);
  ctx.clip();

  const cardGrad = ctx.createLinearGradient(x, y + h, x + w * 0.3, y);
  cardGrad.addColorStop(0, COLORS.cardBottom);
  cardGrad.addColorStop(0.5, COLORS.cardMid);
  cardGrad.addColorStop(1, COLORS.cardTop);
  ctx.fillStyle = cardGrad;
  ctx.fillRect(x, y, w, h);

  drawCardPattern(ctx, x, y, w, h);

  const sheen = ctx.createLinearGradient(x, y + h * 0.65, x, y);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(255,255,255,0.03)");
  ctx.fillStyle = sheen;
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = COLORS.accent;
  ctx.globalAlpha = 0.9;
  ctx.fillRect(x, y + h - Math.max(1.5, h * 0.004), w, Math.max(1.5, h * 0.004));
  ctx.globalAlpha = 1;

  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = Math.max(1, w * 0.0025);
  ctx.beginPath();
  ctx.moveTo(x + pad * 0.6, y + headerH);
  ctx.lineTo(x + w - pad * 0.6, y + headerH);
  ctx.stroke();

  ctx.fillStyle = COLORS.faint;
  ctx.font = `600 ${Math.round(h * 0.028)}px system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("CREDENTIALS", x + pad, y + headerH / 2);

  ctx.textAlign = "right";
  ctx.fillText("BACK", x + w - pad, y + headerH / 2);

  const stripeH = h * 0.038;
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.fillRect(x + pad, y + headerH + h * 0.03, w - pad * 2, stripeH);
  ctx.fillStyle = "rgba(45, 156, 219, 0.12)";
  ctx.fillRect(x + pad, y + headerH + h * 0.03 + stripeH * 0.35, w - pad * 2, stripeH * 0.3);

  const logoAreaY = y + headerH + h * 0.11;
  const logoAreaH = h * 0.22;

  if (logo) {
    const logoMaxH = logoAreaH * 0.88;
    const logoMaxW = w * 0.52;
    const logoScale = Math.min(logoMaxW / logo.width, logoMaxH / logo.height);
    const lw = logo.width * logoScale;
    const lh = logo.height * logoScale;
    const lx = x + (w - lw) / 2;
    const ly = logoAreaY + (logoAreaH - lh) / 2;

    ctx.shadowColor = "rgba(45, 156, 219, 0.25)";
    ctx.shadowBlur = w * 0.025;
    ctx.drawImage(logo, lx, ly, lw, lh);
    ctx.shadowBlur = 0;
  }

  const nameY = logoAreaY + logoAreaH + h * 0.028;
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.text;
  ctx.font = `700 ${Math.round(h * 0.038)}px system-ui, sans-serif`;
  ctx.fillText(details.name, x + w / 2, nameY);

  const accentLineW = w * 0.1;
  ctx.strokeStyle = COLORS.accent;
  ctx.lineWidth = Math.max(1.5, w * 0.004);
  ctx.beginPath();
  ctx.moveTo(x + w / 2 - accentLineW / 2, nameY + h * 0.024);
  ctx.lineTo(x + w / 2 + accentLineW / 2, nameY + h * 0.024);
  ctx.stroke();

  const contactY = nameY + h * 0.055;
  const rowH = h * 0.048;
  const contacts = [
    details.email && { label: "EMAIL", value: details.email },
    details.github && { label: "GITHUB", value: details.github },
    details.linkedin && { label: "LINKEDIN", value: details.linkedin },
  ].filter(Boolean) as { label: string; value: string }[];

  contacts.forEach((item, index) => {
    const rowY = contactY + index * rowH;
    ctx.textAlign = "left";
    ctx.fillStyle = COLORS.accent;
    ctx.font = `600 ${Math.round(h * 0.022)}px ui-monospace, monospace`;
    ctx.fillText(item.label, x + pad, rowY);

    ctx.fillStyle = COLORS.muted;
    ctx.font = `500 ${Math.round(h * 0.026)}px system-ui, sans-serif`;
    ctx.fillText(
      truncateMiddle(item.value.replace(/^https?:\/\//, ""), 28),
      x + pad + w * 0.19,
      rowY,
    );
  });

  if (details.skills && details.skills.length > 0) {
    const skillsY = contactY + contacts.length * rowH + h * 0.02;
    ctx.textAlign = "left";
    ctx.fillStyle = COLORS.faint;
    ctx.font = `600 ${Math.round(h * 0.022)}px system-ui, sans-serif`;
    ctx.fillText("STACK", x + pad, skillsY);

    const pillH = h * 0.034;
    const pillPadX = w * 0.022;
    let pillX = x + pad;
    let pillRowY = skillsY + h * 0.028;
    const maxX = x + w - pad;

    details.skills.slice(0, 6).forEach((skill) => {
      ctx.font = `500 ${Math.round(h * 0.022)}px system-ui, sans-serif`;
      const pillW = ctx.measureText(skill).width + pillPadX * 2;
      if (pillX + pillW > maxX) {
        pillX = x + pad;
        pillRowY += pillH + h * 0.012;
      }
      roundRect(ctx, pillX, pillRowY - pillH * 0.72, pillW, pillH, pillH / 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fill();
      ctx.strokeStyle = "rgba(45, 156, 219, 0.22)";
      ctx.lineWidth = Math.max(1, w * 0.002);
      ctx.stroke();
      ctx.fillStyle = COLORS.muted;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(skill, pillX + pillPadX, pillRowY - pillH * 0.22);
      pillX += pillW + w * 0.014;
    });
  }

  const footerY = y + h - footerH;
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(x, footerY, w, footerH);

  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + pad * 0.6, footerY);
  ctx.lineTo(x + w - pad * 0.6, footerY);
  ctx.stroke();

  ctx.fillStyle = COLORS.faint;
  ctx.font = `500 ${Math.round(h * 0.024)}px system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("Flip for front", x + pad, footerY + footerH / 2);

  ctx.fillStyle = COLORS.accent;
  ctx.font = `600 ${Math.round(h * 0.026)}px ui-monospace, monospace`;
  ctx.textAlign = "right";
  ctx.fillText(details.idCode, x + w - pad, footerY + footerH / 2);

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
