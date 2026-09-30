# StillFlow

**StillFlow** is a browser-based motion study tool for analyzing movement frame by frame.

It allows you to import a video, select specific frames, and create a motion study by overlaying those frames on top of each other. The goal is to make movement easier to observe, compare, and analyze without requiring professional animation software.

## Preview
<img width="2710" height="1468" alt="preview-light" src="https://github.com/user-attachments/assets/6114d642-cb16-491e-9991-db2ca59c7860" />
<img width="2706" height="1450" alt="preview-dark" src="https://github.com/user-attachments/assets/520665e9-9017-4a97-b6e3-d3152ab1328f" />

## Features

### Video Playback

* Import videos directly in the browser
* Native video playback controls
* Adjustable playback speed
* Frame-by-frame navigation using the left and right arrow keys
* Adjustable FPS from 1 to 120

### Frame Selection

StillFlow provides several ways to select frames:

* Click a frame to jump to it
* Double-click to select a single frame
* `Shift + Click` to select a range
* `Ctrl/Cmd + Click` to toggle individual frames
* `Ctrl/Cmd + Shift + Click` to add a range
* Select all frames
* Clear the current selection

Selected frames are displayed in the frame list and summarized as compact ranges.

### Motion Study

Selected frames can be combined into a motion study overlay.

You can adjust:

* Opacity
* Uniform overlay mode
* Fade overlay mode
* Fade direction:

  * Forward
  * Backward
  * Center

The motion study is displayed alongside the original video, with a draggable divider between the two views.

### Export

Motion studies can be exported as PNG images.

Export options include:

* Custom file name
* 50%, 100%, 150%, and 200% export scale
* Composite background
* Transparent background
* Estimated PNG file size before export

### Interface

StillFlow also includes:

* Dark theme
* Light theme
* English / Chinese interface
* Responsive layout
* Help tooltips
* Automatic frame-list scrolling during playback

## How to Use

### 1. Import a Video

Click **Import Video** or drag a video into the import area.

### 2. Set the FPS

Choose the FPS used for frame calculation.

The total number of frames is calculated from:

```text
Video Duration × FPS
```

### 3. Select Frames

Use the frame list on the right side to select the frames you want to study.

Multiple selection methods are supported, including range selection with `Shift` and additional selection with `Ctrl/Cmd`.

### 4. Adjust the Motion Study

Once frames are selected, the Motion Study preview will appear.

Adjust:

* Opacity
* Overlay mode
* Fade direction

### 5. Compare the Motion

Use the divider between **Original** and **Motion Study** to control how much space each preview occupies.

### 6. Export

Click **Export PNG** to open the export dialog.

Choose the filename, export scale, and background mode, then export the motion study as a PNG image.

## Keyboard Controls

| Key                        | Action                |
| -------------------------- | --------------------- |
| `←`                        | Previous frame        |
| `→`                        | Next frame            |
| `Shift + Click`            | Select a frame range  |
| `Ctrl/Cmd + Click`         | Toggle a frame        |
| `Ctrl/Cmd + Shift + Click` | Add a frame range     |
| Double-click               | Select a single frame |

## Why create StillFlow?

Studying movement often requires looking at several moments at the same time, especially for 2D animation workers.

Traditional video playback shows movement sequentially, while StillFlow allows selected frames to be displayed together as an overlay.

This can make it easier to observe:

* Changes in body position
* Movement trajectories
* Timing between poses
* Differences between consecutive frames
* Overall motion patterns

StillFlow is designed to keep this process simple and accessible directly in the browser.

## Privacy

Videos are processed directly in the browser.

StillFlow does not require users to upload their videos to a server in order to create a motion study.

## Technology

StillFlow is built with:

* React
* TypeScript
* Vite
* HTML5 Video
* HTML5 Canvas
* CSS

The motion study is generated using the browser's Canvas API.

## Run Locally

Clone the repository:

```bash
git clone https://github.com/LeeelaLi/StillFlow.git
```

Enter the project directory:

```bash
cd motion-trace
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal.


## Project Structure

```text
motion-trace
├── public
├── src
│   ├── components
│   │   ├── FrameList.tsx
│   │   ├── MotionCanvas.tsx
│   │   └── HelpTooltip.tsx
│   ├── locales
│   │   ├── en.ts
│   │   └── zh.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## Current Status

StillFlow is currently a functional browser-based motion study tool.

The core workflow is implemented:

```text
Import Video
     ↓
Choose FPS
     ↓
Select Frames
     ↓
Create Motion Study
     ↓
Adjust Overlay
     ↓
Compare With Original
     ↓
Export PNG
```

## Future Improvements

Possible future improvements include:

* Customize mask colors for different selected frame numbers
* Improved mobile interaction
* Additional interface languages
* More customization options for exported images (format, size, etc.)

## License

This project is currently available for personal and educational use.

See the repository for the current license information.
