# Replace the /f/-like frication after the /q/ burst with a voiced /b/ closure.
import sys, numpy as np, wave
w = wave.open(sys.argv[1]); sr = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)
t0, t1 = float(sys.argv[3]), float(sys.argv[4])
i0, i1 = int(t0 * sr), int(t1 * sr); L = i1 - i0
v = a[i1 + int(0.005 * sr): i1 + int(0.005 * sr) + L].copy()          # following vowel
spec = np.fft.rfft(v); f = np.fft.rfftfreq(len(v), 1 / sr)
spec[f > 300] = 0                                                       # voice bar: only low frequencies
bar = np.fft.irfft(spec, len(v))
bar *= (np.sqrt(np.mean(v ** 2)) * 0.12) / (np.sqrt(np.mean(bar ** 2)) + 1e-9)
burst_len = int(0.006 * sr)
burst = a[i1 - burst_len:i1] * 0.35                                     # weak release
new = bar.copy(); new[-burst_len:] += burst
fx = int(0.005 * sr); r = np.linspace(0, 1, fx)
new[:fx] = a[i0:i0 + fx] * (1 - r) + new[:fx] * r
out = a.copy(); out[i0:i1] = new
o = wave.open(sys.argv[2], "wb"); o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes(np.clip(out, -32768, 32767).astype(np.int16).tobytes())
