# Polarix Games — Nintendo-Style Gaming Company Website

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full gaming company landing page with dark red (#8B0000 / crimson) brand color
- Animated logo in header (generated image)
- Hero section with full-width sliding image carousel featuring polar-themed game art
- Featured Games section with playable 2D browser games
- Two fully playable 2D games embedded directly in the site:
  1. "Arctic Runner" — endless side-scroller with polar bear character, jump obstacles
  2. "Penguin Catch" — catch falling fish as a penguin, dodge rocks
- News section with cards for: new game announcements, character reveals, updates
- Characters section showcasing iconic mascots
- About section with Nintendo-inspired company philosophy
- Footer with navigation and branding

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Generate logo and carousel images (polar game art)
2. Build React frontend with:
   - Header/Nav with logo and dark red theme
   - Hero carousel (auto-sliding, manual controls)
   - Featured Games section with embedded Canvas-based 2D games
   - News feed section (static sample content)
   - Characters showcase
   - About/philosophy section
   - Footer
3. Implement 2 playable Canvas games using useRef + requestAnimationFrame
4. Apply dark red color system throughout
