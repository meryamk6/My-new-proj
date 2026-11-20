# Stronger voiced /b/: low voice bar + clear diffuse labial release burst.
import sys, numpy as np, wave
w = wave.open(sys.argv[1]); sr = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)
t0, t1 = float(sys.argv[3]), float(sys.argv[4]); bar_gain, burst_gain = float(sys.argv[5]), float(sys.argv[6])
i0, i1 = int(t0 * sr), int(t1 * sr); L = i1 - i0
v = a[i1 + int(0.005 * sr): i1 + int(0.005 * sr) + L].copy()
vr = np.sqrt(np.mean(v ** 2))
spec = np.fft.rfft(v); f = np.fft.rfftfreq(len(v), 1 / sr); spec[f > 300] = 0
bar = np.fft.irfft(spec, len(v)); bar *= vr * bar_gain / (np.sqrt(np.mean(bar ** 2)) + 1e-9)
rng = np.random.default_rng(0); bl = int(0.008 * sr)
nz = rng.standard_normal(bl)
s = np.fft.rfft(nz); ff = np.fft.rfftfreq(bl, 1 / sr); s[(ff < 400) | (ff > 3500)] = 0
burst = np.fft.irfft(s, bl) * np.exp(-np.linspace(0, 5, bl))
burst *= vr * burst_gain / (np.max(np.abs(burst)) + 1e-9)
new = bar.copy(); new[-bl:] += burst
fx = int(0.005 * sr); r = np.linspace(0, 1, fx)
new[:fx] = a[i0:i0 + fx] * (1 - r) + new[:fx] * r
out = a.copy(); out[i0:i1] = new
o = wave.open(sys.argv[2], "wb"); o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes(np.clip(out, -32768, 32767).astype(np.int16).tobytes())
