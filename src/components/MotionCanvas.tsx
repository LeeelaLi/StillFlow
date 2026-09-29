import { useEffect, useRef, useState } from "react";
import HelpTooltip from "./HelpTooltip";
import en from "../locales/en";
import zh from "../locales/zh";

type Translation = typeof en | typeof zh;
interface MotionCanvasProps {
    video: HTMLVideoElement | null;
    selectedFrames: number[];
    fps: number;
    t: Translation;
}
type ExportMode = "composite" | "transparent";
type ExportScale = 0.5 | 1 | 1.5 | 2;
type OverlayMode = "uniform" | "fade";
type FadeDirection =
    | "forward"
    | "backward"
    | "center";

function MotionCanvas({
    video,
    selectedFrames,
    fps,
    t,
}: MotionCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [opacity, setOpacity] = useState(70);
    const [fileName, setFileName] = useState("motion-study");
    const [exportMode, setExportMode] = useState<ExportMode>("composite");
    const [exportScale, setExportScale] = useState<ExportScale>(1);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [exportFileSize, setExportFileSize] = useState<number | null>(null);
    const [isCalculatingExportSize, setIsCalculatingExportSize] = useState(false);
    const [overlayMode, setOverlayMode] = useState<OverlayMode>("uniform");
    const [fadeDirection, setFadeDirection] = useState<FadeDirection>("forward");

    useEffect(() => {
        if (video === null) return;
        if (selectedFrames.length === 0) return;
        if (fps <= 0) return;

        // const canvas = canvasRef.current;
        // if (canvas === null) return;

        // const context = canvas.getContext("2d");
        // if (context === null) return;

        const maybeCanvas = canvasRef.current;
if (maybeCanvas === null) return;
const canvas: HTMLCanvasElement = maybeCanvas;

const maybeContext = canvas.getContext("2d");
if (maybeContext === null) return;
const context: CanvasRenderingContext2D = maybeContext;

        const videoSrc = video.currentSrc || video.src;
        if (!videoSrc) return;

        const captureVideo = document.createElement("video");
        captureVideo.src = videoSrc;
        captureVideo.muted = true;
        captureVideo.playsInline = true;
        captureVideo.preload = "auto";

        let cancelled = false;
        async function waitForMetadata() {
            if (captureVideo.readyState >= 1) {
                return;
            }
            await new Promise<void>((resolve) => {
                captureVideo.addEventListener("loadedmetadata", () => resolve(), { once: true });
            });
        }

        async function seekTo(time: number) {
            await new Promise<void>((resolve) => {
                const handleSeeked = () => {
                    resolve();
                };
                captureVideo.addEventListener("seeked", handleSeeked, { once: true });
                captureVideo.currentTime = time;
            });
        }

        async function drawFrames() {
            await waitForMetadata();
            if (cancelled) return;
            const width = captureVideo.videoWidth;
            const height = captureVideo.videoHeight;

            if (width === 0 || height === 0) return;
            canvas.width = width;
            canvas.height = height;
            context.clearRect(0, 0, width, height);

            for (let i = 0; i < selectedFrames.length; i++) {
                if (cancelled) return;
                const frame = selectedFrames[i];
                const time = (frame - 1) / fps;

                await seekTo(time);
                if (cancelled) return;
                let frameOpacity = opacity / 100;

                if (overlayMode === "fade") {
                    const progress =
                        selectedFrames.length <= 1
                        ? 0
                        : i / (selectedFrames.length - 1);
                    let fadeAmount = progress;
                    if (fadeDirection === "backward") {
                        fadeAmount = 1 - progress;
                    }

                    if (fadeDirection === "center") {
                        const distanceFromCenter = Math.abs(progress - 0.5) * 2;
                        fadeAmount = distanceFromCenter;
                    }
                    frameOpacity = (opacity / 100) * (1 - fadeAmount);
                }

                context.globalAlpha = frameOpacity;
                context.drawImage(captureVideo, 0, 0, width, height);
            }
            context.globalAlpha = 1;
        }

        void drawFrames();

        return () => {
            cancelled = true;
            captureVideo.pause();
            captureVideo.removeAttribute("src");
            captureVideo.load();
            context.globalAlpha = 1;
        };
    }, [
    video,
    selectedFrames,
    fps,
    opacity,
    overlayMode,
    fadeDirection,
    ]);

    function formatFileSize(bytes: number): string {
        if (bytes < 1024) {
            return `${bytes} B`;
        }

        const kilobytes = bytes / 1024;
        if (kilobytes < 1024) {
            return `${kilobytes.toFixed(1)} KB`;
        }

        const megabytes = kilobytes / 1024;
        if (megabytes < 1024) {
            return `${megabytes.toFixed(2)} MB`;
        }

        const gigabytes = megabytes / 1024;
        return `${gigabytes.toFixed(2)} GB`;
    }

    function calculateExportSize(scale: ExportScale = exportScale, mode: ExportMode = exportMode) {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        setIsCalculatingExportSize(true);
        setExportFileSize(null);
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = Math.round(canvas.width * scale);
        exportCanvas.height = Math.round(canvas.height * scale);
        const exportContext = exportCanvas.getContext("2d");

        if (!exportContext) {
            setIsCalculatingExportSize(false);
            return;
        }

        if (mode === "composite") {
            exportContext.fillStyle = "#000000";
            exportContext.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        }

        exportContext.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);

        exportCanvas.toBlob((blob) => {
            if (!blob) {
                setIsCalculatingExportSize(false);
                return;
            }

            setExportFileSize(blob.size);
            setIsCalculatingExportSize(false);
        }, "image/png");
    }

    function handleExport() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = Math.round(canvas.width * exportScale);
        exportCanvas.height = Math.round(canvas.height * exportScale);
        const exportContext = exportCanvas.getContext("2d");

        if (!exportContext) return;

        if (exportMode === "composite") {
            exportContext.fillStyle = "#000000";
            exportContext.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        }
        exportContext.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
        const safeFileName = fileName.trim() || "motion-study";
        const link = document.createElement("a");
        link.download = `${safeFileName}.png`;
        link.href = exportCanvas.toDataURL("image/png");
        link.click();
        setExportDialogOpen(false);
    }

    return (
        <div className="motion-canvas-container">
            <canvas ref={canvasRef} className="motion-canvas" />
            <div className="motion-controls">
                <label>{t.motionControls.opacity}</label>
                <input type="range" min="0" max="100" value={opacity} onChange={(event) => {
                        setOpacity(Number(event.target.value));
                }}/>
                <input className="opacity-number-input" type="number" min="0" max="100" value={opacity} onChange={(event) => {
                    const value = Number(event.target.value);
                    if (!Number.isFinite(value)) return;
                    const clampedValue = Math.min(100, Math.max(0, value));
                    setOpacity(clampedValue);
                }}/>
                <span>%</span>

                <div className="control-label">
                    <span>{t.motionControls.overlay}</span>
                    <HelpTooltip text={t.help.overlay} />
                </div>

                <select className="overlay-mode-select" value={overlayMode} onChange={(event) => {
                        setOverlayMode(event.target.value as OverlayMode);
                }}>
                    <option value="uniform">{t.motionControls.uniform}</option>
                    <option value="fade">{t.motionControls.fade}</option>
                </select>

                {overlayMode === "fade" && (
                    <>
                        <div className="control-label">
                            <span>{t.motionControls.fadeDirection}</span>
                            <HelpTooltip text={t.help.fadeDirection} />
                        </div>

                        <select className="fade-direction-select" value={fadeDirection} onChange={(event) => {
                            setFadeDirection(event.target.value as FadeDirection);}}>
                            <option value="forward">{t.motionControls.forward}</option>
                            <option value="backward">{t.motionControls.backward}</option>
                            <option value="center">{t.motionControls.center}</option>
                        </select>
                    </>
                )}

                <button className="export-button" onClick={() => {
                    setExportFileSize(null);
                    setExportDialogOpen(true);
                    calculateExportSize();}}>{t.export.button}
                </button>
            </div>

            {exportDialogOpen && (
                <div className="export-dialog-overlay" onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                        setExportDialogOpen(false);
                    }}}>
                    <div className="export-dialog">
                        <div className="export-dialog-header">
                            <span>Export Motion Study</span>
                            <button type="button" className="export-dialog-close" onClick={() => {
                                setExportDialogOpen(false);}}>X
                            </button>
                        </div>

                        <div className="export-dialog-body">
                            <label className="export-dialog-label">{t.export.fileName}</label>
                            <input className="export-dialog-input" type="text" value={fileName} onChange={(event) => {
                                setFileName(event.target.value);}}
                                placeholder="motion-study"/>

                            <div className="export-dialog-label-row">
                                <span className="export-dialog-label">{t.export.exportSize}</span>
                                <HelpTooltip text={t.help.exportSize} />
                            </div>

                            <select className="export-dialog-input" value={exportScale} onChange={(event) => {
                                const newScale = Number(event.target.value) as ExportScale;
                                setExportScale(newScale);
                                calculateExportSize(newScale, exportMode);}}>
                                <option value="0.5">50%</option>
                                <option value="1">100%</option>
                                <option value="1.5">150%</option>
                                <option value="2">200%</option>
                            </select>

                            <div className="export-dialog-label-row">
                                <span className="export-dialog-label">{t.export.exportMode}</span>
                                <HelpTooltip text={t.help.exportMode} />
                            </div>

                            <select className="export-dialog-input" value={exportMode} onChange={(event) => {
                                const newMode = event.target.value as ExportMode;
                                setExportMode(newMode);
                                calculateExportSize(exportScale, newMode);}}>
                                <option value="composite">{t.export.composite}</option>
                                <option value="transparent">{t.export.transparent}</option>
                            </select>

                            <div className="export-size-preview">
                                <span className="export-size-preview-label">{t.export.estimatedSize}</span>
                                <span className="export-size-preview-value">
                                {isCalculatingExportSize
                                ? t.export.calculating
                                : exportFileSize !== null
                                    ? formatFileSize(exportFileSize)
                                    : "—"}
                                </span>
                            </div>
                        </div>

                        <div className="export-dialog-footer">
                            <button type="button" className="export-cancel-button" onClick={() => {
                                setExportDialogOpen(false);}}>{t.export.cancel}
                            </button>

                            <button type="button" className="export-confirm-button" onClick={handleExport}>
                                {t.export.export}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MotionCanvas;