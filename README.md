# StillFlow

**A lightweight motion-study tool for 2D animators.**

StillFlow is a browser-based tool designed to help 2D animators study movement frame by frame.

Import a video, select the frames you want to analyze, and overlay them into a single **Motion Study** view. This makes it easier to observe spacing, arcs, timing, direction, and overall movement without repeatedly scrubbing through the timeline.

## Preview
<img width="2710" height="1468" alt="preview-light" src="https://github.com/user-attachments/assets/6114d642-cb16-491e-9991-db2ca59c7860" />
<img width="2706" height="1450" alt="preview-dark" src="https://github.com/user-attachments/assets/520665e9-9017-4a97-b6e3-d3152ab1328f" />

## How to Use it?

### 1. Click the magic link,

```bash
https://leeelali.github.io/StillFlow/
```

### 2. Or run locally

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

Then open the local address shown by Vite.

## What is StillFlow?

StillFlow is a visual analysis tool for animation.

It is not intended to replace a full animation package. Instead, it focuses on one specific part of the animation workflow:

> **Studying movement.**

When working on 2D animation, it can be difficult to understand the overall path of a moving character, hand, head, object, or camera simply by looking at individual frames.

StillFlow lets you select multiple frames from a video and combine them into a single visual study.

Instead of looking at:

```text
Frame 01 → Frame 02 → Frame 03 → Frame 04 → ...
```

you can see the selected frames together:

```text
        Frame 01
             ↓
        Frame 05
             ↓
        Frame 10
             ↓
        Frame 15
```

This makes the movement itself easier to observe.

## Core Features

### 🎬 Video Import

Import a video directly in the browser.

StillFlow uses the video as a reference for frame-by-frame analysis.

### 🎞 Key Controls

| Key                        | Action                      |
| -------------------------- | --------------------------- |
| Single-click               | Jump to a single frame      |
| Double-click               | Select a single frame       |
| `←`                        | Previous frame              |
| `→`                        | Next frame                  |
| `Shift + Click`            | Select a frame range        |
| `Ctrl/Cmd + Click`         | Toggle a frame              |
| `Ctrl/Cmd + Shift + Click` | Add a frame range           |
| `All` Button               | Select all frames           |
| `Clear` Button             | Clear the current selection |

Selected frames are displayed in the frame list and summarized as compact ranges.

### 🌀 Motion Study

Selected frames are combined into a single canvas.

This provides a visual representation of the movement across time.

You can adjust the opacity of the overlay to make different poses easier to compare.

### 🌫 Overlay Modes

StillFlow supports:

**Uniform**: All selected frames use the same opacity.

**Fade**: Opacity changes progressively across the selected frames.

Fade direction can be set to:

* Forward
* Backward
* Center

This can help emphasize different parts of a movement.

### 🔍 Original / Motion Study Split View

The preview area can be divided between:

**Original**: The source video.

**Motion Study**: The selected-frame overlay.

The divider can be dragged to adjust the amount of space given to each view.

### 📋 Frame Selection Summary

StillFlow displays the number of selected frames and compresses continuous selections into ranges.

For example:

```text
Selected: 13 frames

1–8, 12–16
```

Clicking the selection summary also focuses the frame list on the selected area.

### 📤 PNG Export

Export your Motion Study as a PNG.

Available options include:

* 50%
* 100%
* 150%
* 200%

Export modes:

* Composite
* Transparent

StillFlow also estimates the PNG file size before exporting.

### 💡 Help Tooltips

Small help indicators provide explanations for controls without taking up permanent interface space.

Tooltip sizing adapts to the content so that longer explanations can wrap naturally.

### 🌗 Dark / Light Theme

StillFlow supports both dark and light interface themes.

### 🌍 English / Chinese

The interface currently supports:

* English
* 简体中文

The language can be switched directly from the interface.

## Typical Animation Workflow

A simple workflow might look like this:

### Step 1 — Import a reference

Import a video containing the movement you want to study.

### Step 2 — Choose the frame rate

Set the FPS used for frame analysis.

### Step 3 — Inspect the movement

Play the video or step through it frame by frame.

### Step 4 — Select important frames

Select the frames that represent the movement you want to study.

### Step 5 — Build a Motion Study

StillFlow overlays the selected frames into one visual reference.

### Step 6 — Adjust the visualization

Change:

* opacity
* overlay mode
* fade direction
* preview split

until the movement is easy to read.

### Step 7 — Export

Export the Motion Study as a PNG for further reference.

## What StillFlow Is Not

StillFlow is intentionally focused.

It is **not** a full animation production environment.

It does not aim to replace applications such as drawing, rigging, compositing, or editing software.

Instead, StillFlow focuses on a smaller problem:

> **How can I quickly see the movement contained in a sequence of frames?**

It is designed to complement an animator's existing workflow.

## Technology

StillFlow is built with:

* React
* TypeScript
* Vite
* HTML5 Video
* HTML5 Canvas
* CSS

The application runs directly in the browser.

No video needs to be uploaded to a server for the core motion-study workflow.

## Future Improvements

Possible future improvements include:

* Customize mask colors for different selected frame numbers
* Improved mobile interaction
* Additional interface languages
* More customization options for exported images (format, size, etc.)

## Privacy

Videos are processed directly in the browser.

StillFlow does not require users to upload their videos to a server in order to create a motion study.

## License

This project is currently available for personal and educational use.

See the repository for the current license information.
