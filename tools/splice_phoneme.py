import sys, numpy as np, wave
def rd(p):
    w = wave.open(p); sr = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32); return a, sr
def wr(p, a, sr):
    w = wave.open(p, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(np.clip(a, -32768, 32767).astype(np.int16).tobytes())
full, sr = rd(sys.argv[1]); n, _ = rd(sys.argv[2]); t0, t1 = float(sys.argv[3]), float(sys.argv[4])
i0, i1 = int(t0 * sr), int(t1 * sr); L = i1 - i0
n = n[:L] if len(n) >= L else np.pad(n, (0, L - len(n)))
rms = lambda x: np.sqrt(np.mean(x ** 2)) + 1e-9
ctx = np.concatenate([full[i0 - int(0.03 * sr):i0], full[i1:i1 + int(0.03 * sr)]])
n = n * min(rms(ctx) * 0.7 / rms(n), 4.0)  # nasal murmur a bit quieter than vowels
fx = int(0.012 * sr); ramp = np.linspace(0, 1, fx)
out = full.copy()
seg = out[i0:i1].copy()
mix = n.copy()
mix[:fx] = seg[:fx] * (1 - ramp) + n[:fx] * ramp
mix[-fx:] = n[-fx:] * (1 - ramp) + seg[-fx:] * ramp
out[i0:i1] = mix
wr(sys.argv[5], out, sr)
