import { useEffect, useRef, useState } from "react";
import "./App.css";
import FrameList from "./components/FrameList";
import MotionCanvas from "./components/MotionCanvas";
import en from "./locales/en";
import zh from "./locales/zh";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState<"en" | "zh">("en");
  const t = language === "en" ? en : zh;
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(24);
  const [duration, setDuration] = useState<number>(0);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const totalFrames = duration > 0 ? Math.floor(duration * fps) : 0;
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFrames, setSelectedFrames] = useState<number[]>([]);
  const [selectionFocusRequest, setSelectionFocusRequest] = useState(0);
  const [splitPosition, setSplitPosition] = useState(50);

  function handleVideoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setCurrentFrame(1);
    setSelectedFrames([]);
    setDuration(0);
    setVideoElement(null);
  }

  function handleVideoLoaded() {
    const video = videoRef.current;
    if (!video) return;
    setVideoElement(video);
    const videoDuration = video.duration;
    setDuration(videoDuration);
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;
    const frame = Math.round(video.currentTime * fps) + 1;
    setCurrentFrame(frame);
  }

  function handleFrameClick(frame: number) {
    const video = videoRef.current;
    if (!video) return;
    const time = (frame - 1) / fps;
    video.pause();
    video.currentTime = time;
    setCurrentFrame(frame);
  }

  function toggleFrameSelection(frame: number) {
    setSelectedFrames((previous) => {
      if (previous.includes(frame)) {
        return previous.filter(
          (item) => item !== frame
        );
      }

      return [
        ...previous,
        frame,
      ].sort((a, b) => a - b);
    });
  }

  function selectFrameRange(startFrame: number, endFrame: number) {
    const firstFrame = Math.min(startFrame, endFrame);
    const lastFrame = Math.max(startFrame, endFrame);
    const range = Array.from({
        length: lastFrame - firstFrame + 1,
      }, (_, index) => firstFrame + index
    );

    setSelectedFrames(range);
  }

  function addFrameRange(startFrame: number, endFrame: number) {
    const firstFrame = Math.min(startFrame, endFrame);
    const lastFrame = Math.max(startFrame, endFrame);
    const range = Array.from({
        length: lastFrame - firstFrame + 1,
      }, (_, index) => firstFrame + index
    );

    setSelectedFrames((previous) => {
      return Array.from(new Set([
          ...previous,
          ...range,
        ])
      ).sort((a, b) => a - b);
    });
  }

  function handleSplitDrag(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    const splitter = event.currentTarget;
    const splitContainer = splitter.parentElement;
    if (!splitContainer) return;
    const rect = splitContainer.getBoundingClientRect();

    function handleMouseMove(moveEvent: MouseEvent) {
      const position = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const clampedPosition = Math.min(80, Math.max(20, position));
      setSplitPosition(clampedPosition);
    }

    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  function formatSelectedFrames(frames: number[]): string {
    if (frames.length === 0) {
      return "None";
    }

    const sortedFrames = [...frames].sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = sortedFrames[0];
    let previous = sortedFrames[0];

    for (let i = 1; i < sortedFrames.length; i++) {
      const current = sortedFrames[i];

      if (current === previous + 1) {
        previous = current;
        continue;
      }

      if (start === previous) {
        ranges.push(String(start));
      } else {
        ranges.push(`${start}–${previous}`);
      }

      start = current;
      previous = current;
    }

    if (start === previous) {
      ranges.push(String(start));
    } else {
      ranges.push(`${start}–${previous}`);
    }

    return ranges.join(", ");
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!videoUrl) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const previousFrame = Math.max(1, currentFrame - 1);
        handleFrameClick(previousFrame);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextFrame = Math.min(totalFrames, currentFrame + 1);
        handleFrameClick(nextFrame);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    videoUrl,
    currentFrame,
    totalFrames,
    fps
  ]);


  return (
    <div className={`app theme-${theme}`}>
      {/* Header */}
      <header className="header">
        <div className="logo">{t.app.title}</div>
        <div className="header-right">
          <button type="button" className="language-toggle" onClick={() => {
            setLanguage((previous) => previous === "en" ? "zh" : "en");}}
            aria-label={language === "en" ? t.header.switchToChinese : t.header.switchToEnglish}>
            <span className={ language === "en" ? "language-option active" : "language-option"}>en</span>
            <span className="language-divider">|</span>
            <span className={language === "zh" ? "language-option active" : "language-option"}>中</span>
          </button>

          {videoUrl && (
            <div className="fps-control">
              <label htmlFor="fps-input">{t.header.fps}</label>
              <input id="fps-input" type="number" min="1" max="120" value={fps} onChange={(event) => {
                  const value = Number(event.target.value);
                  if (!Number.isFinite(value)) return;
                  const newFps = Math.min(120, Math.max(1, value));
                  setFps(newFps);
                  const newTotalFrames = duration > 0 ? Math.floor(duration * newFps) : 0;
                  setCurrentFrame((previous) => Math.min(previous, Math.max(1, newTotalFrames)));
                  setSelectedFrames((previous) => previous.filter((frame) => frame <= newTotalFrames));
                }}/>
              <span className="video-info">{totalFrames} {t.header.frames}</span>
            </div>
          )}

          <label className="import-button">{t.header.importVideo}
            <input type="file" accept="video/*" onChange={handleVideoUpload} hidden />
          </label>

          <button type="button" className="theme-toggle" onClick={() => {
            setTheme((previous) => previous === "dark" ? "light" : "dark");}}
            aria-label={ theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            }>
            {theme === "dark" ? "☀" : "☾"}
          </button>

        </div>
      </header>

      {/* Main Workspace */}
      <main className="workspace">
        {/* Video */}
        <section className="video-area">
          {videoUrl ? (
            <div className="preview-split" style={{"--split-position": `${splitPosition}%`,} as React.CSSProperties}>
              <div className="preview-pane original-pane">
                <div className="preview-label">
                  {/* ORIGINAL */}
                  <span>{t.preview.original}</span>
                </div>
                <video ref={videoRef} src={videoUrl} controls className="video" onLoadedMetadata={handleVideoLoaded}
                  onTimeUpdate={handleTimeUpdate} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}/>
              </div>

              <div className="splitter" onMouseDown={handleSplitDrag}>
                <div className="splitter-handle">
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="preview-pane motion-pane">
                <div className="preview-label">
                  <span>{t.preview.motionStudy}</span>
                </div>

                {selectedFrames.length > 0 ? (
                  <MotionCanvas
                    video={videoElement}
                    selectedFrames={selectedFrames}
                    fps={fps}
                    t={t}/>
                ) : (
                  <div className="motion-empty">{t.motionStudy.selectFrames}</div>
                )}
              </div>
            </div>
          ) : (
            <label className="drop-zone">
              <div className="drop-title">{t.dropZone.title}</div>
              <div className="drop-subtitle">{t.dropZone.subtitle}</div>
              <input type="file" accept="video/*" onChange={handleVideoUpload} hidden />
            </label>
          )}
        </section>

        {/* Frame List */}
        <aside className="frame-panel">

          <div className="panel-title">
            <span>{t.frameList.title}</span>
            <div className="frame-actions">
              <button type="button" onClick={() => {
                  const allFrames = Array.from({ length: totalFrames }, (_, index) => index + 1);
                  setSelectedFrames(allFrames);
                }}>
                {t.frameList.all}
              </button>
              <button type="button" onClick={() => {setSelectedFrames([]);}}>
                {t.frameList.clear}
              </button>
            </div>
          </div>

          <div className="selection-info">
            <button type="button" className="selection-count" onClick={() => {
                if (selectedFrames.length === 0) return;
                setSelectionFocusRequest((previous) => previous + 1);}}>
              {t.frameList.selected}: {selectedFrames.length}{" "}
              {selectedFrames.length === 1 ? t.frameList.frame : t.frameList.frames}
            </button>

            <div className="selection-frames">{formatSelectedFrames(selectedFrames)}</div>
          </div>

          {videoUrl && totalFrames > 0 ? (
            <FrameList
              totalFrames={totalFrames}
              currentFrame={currentFrame}
              selectedFrames={selectedFrames}
              isPlaying={isPlaying}
              onFrameClick={handleFrameClick}
              onFrameSelect={toggleFrameSelection}
              onFrameRangeSelect={selectFrameRange}
              onFrameAddRange={addFrameRange}
              selectionFocusRequest={selectionFocusRequest}
            />
          ) : (
            <div className="empty-frames">{t.frameList.importVideo}</div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;