#!/usr/bin/env bash
# ai-video-transcode.sh: turn one raw render into the Live AI Studios loop set.
#
#   scripts/ai-video-transcode.sh <raw-render> <name>
#   scripts/ai-video-transcode.sh ~/Downloads/hero-render.mp4 ai-hero
#
# Emits into public/videos/ai/:
#   <name>.mp4         desktop, 1600px wide
#   <name>-720.mp4     mobile, 1280x720 class
#   <name>-poster.jpg  first frame, 1600px, JPG ~q82
#
# The Kuche recipe: palindrome loop (forward + reverse concat) so the seam
# disappears, libx264 crf 28, audio stripped, +faststart so playback starts
# before the whole file lands. Targets: desktop under 4 MB, mobile under
# 1.5 MB. Drop Jon's Higgsfield renders through this at the SAME names and
# the procedural fallbacks are replaced with no code change.
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "usage: $0 <raw-render> <name>   (e.g. ai-hero)" >&2
  exit 1
fi
IN="$1"
NAME="$2"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/videos/ai"
mkdir -p "$OUT_DIR"

pal() { # $1 width, $2 crf, $3 output
  ffmpeg -hide_banner -loglevel error -y -i "$IN" \
    -filter_complex "[0:v]scale=$1:-2:flags=lanczos,fps=24,format=yuv420p,split[f][b];[b]reverse[r];[f][r]concat=n=2:v=1:a=0[v]" \
    -map "[v]" -an -c:v libx264 -preset slow -crf "$2" -pix_fmt yuv420p \
    -movflags +faststart "$3"
}

pal 1600 28 "$OUT_DIR/$NAME.mp4"
pal 1280 30 "$OUT_DIR/$NAME-720.mp4"
# -q:v 4 on ffmpeg's mjpeg scale lands close to a q82 JPG.
ffmpeg -hide_banner -loglevel error -y -i "$IN" -frames:v 1 \
  -vf "scale=1600:-2:flags=lanczos" -q:v 4 "$OUT_DIR/$NAME-poster.jpg"

for f in "$NAME.mp4" "$NAME-720.mp4" "$NAME-poster.jpg"; do
  printf '%-24s %8s bytes\n' "$f" "$(wc -c < "$OUT_DIR/$f" | tr -d ' ')"
done
