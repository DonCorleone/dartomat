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
in this mode, the current player writes the points of every projectile and the app calculates the round's point

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
- **Large touch targets:** Buttons and interactive elements sized for finger tapping (minimum 50px)
- **Responsive layouts:** Components adapt to available screen space
- **Visual feedback:** Hover states and animations confirm user interactions

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
Manual score entry mode where players input individual dart values.

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
