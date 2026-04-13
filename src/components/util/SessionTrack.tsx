import { useMemo, useRef } from "react";
import type { DetailedLapData } from "../../interfaces/types";
import TrackLoader from "./TrackLoader";
import CompoundLoader from "./CompoundLoader";

const SessionTrack = ({lapData, selectedLap, circuitName}: {lapData: DetailedLapData[], selectedLap: number, circuitName: string | undefined}) => {

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
                tooltip.innerHTML = `<div class="font-bold min-w-2xs border-b mb-1">Sector ${id.charAt(1)} times</div>
                ${sectorHTML}`;
            }
        } else{
            if (!tooltip) return;
            tooltip.style.display = 'none';
        }
    }

    if(circuitName === undefined){
        return <p>Error loading track</p>
    }
    return (
        <div className="m-2 p-2">
            {lapData?.length != 0 &&
                <div className="flex flex-row justify-between">
                    <TrackLoader circuitName={circuitName} lapData={lapData} selectedLap={selectedLap} 
                        onSectorHover={(id: string | null, centerX?: number, centerY?: number) => handleTrackHover(id, centerX, centerY)}/>
                    <div className="flex flex-col">
                        {sortedLaps != undefined && sortedLaps.length > 0 &&
                            sortedLaps?.map((lap, i) => {
                                return (<div key={i} >
                                {lap?.laps != undefined &&
                                    <div className="mt-1 text-start bg-slate-900 p-3 rounded-2xl">
                                        <p><span style={{color: String("#"+lap.teamColour)}}>{lap.fullName} {lap.driverNumber}</span></p>
                                        {lap?.laps[selectedLap].isPitOutLap === "false" ? 
                                            <p className="flex flex-row items-center justify-between"><CompoundLoader compound={lap.laps[selectedLap].compound}/> {lap.laps[selectedLap].lapDuration}</p>
                                            : 
                                            <div className="flex flex-row items-center justify-around">
                                                <CompoundLoader compound={lap.laps[selectedLap - 1].compound}/> {">>>"} <CompoundLoader compound={lap.laps[selectedLap].compound}/> <p>{lap.laps[selectedLap].lapDuration}</p>
                                            </div>}
                                    </div>}
                                </div>)
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