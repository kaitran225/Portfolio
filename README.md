# React Portfolio

This is a React implementation of the original portfolio website. It mimics the layout and functionality of the original static HTML/CSS/JS website.

## Features
- Grid-based layout matching the original design
- Command prompt terminal with interactive commands
- YouTube video embedder
- Spotify music player
- Dynamic image gallery loading content from different portfolio categories
- Responsive design for mobile and desktop

## Project Structure

- `src/components/` - React components
  - `Terminal.tsx` - Interactive command prompt
  - `MusicPlayer.tsx` - Spotify player
  - `VideoEmbed.tsx` - YouTube video embedder
  - `ImageGallery.tsx` - Dynamic image gallery for portfolio content
- `src/styles/` - CSS styles
  - `Layout.css` - Grid layout styles
  - `Terminal.css` - Terminal styling
- `src/data/` - Data files
  - `portfolioImages.json` - Structure of portfolio folders and images
- `public/assets/` - Asset files organized by portfolio category
  - `Calantha/`
  - `Zena/`
  - `Slab/`
  - `Personal/`
  - `GateWay/`
  - `Cloud/`

## Setup

1. Make sure to place appropriate images and videos in the `public/assets/` folders
2. Each category should have at least the placeholder images referenced in the JSON file

## Running the Project

```
npm install
npm start
```

## Creating Image Placeholders

For testing, each portfolio folder needs placeholder images as defined in `portfolioImages.json`. You can either:
1. Copy images from the original Portfolio directory
2. Create new placeholder images with any image editor

## Notes
The original static website is located in the root directory of this repository.
