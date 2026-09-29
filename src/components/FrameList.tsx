import { useEffect, useRef } from "react";

interface FrameListProps {
  totalFrames: number;
  currentFrame: number;
  selectedFrames: number[];
  isPlaying: boolean;
  onFrameClick: (frame: number) => void;
  onFrameSelect: (frame: number) => void;
  onFrameRangeSelect: (startFrame: number, endFrame: number) => void;
  onFrameAddRange: (startFrame: number, endFrame: number) => void;
  selectionFocusRequest: number;
}

function FrameList({
  totalFrames,
  currentFrame,
  selectedFrames,
  isPlaying,
  onFrameClick,
  onFrameSelect,
  onFrameRangeSelect,
  onFrameAddRange,
  selectionFocusRequest,
}: FrameListProps) {
  const frameListRef = useRef<HTMLDivElement>(null);

  const lastSelectedFrame = useRef<number | null>(null);

  const frames = Array.from(
    { length: totalFrames },
    (_, index) => index + 1
  );

  useEffect(() => {
    if (!isPlaying) return;
    const list = frameListRef.current;
    if (!list) return;
    const currentElement = list.querySelector(`[data-frame="${currentFrame}"]`) as HTMLElement | null;
    if (!currentElement) return;
    currentElement.scrollIntoView({block: "center", behavior: "smooth",});
  }, [currentFrame, isPlaying]);

  useEffect(() => {
  if (selectedFrames.length === 0) return;
  const list = frameListRef.current;
  if (!list) return;
  const firstSelectedFrame = selectedFrames[0];
  const selectedElement = list.querySelector(`[data-frame="${firstSelectedFrame}"]`) as HTMLElement | null;
  if (!selectedElement) return;
  selectedElement.scrollIntoView({block: "center", behavior: "smooth",});
}, [selectionFocusRequest]);

  function handleFrameClick(
    frame: number,
    event: React.MouseEvent<HTMLDivElement>
  ) {
    const isModifierPressed = event.ctrlKey || event.metaKey;

    if (event.shiftKey && isModifierPressed) {
      const previousFrame = lastSelectedFrame.current;
      if (previousFrame !== null) {
        onFrameAddRange(previousFrame, frame);
      } else {
        onFrameSelect(frame);
      }
      lastSelectedFrame.current = frame;
      return;
    }

    if (event.shiftKey) {
      const previousFrame = lastSelectedFrame.current;
      if (previousFrame !== null) {
        onFrameRangeSelect(previousFrame, frame);
      } else {
        onFrameSelect(frame);
      }
      lastSelectedFrame.current = frame;
      return;
    }

    if (isModifierPressed) {
      onFrameSelect(frame);
      lastSelectedFrame.current = frame;
      return;
    }
    onFrameClick(frame);
  }

  function handleFrameDoubleClick(frame: number) {
    onFrameSelect(frame);
    lastSelectedFrame.current = frame;
  }

  return (
    <div ref={frameListRef} className="frame-list">
      {frames.map((frame) => (
        <div key={frame} data-frame={frame} className={`frame-item
            ${frame === currentFrame ? "active" : ""}
            ${selectedFrames.includes(frame) ? "selected" : ""}
          `}
          onClick={(event) => handleFrameClick(frame, event)}
          onDoubleClick={() => handleFrameDoubleClick(frame)}>
          {String(frame).padStart(3, "0")}
        </div>
      ))}
    </div>
  );
}

export default FrameList;