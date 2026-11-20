import sys, os, glob, time, torch, numpy as np
from torch import nn
from torch.nn import functional as F
from PIL import Image

class SRVGG(nn.Module):
    def __init__(s, nf=64, nc=32, up=4):
        super().__init__()
        s.up = up
        b = [nn.Conv2d(3, nf, 3, 1, 1), nn.PReLU(nf)]
        for _ in range(nc):
            b += [nn.Conv2d(nf, nf, 3, 1, 1), nn.PReLU(nf)]
        b += [nn.Conv2d(nf, 3 * up * up, 3, 1, 1)]
        s.body = nn.ModuleList(b)
        s.ps = nn.PixelShuffle(up)
    def forward(s, x):
        o = x
        for m in s.body: o = m(o)
        return s.ps(o) + F.interpolate(x, scale_factor=s.up, mode="nearest")

weights, src, dst, W, H = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5])
torch.set_num_threads(4)
m = SRVGG(); sd = torch.load(weights, map_location="cpu"); m.load_state_dict(sd.get("params", sd)); m.eval()
files = sorted(glob.glob(os.path.join(src, "*.png"))) if os.path.isdir(src) else [src]
os.makedirs(dst, exist_ok=True)
t0 = time.time()
for i, f in enumerate(files):
    out = os.path.join(dst, os.path.basename(f))
    if os.path.exists(out): continue
    a = np.asarray(Image.open(f).convert("RGB"), dtype=np.float32) / 255.0
    x = torch.from_numpy(a).permute(2, 0, 1)[None]
    with torch.inference_mode():
        y = m(x).clamp(0, 1)[0].permute(1, 2, 0).numpy()
    im = Image.fromarray((y * 255).round().astype(np.uint8)).resize((W, H), Image.LANCZOS)
    im.save(out)
    if i % 20 == 0: print(i, len(files), f"{time.time()-t0:.1f}s", flush=True)
print("done", time.time() - t0)
