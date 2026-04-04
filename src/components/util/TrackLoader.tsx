import { useEffect, useRef } from "react";
import { CircuitMap } from "../../circuits/Circuits";
import type { DetailedLapData } from "../../interfaces/types";


interface TrackLoaderProps {
    circuitName: string;
    onSectorHover?: (id: string | null, centerX?: number, centerY?: number) => void;
    lapData: DetailedLapData[];
    selectedLap: number;
}

const TrackLoader: React.FC<TrackLoaderProps> = ({ circuitName, onSectorHover, lapData, selectedLap }) => {
    const TrackComponent = CircuitMap[circuitName.toLowerCase()];
    const wrapperRef = useRef<HTMLDivElement>(null);
    const sectorYELLOW = "#FFF200";
    const sectorPURPLE = "#B15BE3";
    const sectorGREEN = "#00D2BE";
    const sectorGRAY = "#595959";

    useEffect(() => {
        const wrapper = wrapperRef.current;

        if (!wrapper || lapData.length <= 1) return;

        const s1 = wrapper.querySelector('#vs1') as SVGPathElement | null;
        const s2 = wrapper.querySelector('#vs2') as SVGPathElement | null;
        const s3 = wrapper.querySelector('#vs3') as SVGPathElement | null;
        if (!s1 || !s2 || !s3) return;

        const comparedS1 = lapData[0]?.laps[selectedLap]?.durationSector1 ?? 900;
        const comparedS2 = lapData[0].laps[selectedLap].durationSector2;
        const comparedS3 = lapData[0].laps[selectedLap].durationSector3;

        const s1Times: number[] = [];
        const s2Times: number[] = [];
        const s3Times: number[] = [];
        for (let i = 1; i < lapData.length; i++) {
            s1Times[i - 1] = lapData[i].laps[selectedLap].durationSector1;
            s2Times[i - 1] = lapData[i].laps[selectedLap].durationSector2;
            s3Times[i - 1] = lapData[i].laps[selectedLap].durationSector3;
        }

        if (comparedS1 === 0.0) {
            s1.style.stroke = sectorGRAY;
        } else if (comparedS1 <= Math.min(...s1Times)) {
            s1.style.stroke = sectorPURPLE;
        } else if (comparedS1 >= Math.max(...s1Times)) {
            s1.style.stroke = sectorYELLOW;
        } else {
            s1.style.stroke = sectorGREEN;
        }

        if (comparedS2 <= Math.min(...s2Times)) {
            s2.style.stroke = sectorPURPLE;
        } else if (comparedS2 >= Math.max(...s2Times)) {
            s2.style.stroke = sectorYELLOW;
        } else {
            s2.style.stroke = sectorGREEN;
        }

        if (comparedS3 <= Math.min(...s3Times)) {
            s3.style.stroke = sectorPURPLE;
        } else if (comparedS3 >= Math.max(...s3Times)) {
            s3.style.stroke = sectorYELLOW;
        } else {
            s3.style.stroke = sectorGREEN;
        }
    }, [lapData, selectedLap]);

    if (!TrackComponent) {
        return <div>Circuit "{circuitName}" not found.</div>;
    }

    const getSectorId = (target: EventTarget | null): string | null => {
        if (!(target instanceof Element)) return null;
        const sector = target.closest('path[id^="s"]') as SVGElement | null;
        if (!sector?.id) return null;
        return sector.id.startsWith('s') ? sector.id : null;
    };

    const handleMouseEnter = (e: React.MouseEvent<SVGSVGElement>) => {
        const id = getSectorId(e.target);
        if (id) {
            const target = e.target as Element;
            const sector = target.closest('path[id^="s"]') as SVGPathElement | null;
            if(!sector) return;

            onSectorHover?.(id, e.clientX, e.clientY);
        } else{
            onSectorHover?.(null);
        }
    };
    const handleMouseOut = (e: React.MouseEvent<SVGSVGElement>) => {
        onSectorHover?.(null);
    };

    return (
        <div ref={wrapperRef} className="track-wrapper">
            <TrackComponent
                onMouseOver={handleMouseEnter}
                onMouseLeave={handleMouseOut}
            />
        </div>
    );
};

export default TrackLoader;