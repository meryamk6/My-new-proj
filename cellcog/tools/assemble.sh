#!/usr/bin/env bash
# Builds the fully animated film from the free image-to-video clips.
# Usage: assemble.sh <clips_dir> <out.mp4>
# clips_dir holds 01_title.mp4 05_conversation.mp4 06_dont_be_afraid.mp4 07a_walk_hill.mp4
# 07b_splash_water.mp4 08_mama_roar.mp4 09_hug.mp4 10a_home_mama.mp4 10b_moon_night.mp4
# (any missing clip falls back to its still with a slow zoom).
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
CLIPS="$1"; OUT="$2"; SRC="$HERE/mohamed_ali_wa_dinosaur.mp4"; KIT="$HERE/kit"
W=$(mktemp -d)
# name:start:end  (seconds in the narrated film)
SCENES="01_title:0:6 05_conversation:39.5:49.5 06_dont_be_afraid:49.5:56 07a_walk_hill:56:62.3 07b_splash_water:62.3:67.6 08_mama_roar:67.6:77.6 09_hug:77.6:90.7 10a_home_mama:90.7:104 10b_moon_night:104:110.87"
VF="scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=25,format=yuv420p,setsar=1"
for s in $SCENES; do
  IFS=: read -r n a b <<<"$s"; d=$(python3 -c "print(round($b-$a,3))")
  if [ -f "$CLIPS/$n.mp4" ]; then
    cd_=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$CLIPS/$n.mp4")
    # stretch (slow down) or trim the clip to exactly fit the narration window
    f=$(python3 -c "print(max(1.0,$d/$cd_))")
    ffmpeg -v error -y -i "$CLIPS/$n.mp4" -an -vf "setpts=$f*PTS,$VF" -t "$d" -c:v libx264 -crf 18 "$W/$n.mp4"
  else
    ffmpeg -v error -y -loop 1 -i "$KIT/jpg/$n.jpg" -vf "scale=2112:-1,zoompan=z='1+0.0015*on':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1920x1080:fps=25,format=yuv420p,setsar=1" -t "$d" -c:v libx264 -crf 18 "$W/$n.mp4"
  fi
done
# animated scenes 2-4 already have subtitles burned in: reuse them from the narrated film
ffmpeg -v error -y -ss 6 -to 39.5 -i "$SRC" -an -vf "$VF" -c:v libx264 -crf 18 "$W/02_animated.mp4"
cat > "$W/list.txt" <<L
file '$W/01_title.mp4'
file '$W/02_animated.mp4'
file '$W/05_conversation.mp4'
file '$W/06_dont_be_afraid.mp4'
file '$W/07a_walk_hill.mp4'
file '$W/07b_splash_water.mp4'
file '$W/08_mama_roar.mp4'
file '$W/09_hug.mp4'
file '$W/10a_home_mama.mp4'
file '$W/10b_moon_night.mp4'
L
ffmpeg -v error -y -f concat -safe 0 -i "$W/list.txt" -c copy "$W/video.mp4"
cp "$HERE/tools/subs.ass" "$W/subs.ass"
ffmpeg -v error -y -i "$W/video.mp4" -i "$SRC" -map 0:v -map 1:a -vf "subtitles=$W/subs.ass,fade=t=out:st=109.4:d=1.4" -c:v libx264 -crf 19 -preset medium -c:a copy -shortest -movflags +faststart "$OUT"
rm -rf "$W"; echo "done: $OUT"
