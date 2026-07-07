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

        const referenceLap = lapData[0]?.laps?.[selectedLap];
        const comparedS1 = referenceLap?.durationSector1 ?? null;
        const comparedS2 = referenceLap?.durationSector2 ?? null;
        const comparedS3 = referenceLap?.durationSector3 ?? null;

        const s1Times = lapData
            .slice(1)
            .map((lap) => lap.laps?.[selectedLap]?.durationSector1)
            .filter((value): value is number => typeof value === 'number')
        const s2Times = lapData
            .slice(1)
            .map((lap) => lap.laps?.[selectedLap]?.durationSector2)
            .filter((value): value is number => typeof value === 'number')
        const s3Times = lapData
            .slice(1)
            .map((lap) => lap.laps?.[selectedLap]?.durationSector3)
            .filter((value): value is number => typeof value === 'number')

        const getSectorColor = (
            referenceValue: number | null,
            values: number[]
        ) => {
            if (referenceValue === null || referenceValue === 0 || values.length === 0) {
                return sectorGRAY
            }
            const minValue = Math.min(...values)
            const maxValue = Math.max(...values)
            if (referenceValue <= minValue) return sectorPURPLE
            if (referenceValue >= maxValue) return sectorYELLOW
            return sectorGREEN
        }

        s1.style.stroke = getSectorColor(comparedS1, s1Times)
        s2.style.stroke = getSectorColor(comparedS2, s2Times)
        s3.style.stroke = getSectorColor(comparedS3, s3Times)
    }, [lapData, selectedLap]);

    if (!TrackComponent) {
        return <div>Circuit "{circuitName}" not found.</div>;
    }

    const getSectorId = (target: EventTarget | null): string | null => {
        if (!(target instanceof Element)) return null;
        const sector = target.closest('[id^="s"]') as SVGElement | null;
        //const sector = target.closest('path[id^="s"]') as SVGElement | null;
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
    const handleMouseOut = () => {
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