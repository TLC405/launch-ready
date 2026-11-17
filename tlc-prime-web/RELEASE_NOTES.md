## Version 45 — UI/UX-only overhaul (November 16, 2026)

Live app: https://tlc-house-of-pain.vercel.app/ and https://tlc-prime-kame-house.vercel.app/

- Replaced all seven dark placeholder weekly Dragon Balls with original, detailed orange-glass inline SVGs: separate 1–7 crisp red stars, warm amber glass, highlights, rim reflections and earned-state glow; updated the 2-star hero ball to match.
- Unified cards, spacing, typography, tool labels, touch targets, visual rhythm, buttons and active states throughout Home, Train, Skills, Scrolls, Analyzer and Scouter.
- Improved narrow-phone six-tab navigation, skill-path readability, training exercise cards, set buttons, day/date labels, high-width layout and dark/light visual hierarchy.
- Kept the existing original dojo illustration, cute anime identity, all workouts, training database, progress history, skill steps, video references, audio features and storage keys unchanged.
- Introduced UI-only style layer `tlc-uiux-45`; updated offline service worker cache key `tlc-house-of-pain-v45` so old visual files are replaced.
- Automated browser checks: all six tabs across widths 320/360/412/600/768/1180; seven SVG balls show precisely 1 to 7 stars; no JavaScript errors or horizontal overflow; workout sets saved; sound settings still open; both light and dark themes rendered; skill detail keyboard access works.
- Existing domain `tlc-prime-kame-house.vercel.app` remains available to retain browser-origin-specific local workout progress. Switching domains does **not** automatically move localStorage data.
- Vercel production deployment `dpl_aqM9UQXUPCcspcXhy21jxZ8aaYX4` was READY. Live HTTP 200 verified for both URLs plus service worker, manifest and icons. Physical Fold 5 testing remains unverified.
- This release does not rebuild the separately signed Android APK or introduce paid AI voice/audio services.

---
# TLC Prime — House of Pain v44 (November 16, 2026)

## Direct live testing
- **New branded URL:** https://tlc-house-of-pain.vercel.app/
- **Legacy URL (still works):** https://tlc-prime-kame-house.vercel.app/
- **Vercel production deployment:** dpl_B6xJf41bxgEimvp3BFZrDecpV7tF (READY)

## What changed
- Replaced the Kame House tropical scene with an ORIGINAL cute anime-inspired martial arts dojo set in a rocky training valley.
- Updated the header and home identity to **TLC House of Pain**; removed Kame House text throughout the actual app.
- Added stronger orange, navy and cream cel-shaded visual design to Home, Train, Skills, Scrolls, Analyze and Scouter.
- Kept the existing seven workout groups, exercises, videos, 70 skill tree steps, tracking and persistence keys.
- Added optional audio: synthesized ki-style interface effects, spoken instructions from existing exercise cues, and rest notifications.
- Added a Sound Lab: voice selection from available device English voices, sound and spoken-coach switches, volume.
- Added push-to-talk OPTIONAL browser voice commands: open training, open skills, next drill, start/stop timer, read exercise, mute.
- The new audio settings use separate local storage key `tlc_audio_settings_v1` and default to OFF.
- The app requires no paid speech service, no ElevenLabs calls or credits.
- Did not add background microphone recording; voice command mic only starts after the user taps, and may use the browser's online provider.

## Verification
- Node syntax validation: all five embedded script blocks passed.
- Chromium browser smoke tests of all six main views at widths 320, 360, 412, 768, 1180px: no JavaScript errors or sideways scrolling.
- Interactive checks: seven training groups, 70 skill nodes, workout set logging/persistence, light/dark switch, audio dialog, settings persistence, rest timer and keyboard dismissal.
- Vercel: production READY; HTTP 200 at both live URLs; HTTP 200 manifest, service worker, 192px/512px icons.
- Local test uses a browser localStorage shim because the sandbox blocks local HTTP navigation. Real-device Fold 5 testing, live microphone/provider compatibility and actual sound playback on phones remain unverified.
- The separately signed Android APK is unchanged by the website update.

## Design and research references
- Official Sparking! ZERO beginner's guide: HUD and gauges: https://en.bandainamcoent.eu/dragon-ball/news/dragon-ball-sparking-zero-the-beginners-guide
- Dokkan Battle training: https://bnfaq.channel.or.jp/faq/detail/3015/2439
- MDN Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- MDN SpeechRecognition limits: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- MDN WebAudio autoplay: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/

## Preservation rules
Do not remove workout data, exercise cues, tutorial source codes, old localStorage keys (`skilltree_v1`, `skilltree_videos`) or Android package ID `com.trevel.skilltree` without approved migration.
