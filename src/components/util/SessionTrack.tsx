import { useMemo, useRef, useState } from "react";
import type { DetailedLapData } from "../../interfaces/types";
import TrackLoader from "./TrackLoader";

const SessionTrack = ({lapData, selectedLap}: {lapData: DetailedLapData[], selectedLap: number}) => {

    const sortedLaps = useMemo(() => {
        if(lapData != undefined && lapData.length == 0) return[];
        return [...lapData].sort((a, b) => {
            const aTime = a.laps?.[selectedLap]?.lapDuration ?? 999;
            const bTime = b.laps?.[selectedLap]?.lapDuration ?? 999;
            return aTime - bTime;
        });
    }, [lapData, selectedLap]);

    const sectorTooltipRef = useRef<HTMLDivElement>(null);
    
    const handleTrackHover = (id: string | null, centerX?: number, centerY?: number) => {
        const tooltip = sectorTooltipRef.current;

        if (id !== null) {
            if (!tooltip) return;

            tooltip.style.display = 'block';
            tooltip.style.left = `${centerX ?? 160}px`;
            tooltip.style.top = `${centerY ?? 160}px`;

            if (lapData && lapData.length > 0 && lapData[0].laps[selectedLap]) {
                let sectorHTML = ``;
                lapData.forEach((data) => {
                    console.log("id ", id);
                    sectorHTML += `<div>${data.fullName}: `
                    switch(id){
                        case 's1':
                            sectorHTML += `${data.laps[selectedLap].durationSector1}<div>`; 
                            break;
                        case 's2':
                            sectorHTML += `${data.laps[selectedLap].durationSector2}<div>`;
                            break;
                        case 's3':
                            sectorHTML += `${data.laps[selectedLap].durationSector3}<div>`;
                            break;
                    }
                })
                tooltip.innerHTML = `<div class="font-bold min-w-2xs border-b bg-dark-gray mb-1">Sector ${id.charAt(1)} times</div>
                ${sectorHTML}`;
            }
        } else{
            if (!tooltip) return;
            tooltip.style.display = 'none';
        }
    }

    return (
        <div className="m-2 p-2">
            {lapData?.length != 0 &&
                <div className="flex flex-row justify-between">
                    <TrackLoader circuitName="imola" lapData={lapData} selectedLap={selectedLap} 
                        onSectorHover={(id: string | null, centerX?: number, centerY?: number) => handleTrackHover(id, centerX, centerY)}/>
                    <div className="flex flex-col">
                        {sortedLaps != undefined && sortedLaps.length > 0 &&
                            sortedLaps?.map((lap) => {
                                return (<>
                                {lap?.laps != undefined &&
                                    <div className="mt-1 text-start">
                                        <p>{lap.fullName} {lap.driverNumber}</p>
                                        {lap?.laps[selectedLap].isPitOutLap === "false" ? 
                                            <p>{lap.laps[selectedLap].compound} {lap.laps[selectedLap].lapDuration}</p>
                                            : 
                                            <div>
                                                <p>{lap.laps[selectedLap].lapDuration}</p>
                                                <p>{lap.laps[selectedLap - 1].compound} {lap.laps[selectedLap].compound}</p>
                                            </div>}
                                    </div>}
                                </>)
                        })}
                    </div>
                    <div ref={sectorTooltipRef} className="fixed hidden pointer-events-none bg-dark-gray text-white p-3 rounded shadow-xl z-50 text-xs"
                        style={{ transform: 'translate(-50%, -120%)' }}/>
                </div>
            }
        </div>
    )
}
export default SessionTrack;