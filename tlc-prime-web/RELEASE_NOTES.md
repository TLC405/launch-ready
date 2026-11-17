## v49 — TLC Hyperbolic Chamber (November 17, 2026)

**Full app:** https://tlc-hyperbolic-chamber.vercel.app/  
**Previous site, same build and existing browser storage:** https://tlc-house-of-pain.vercel.app/

- Renamed the site header, hero art lettering, page title and installable-web-app manifest to **TLC Hyperbolic Chamber**. Existing domains remain available, because workout progress is stored per website domain.
- Embedded a custom live **Chamber Atmosphere** weather dashboard inside the home hero: current temperature and feels-like, condition, daily highs/lows, wind, humidity, rain chance, six hourly slots, and three-day outlook. Oklahoma City default, optional permission-gated Near me button and city search for other areas. Forecast data is fetched from Open-Meteo in the browser, credited in the UI. No paid weather key.
- Added **original, locally synthesized, anime-inspired combat SFX** for button taps, navigation, impacts, power-ups and explosions. Works with the existing Sound Lab toggle and volume; no copyrighted character samples, ElevenLabs or remote audio bills. Existing optional music behavior was deliberately not modified.
- Created new 192px and 512px install icons with orange 2-star glass sphere, blue frame and TLC CHAMBER lettering.
- All 142 exercise definitions, 70 skill steps, 14 lanes, 7 training programs, tutorial references, audio source and progress keys remain intact. Android APK was **not** rebuilt; it retains its old package/Android share-sheet identity.
- Local QA used Playwright/Chromium across widths 320, 360, 412, 600, 768 and 1180px: all six tabs, no horizontal overflow or JavaScript errors, weather layout contained in hero (no overlaps), both themes, set logging, location lookup, city search, sound effects/mute, and network-offline fallback.
- Local weather fetches were mocked in test browsers; the deployed live app code, manifest, worker and icons were verified as HTTP 200. Physical Galaxy Z Fold and actual phone speaker tests remain unverified.
- Vercel production deployment `dpl_5QsFm65efLfVqqVFoSWhKLEmTKv5` READY. Cache `tlc-hyperbolic-chamber-v49`.

---
## Version 48 — Fixed music, robot voice, and both themes (November 17, 2026)

LIVE: https://tlc-house-of-pain.vercel.app/ (old testing URL still works)

- Built a real opt-in MUSIC player with original Web Audio instrumental compositions: Power Up and Focus Chamber. Play/Pause, track choice, volume, saved preference. Works without streaming, paid AI, or ElevenLabs. Browser requires a user tap to begin audio; never autoplays.
- Removed the low-quality browser speech synthesis coach UI and disabled synthesized spoken prompts. Exercise cue buttons now open the existing form-instructions panel. Optional microphone-based commands remain push-to-talk; the app does not read back using a robotic voice.
- Restored a clearly separate LIGHT theme: bright white and light-blue backgrounds, blue lettering, orange highlights, pale workout cards. DARK mode uses bold Gi orange, saturated blue like the pants, white, black and a subtle 悟 emblem.
- Fixed prior background tiling and patterned artifacts; kept six screens, all 142 exercises, 70 skills, history, tutorials, previously-used local progress keys and prior audio settings untouched.
- Local Chromium/Playwright: 12 visual checks across 320/360/412/600/768/1180px in dark and light with no JS errors/overflow; actual AudioContext state running with notes scheduled on Play, switching track and Pausing; training set updated storage; form cues opened.
- Live Vercel deployment dpl_4Bra6zK3682dVPxV5ZRJvh7Kh8J8 READY. Both domains and assets HTTP 200; service worker cache v48.
- Unverified on physical Galaxy Z Fold: actual audio speaker output, browser permissions and installed Android APK. Installed APK not rebuilt. The two web domains maintain separate local browser history; continue on prior domain for prior logs.

---
## Version 47 — Dark DBZ design and overlap fixes (November 17, 2026)

**LIVE:** https://tlc-house-of-pain.vercel.app/ and https://tlc-prime-kame-house.vercel.app/

- Replaced repeated beige backgrounds with a dark navy/blue-black world, orange primary actions, blue controls and high-contrast cream exercise cards.
- Updated header, six-tab navigation, world ribbons, day selector, gravity progress display, section headers, exercise cards, scouter dashboard and skill cards.
- Moved `NEXT UP` inside the first unfinished exercise card so it no longer overlaps the section above or the exercise title.
- Removed legacy blurry cloud overlay and extra section-underlining, reducing visual crowding.
- Kept 142 drills, 7 programs, 14 skill lanes, 70 skill nodes, audio controls, progress storage keys and existing tutorial references unchanged. The Android APK was not rebuilt.
- QA: all 5 JavaScript blocks syntax-checked; Chromium/Playwright smoke-tested six tabs at 320/360/412/600/768/1180px with no JS exceptions or sideways scrolling; tested set logging/storage, skill detail, Escape dismissal and theme control.
- Vercel production deployment `dpl_4WGmx6W32UocUa25jEaya7PXqckc` READY. Confirmed HTTP 200 for both app URLs, new offline cache v47, manifest and app icon.
- Not verified on real Galaxy Z Fold 5 hardware. Old and new website URLs each have their own local progress storage: continue using the origin where the user's workouts are saved.

---
## Version 46 — Deeper anime-world visual upgrade (November 17, 2026)

**Published live:** https://tlc-house-of-pain.vercel.app/  (previous URL https://tlc-prime-kame-house.vercel.app/ remains active)

**Scope:** UI/UX, artwork, CSS and view presentation ONLY.

- Upgraded the illustrated **TLC House of Pain** dojo: richer atmospheric sky, layered sun halo, dimensional rocks, small energy details, original cute character and warm cel-shaded lighting.
- Added a cohesive premium look across six tabs: beveled anime mission cards, scouter HUD, richer energy-level panels, yellow/orange glass accents, readable training sets, game-like skill path, refined radar and collected Dragon Balls, detailed light and dark themes, improved buttons and responsive bottom navigation.
- Added a visual **World 02–06** header to each non-home room (Training Grounds, Power Tree, Technique Scrolls, Scouter Lab, Battle Record).
- Kept all 142 exercise definitions in seven programs, all 14 skill lanes and 70 skill steps, tutorials, progress, sound system and browser storage keys unchanged. No paid services or new asset dependencies.
- Verified 5 inline scripts with Node syntax checks; Chromium/Playwright rendered all six tabs at 320, 360, 412, 600, 768 and 1180 px without JavaScript errors or horizontal scrolling. Basic tests covered workout logging, skill detail, light/dark theme, and opening Sound Lab.
- Deployment `dpl_4F3f2BAseAZYSKcwGyu1pXnseoPC` READY; both domains assigned, direct HTTP 200 for full live app, `sw.js` cache `tlc-house-of-pain-v46`, manifest and both icons.
- Not physically verified: Galaxy Z Fold 5, Instagram embeds, actual microphone and speaker behavior. **Android APK was not rebuilt.**
- The old domain and new domain hold separate browser storage. Continue using the address with existing workout logs to preserve visible history.

---
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
