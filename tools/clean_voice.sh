#!/usr/bin/env bash
# Usage: tools/clean_voice.sh in.wav out.wav <speech_start_s> <speech_end_s>
# RNNoise + spectral denoise, silence outside the spoken line, light voice EQ and loudness.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
s="$3"; e="$4"
ffmpeg -v error -y -i "$1" -af "aresample=48000,arnndn=m=$here/models/sh.rnnn:mix=1,afftdn=nr=12:nf=-50,aresample=44100,\
volume=enable='lt(t,$s)':volume=0,volume=enable='gt(t,$e)':volume=0,\
highpass=f=80,equalizer=f=3000:t=q:w=1.2:g=3,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=80:makeup=1.5,\
loudnorm=I=-15:TP=-1.5:LRA=7" -ar 44100 "$2"
