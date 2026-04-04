import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

const sizes = [32, 180, 192, 512];

for (const size of sizes) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 背景グラデーション（ダークパープル）
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, '#1a1a2e');
  bg.addColorStop(1, '#16213e');
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.22);
  ctx.fill();

  const cx = size / 2;
  const scale = size / 180;

  // ビアジョッキを描画
  const mugX = cx - 38 * scale;
  const mugY = size * 0.18;
  const mugW = 58 * scale;
  const mugH = 72 * scale;
  const handleW = 18 * scale;

  // ビールグラデーション
  const beerGrad = ctx.createLinearGradient(mugX, mugY, mugX + mugW, mugY + mugH);
  beerGrad.addColorStop(0, '#f59e0b');
  beerGrad.addColorStop(0.5, '#d97706');
  beerGrad.addColorStop(1, '#92400e');

  // ジョッキ本体
  ctx.beginPath();
  ctx.moveTo(mugX + mugW * 0.08, mugY + mugH * 0.18);
  ctx.lineTo(mugX + mugW * 0.12, mugY + mugH);
  ctx.lineTo(mugX + mugW * 0.88, mugY + mugH);
  ctx.lineTo(mugX + mugW * 0.92, mugY + mugH * 0.18);
  ctx.closePath();
  ctx.fillStyle = beerGrad;
  ctx.fill();

  // 泡（白）
  const foamY = mugY + mugH * 0.18;
  ctx.beginPath();
  ctx.ellipse(mugX + mugW * 0.5, foamY, mugW * 0.42, mugH * 0.12, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.fill();

  // 小泡
  const bubbles = [
    [0.3, 0.12], [0.5, 0.08], [0.7, 0.12], [0.2, 0.17], [0.8, 0.17]
  ];
  bubbles.forEach(([bx, by]) => {
    ctx.beginPath();
    ctx.arc(mugX + mugW * bx, foamY + mugH * by * 0.5, mugW * 0.07, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fill();
  });

  // ハンドル
  ctx.beginPath();
  ctx.arc(mugX + mugW + handleW * 0.3, mugY + mugH * 0.45, handleW * 0.85, -Math.PI * 0.35, Math.PI * 0.35);
  ctx.strokeStyle = beerGrad;
  ctx.lineWidth = handleW * 0.45;
  ctx.stroke();

  // 光沢ライン
  ctx.beginPath();
  ctx.moveTo(mugX + mugW * 0.22, mugY + mugH * 0.25);
  ctx.lineTo(mugX + mugW * 0.18, mugY + mugH * 0.85);
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 3 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();

  // アプリ名（小さめ）
  ctx.font = `bold ${12 * scale}px sans-serif`;
  ctx.fillStyle = 'rgba(167,139,250,0.9)';
  ctx.textAlign = 'center';
  ctx.fillText('Mindful', cx, size * 0.88);

  writeFileSync(`public/icon-${size}.png`, canvas.toBuffer('image/png'));
  console.log(`Generated icon-${size}.png`);
}
