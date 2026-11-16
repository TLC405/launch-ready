# TLC Prime — Kame House Web Build (v43)

The full training application is live at **https://tlc-prime-kame-house.vercel.app/**.

This is the full interactive website, not the APK download page. It uses the original TLC Prime workout database and preserves legacy progress keys `skilltree_v1` and `skilltree_videos`.

## What's improved (plain English)

- Training buttons are easier to tap on small screens.
- Every clickable training tile and skill step can also be used with a keyboard.
- Skill details now close with the Escape key.
- People using screen readers can identify active tabs, selected sets and progress bars.
- Text is easier to read in light and dark modes.
- Faster, less distracting motion for users who prefer reduced animation.
- The existing workouts, tutorial references and skill tree remain intact.
- No paid voice or sound service was added; avoid spending external credits.

## Evidence

The HTML/JavaScript was syntax checked. A local Chromium/Playwright smoke suite rendered all six main views at 320, 360, 412, 768 and 1180 px without horizontal scrolling or runtime errors. It tested keyboard access to skill tiles, opening/closing a skill panel with Escape, set toggling, and theme changes. The browser smoke tests used mocked localStorage due to local navigation limits; real-device persistence is not fully proven by this suite.

Vercel reported deployment `dpl_7EsNMFtYySZUKAMnxpUuYysg5prL` READY. Direct HTTP checks returned 200 for the full HTML, PWA manifest, service worker (`tlc-prime-v43`), and both app icons.

## Not yet verified

- Real Galaxy Z Fold 5 physical-device operation
- Instagram's third-party video playback under current embedded-player restrictions
- Real recorded-video AI pose analysis
- Installed Android APK compatibility: website changes do NOT update the separately signed Android package
- Live Core Web Vitals (field data) and a complete automated WCAG audit

## Budget-friendly third-party options

- [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds): free CC0 sounds, if tasteful, optional sound effects are eventually desired.
- [Android TextToSpeech](https://developer.android.com/reference/android/speech/tts/TextToSpeech): device speech instead of per-character voice API credits.
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis): browser/device speech where supported.

No audio was automatically added. Opt-in sound with silent default is the recommended direction.

## Production notes

Vercel project `tlc-prime-kame-house`; public URL above. Keep existing training data and persistent storage names unchanged unless a migration is explicitly designed and tested.
