# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This SPA will be a supporting app for an analog darts game. it should have three modes: 

### Calculating Mode
In this mode, the current player calculates their round points and enters the total using a numpad interface.

**iPad/Touch Optimization:** Uses an on-screen calculator-style numpad instead of triggering the system keyboard:
- **3x4 numpad grid:** Numbers 0-9, Clear (C), and Backspace (←)
- **Large touch targets:** Buttons sized for easy finger tapping
- **Visual display:** Shows entered value in large monospace font
- **Allows 0 points:** Empty submission or explicit 0 entry is valid for missed rounds
- **Smart validation:** Prevents values over 180 (max possible darts score)

### Input Mode
In this mode, the current player enters each dart throw by clicking buttons, and the app calculates the round's total points.

**One-Click Interface:** Completely redesigned for optimal usability:
- **Three organized sections:** Singles (blue), Doubles (green), Triples (orange)
- **All dart values in dartboard order:** 20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5
- **Direct input:** Single tap adds a throw (no separate multiplier selection needed)
- **0 button:** For missed darts (0 points)
- **Bull buttons:** 25 (singles, yellow) and D25 (double bull, red)
- **Undo functionality:** Remove last throw with ↶ Undo button
- **Allows empty rounds:** Can submit with 0 throws (for 0 points total)
- **Large, colorful buttons:** Easy to tap with clear visual distinction between types

### Touch Mode
In this mode, the current player touches on a touch device on a visual dartboard where they hit the target. The app calculates the score based on the touched position.

**Layout Optimization:** Touch mode uses a two-column layout optimized for tablet/touch devices:
- **Left Sidebar (320px):** Contains compact header with "New Game" button, scoreboard, current player info, current round display, and action buttons
- **Right Area (flexible):** Large interactive dartboard that scales to fill available space, maximizing touch accuracy

### Rules
With this app, players can play all well-known darts modes (101, 301, 501, etc.)

### Players
One or many players can enter their names and count their scores.

## Development Commands

### Start Development Server
```bash
ng serve
# or
npm start
```
Application runs at `http://localhost:4200/` with automatic reloading.

### Build
```bash
ng build                                    # Production build (default)
ng build --configuration development        # Development build
npm run watch                               # Watch mode with development config
```
Production builds output to `dist/` with hashing enabled. Bundle size limits: 1MB initial (error), 500kB (warning).

### Testing
```bash
ng test                                     # Run all tests with Karma
ng test --include='**/specific.spec.ts'    # Run specific test file
```
Test framework: Jasmine with Karma runner.

### Code Generation
```bash
ng generate component component-name        # Generate new component
ng generate --help                          # See all available schematics
```

## Architecture

### Application Structure
- **Standalone Components**: Project uses standalone components (no NgModule)
- **Bootstrap**: Application bootstraps via `bootstrapApplication()` in `src/main.ts`
- **Configuration**: App-level providers configured in `src/app/app.config.ts`
- **Routing**: Router configured with empty routes array in `src/app/app.routes.ts`

### Key Configuration Files
- `angular.json`: Build configuration, budgets, and architect targets
- `tsconfig.json`: Strict TypeScript with Angular compiler options enabled
- `package.json`: Prettier configured with 100 char line width and single quotes

### Component Pattern
Components follow Angular standalone pattern:
- Use `imports` array instead of module declarations
- Separate template (`.html`), style (`.css`), and TypeScript (`.ts`) files
- Root component selector: `app-root`
- Default prefix: `app`

### TypeScript Configuration
Strict mode enabled with:
- `noImplicitOverride`
- `noPropertyAccessFromIndexSignature`
- `noImplicitReturns`
- `noFallthroughCasesInSwitch`
- `strictTemplates` for Angular templates

### Signal-Based Reactivity
The codebase uses Angular signals (see `App` component using `signal()`). Prefer signals over traditional observables for local component state.

## Design Principles

### Touch/iPad Optimization
The app is designed primarily for iPad and touch devices:
- **No system keyboards:** All input modes use custom on-screen controls (numpad, dartboard, etc.)
- **Large touch targets:** Buttons and interactive elements sized for finger tapping (minimum 44-50px)
- **Responsive layouts:** Components adapt to available screen space
- **Visual feedback:** Hover states and animations confirm user interactions

### Theme System
Automatic dark/light mode based on system preferences:
- **Color scheme:** Uses Atom One Dark color palette for both themes
  - Light mode: Vibrant Atom One Dark colors on light backgrounds (#fafafa)
  - Dark mode: Atom One Dark colors on dark backgrounds (#282c34)
- **Consistent buttons:** Green (primary/doubles), Blue (secondary/singles), Red (danger), Orange (warning/triples), Yellow (accent/bull)
- **CSS custom properties:** All colors defined as CSS variables in `:root` and `[data-theme="dark"]`
- **Smooth transitions:** Theme changes animate color transitions (0.3s ease)

## Component Structure

### Core Components

#### Game Container (`game-container`)
Main container that orchestrates the game flow. Conditionally renders different layouts based on input mode:
- Touch mode: Renders `touch-mode` component with optimized layout (no separate header)
- Other modes: Renders game header, scoreboard, and respective input mode components

#### Scoreboard (`scoreboard`)
Displays all players with their current scores. Adapts layout based on context:
- Touch mode: Embedded in left sidebar without height constraints
- Other modes: Fixed height with scrolling for many players

#### Touch Mode (`touch-mode`)
Self-contained component for touch input with built-in two-column layout:
- Includes its own header, scoreboard, and controls in left sidebar
- SVG dartboard with click/touch detection for score input
- Visual hit markers showing where darts landed
- Calculates scores based on dartboard geometry (doubles, triples, bull)

#### Input Mode (`input-mode`)
One-click dart entry interface organized by multipliers:
- Three sections with labeled buttons: Singles, Doubles, Triples
- 7-column grid layout for optimal iPad display
- Color-coded buttons: Blue (singles), Green (doubles), Orange (triples)
- Special buttons: 0 (gray), 25 (yellow), D25 (red)
- Undo button to remove last throw
- Shows current round state with throw count (e.g., "Current Round (2/3)")
- Allows submitting rounds with any number of throws (0-3)

#### Calculating Mode (`calculating-mode`)
Calculator-style interface optimized for touch devices:
- On-screen numpad (3x4 grid) prevents system keyboard from appearing on iPad
- Large display shows entered score in monospace font
- Allows 0 points for missed rounds
- Clear (C) and Backspace (←) buttons for corrections
- Validates max score of 180

### Services

#### GameStateService (`game-state`)
Central state management using Angular signals:
- Manages players, scores, rounds, and game flow
- Validates moves and handles win conditions
- Provides computed values for reactive UI updates

#### ScoreService (`score`)
Score validation and calculation utilities:
- Creates and validates dart throws
- Ensures score integrity (e.g., valid dart values, multipliers)

#### ThemeService (`theme`)
Automatic theme detection and management:
- **System preference detection:** Automatically applies light/dark theme based on device settings
- **Live updates:** Listens for system theme changes and updates immediately
- **Initialized at app startup:** Injected in root `App` component to ensure theme applies on load
- **No manual toggle:** Theme follows system preference only (prefers-color-scheme media query)
