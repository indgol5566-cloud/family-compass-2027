# Family Compass

Cross-platform starter app built with Expo + React Native (Android and iOS).

## Current prototype
- Family dashboard
- Sample family members and points
- Add and complete sample tasks
- Rewards catalogue mock-up

The current version uses local demo data only. Supabase authentication, family invitations, secure point transactions, reward redemption, and persistent data are not connected yet.

## Run locally

```bash
npm install
npx expo start
```

## Build an Android APK on GitHub

The workflow `.github/workflows/android-apk.yml` builds a debug APK on pushes to `main`/`master`, or manually from **Actions → Build Android APK → Run workflow**. Download `family-compass-debug-apk` from the completed workflow run's Artifacts section.

This is a test/debug APK, not a signed Play Store release.
