import { useRef } from "react";
import { useContainerDimensions } from "../../utils/custom-hooks";

export function FilterEditor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { width, height } = useContainerDimensions(containerRef);

    return (
        <div ref={containerRef} className="w-full h-full">
            <canvas width={width} height={height} ref={canvasRef}></canvas>
        </div>
    );
}
