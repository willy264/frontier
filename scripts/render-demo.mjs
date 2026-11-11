// Render authentic captured scenes with local synthetic speech and burned captions.
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root = process.cwd();
const ffmpeg = path.resolve('data/video-tools/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe');
const capture = JSON.parse(await fs.readFile('data/video/capture.json', 'utf8'));
const finalDir = 'apps/game/public/demo';
await fs.mkdir(finalDir, { recursive: true });
function run(args) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-nostdin', '-y', ...args], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr.slice(-7000));
  return result.stderr;
}
function duration(file) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-i', file], { encoding: 'utf8' });
  const match = result.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/);
  if (!match) throw new Error(`Missing duration: ${file}`);
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}
function assTime(s) {
  return `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${(s % 60).toFixed(2).padStart(5, '0')}`;
}
function srtTime(s) {
  const ms = Math.round(s * 1000);
  return `${String(Math.floor(ms / 3600000)).padStart(2,'0')}:${String(Math.floor(ms / 60000) % 60).padStart(2,'0')}:${String(Math.floor(ms / 1000) % 60).padStart(2,'0')},${String(ms % 1000).padStart(3,'0')}`;
}
const header = `[Script Info]\nScriptType: v4.00+\nPlayResX: 1920\nPlayResY: 1080\nWrapStyle: 0\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Caption,Arial,32,&H00FFFFFF,&H00FFFFFF,&H00152936,&H00152936,0,0,0,0,100,100,0,0,3,12,0,2,90,90,35,1\nStyle: Title,Arial,28,&H00E1E9B9,&H00FFFFFF,&H00152936,&H00152936,1,0,0,0,100,100,1,0,1,0,0,7,60,60,14,1\nStyle: Note,Arial,19,&H00FFFFFF,&H00FFFFFF,&H00152936,&H00152936,0,0,0,0,100,100,0,0,1,1,0,9,60,60,18,1\nStyle: Outro,Arial,48,&H00FFFFFF,&H00FFFFFF,&H00152936,&H00152936,1,0,0,0,100,100,0,0,3,20,0,5,90,90,0,1\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;
let offset = 0;
const captions = [];
const segments = [];
for (const scene of capture.scenes) {
  const audioFile = `data/video/audio/${scene.id}.wav`;
  const spoken = duration(audioFile);
  const length = spoken + 0.35;
  // Leave a small margin so video timestamp jitter cannot freeze the next scene.
  const sourceLength = Math.max(0.1, scene.end - scene.start - 0.5);
  // Shorten waits only when necessary; no fabricated UI or transaction results.
  const speed = Math.min(1, length / sourceLength);
  const sentences = scene.narration.match(/[^.!?]+[.!?]+/g)?.map(s=>s.trim()) ?? [scene.narration];
  let t = 0.18;
  let events = `Dialogue: 0,0:00:00.00,${assTime(length)},Title,,0,0,0,,${scene.title}\n`;
  const note = scene.id === 'depart' || scene.id === 'arrive' ? 'LIVE TESTNET / SCRIPTED RIVAL / WAITS SHORTENED' : 'LIVE TESTNET / SYNTHETIC VOICEOVER';
  events += `Dialogue: 0,0:00:00.00,${assTime(length)},Note,,0,0,0,,${note}\n`;
  for (const sentence of sentences) {
    const d = spoken * sentence.length / sentences.join('').length;
    const end = Math.min(length, t + d);
    events += `Dialogue: 1,${assTime(t)},${assTime(end)},Caption,,0,0,0,,${sentence}\n`;
    captions.push({ start: offset + t, end: offset + end, text: sentence });
    t = end;
  }
  if (scene.id === 'outro') {
    events += `Dialogue: 2,0:00:00.00,${assTime(length)},Outro,,0,0,0,,{\\fs76}FRONTIER\\N{\\fs40}frontier-willy264s-projects.vercel.app\\N{\\fs30}github.com/willy264/frontier\\N\\N{\\fs26}Built at NEAR HACKATHON / Testnet MVP\n`;
  }
  const subtitlePath = `data/video/${scene.id}.ass`;
  await fs.writeFile(subtitlePath, header.replaceAll('&H00152936', '&H00362915') + events);
  const segment = `data/video/${scene.id}.mp4`;
  const filter = `setpts=${speed}*(PTS-STARTPTS),fps=30,tpad=stop_mode=clone:stop_duration=${length},scale=1728:972,pad=1920:1080:96:54:color=0x152936,ass=${subtitlePath}`;
  run(['-ss', String(scene.start), '-t', String(sourceLength), '-i', 'data/video/capture.webm', '-i', audioFile, '-vf', filter, '-af', 'apad,loudnorm=I=-16:TP=-1.5:LRA=11', '-t', length.toFixed(3), '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-ar', '48000', '-b:a', '160k', '-movflags', '+faststart', segment]);
  console.log(`Rendered ${scene.id}: ${length.toFixed(1)}s`);
  segments.push(`file '${scene.id}.mp4'`);
  scene.videoStart = offset;
  scene.videoDuration = length;
  offset += length;
}
await fs.writeFile('data/video/concat.txt', segments.join('\n'));
const final = `${finalDir}/frontier-demo.mp4`;
run(['-f','concat','-safe','0','-i','data/video/concat.txt','-c','copy','-movflags','+faststart',final]);
run(['-i',final,'-vn','-c:a','libmp3lame','-q:a','2',`${finalDir}/frontier-voiceover.mp3`]);
await fs.writeFile(`${finalDir}/frontier-demo.srt`, captions.map((c,i)=>`${i+1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${c.text}\n`).join('\n'));
await fs.writeFile('submission/voiceover-script.md', '# FRONTIER demo narration\n\nVoice: Microsoft Hazel Desktop, generated locally. Synthetic narration, not a human voice clone. Footage: real public app and testnet transactions; waits shortened.\n\n' + capture.scenes.map(s=>`## ${s.title}\n\n${s.narration}`).join('\n\n') + '\n');
const seconds = duration(final);
if (seconds > 120) throw new Error(`Demo is ${seconds}s; shorten narration to fit two minutes.`);
run(['-ss','3','-i',final,'-frames:v','1','-q:v','2',`${finalDir}/poster.jpg`]);
const bytes = await fs.readFile(final);
await fs.writeFile('results/video-demo.json', JSON.stringify({
  recordedAt: capture.recordedAt, site: capture.site, contract: capture.world,
  captain: capture.captain, durationSeconds: seconds, resolution: '1920x1080',
  videoCodec: 'H.264', audioCodec: 'AAC', voice: 'Microsoft Hazel Desktop (synthetic)',
  sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length,
  file: final, disclosures: capture.disclosures, keyCleanup: capture.keyCleanup,
  transactions: capture.evidence, afterBuy: capture.afterBuy,
  afterArrival: capture.afterArrival, finalPlayer: capture.finalPlayer,
  chapters: capture.scenes.map(s=>({ title: s.title, startSeconds: s.videoStart, durationSeconds: s.videoDuration })),
}, null, 2));
// Decode the complete export, including its audio, to verify the deliverable.
run(['-v','error','-i',final,'-f','null','-']);
console.log(`Finished ${seconds.toFixed(1)} seconds, ${(bytes.length/1048576).toFixed(1)} MiB: ${path.join(root,final)}`);
