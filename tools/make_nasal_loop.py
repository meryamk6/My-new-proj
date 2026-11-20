import sys, numpy as np, wave
w = wave.open(sys.argv[1]); sr = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)
m = a[int(1.815 * sr):int(1.885 * sr)]
m = m / (np.sqrt(np.mean(m ** 2)) + 1e-9) * 1000
fx = int(0.015 * sr); r = np.linspace(0, 1, fx)
out = np.concatenate([m[:-fx], m[-fx:] * (1 - r) + m[:fx] * r, m[fx:]])
o = wave.open(sys.argv[2], "wb"); o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes(out.astype(np.int16).tobytes())
print(len(out) / sr)
