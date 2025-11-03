# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This SPA will be a supporting app for an analog darts game. it should have three modes: 

### Calculating Mode
in this mode, the current player calculates its points by himself

### Input Mode
in this mode, the current player writes the points of every projectile and the app calculates the round's point

### Touch Mode
in this mode, the current player touches on an touch- devise on a dartboard where he / she hits the target. the app then shall calculate 

### Rules
with this app, the players should be able to play all well known darts mode (101, 301, 501 etc..)

### Players
One or many Players shall be able to enter their names and count their scores.

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
