"""Generate FRONTIER's original sail mark and a game-map social card."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

app = Path('apps/game/app')
public = Path('apps/game/public')
public.mkdir(exist_ok=True)
canvas, brass, ink = '#091d29', '#e9b75e', '#eee8d9'
mark = Image.new('RGB', (512, 512), canvas)
draw = ImageDraw.Draw(mark)
for points in [[(248,72),(248,344),(96,344)],[(272,128),(400,344),(272,344)],[(88,368),(424,368),(360,440),(152,440)]]:
    draw.polygon(points, fill=brass)
mark.save(app/'favicon.ico', sizes=[(32,32)])
mark.resize((180,180), Image.Resampling.LANCZOS).save(app/'apple-icon.png')
for size in [192,512]:
    mark.resize((size,size), Image.Resampling.LANCZOS).save(public/f'icon-{size}.png')
card=Image.new('RGB',(1200,630),canvas)
d=ImageDraw.Draw(card)
font=ImageFont.truetype('C:/Windows/Fonts/bahnschrift.ttf',72)
body=ImageFont.truetype('C:/Windows/Fonts/bahnschrift.ttf',24)
d.text((64,40),'FRONTIER',font=font,fill=ink)
d.text((64,130),'Trade the tides. NEAR testnet.',font=body,fill=brass)
ports=[(160,330,'Bitcoin Isle'),(530,255,'Solana Reef'),(985,330,'Base Harbor'),(340,505,'Tron Bay'),(820,505,'NEAR Capital')]
for a,b in [(0,1),(1,2),(0,3),(3,4),(2,4)]:
    d.line([ports[a][:2],ports[b][:2]],fill='#728d9b',width=3)
for x,y,name in ports:
    d.ellipse((x-12,y-12,x+12,y+12),fill=brass)
    d.text((x,y+24),name,font=body,fill=ink,anchor='mt')
card.save(app/'opengraph-image.png')
