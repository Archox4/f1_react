import { useNavigate, useParams } from "react-router-dom";
import type { Driver, DetailedLapData } from "./interfaces/types";
import baseApi from "./components/util/ApiConfig";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, UserRoundX } from "lucide-react";
import SessionTrack from "./components/util/SessionTrack";
import { Button, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

export default function SessionPage(){
    const { session_key } = useParams<{session_key: string}>();
    const [selectedDrivers, setSelectedDrivers] = useState<number[]>([1]);
    const [selectedLap, setSelectedLap] = useState<number>(1);
    
    const navigate = useNavigate()
    
    const {data: drivers, isFetched} = useQuery<Driver[]>({
        queryKey: [`drivers/${session_key}`],
        queryFn: () => baseApi.get(`/drivers/${session_key}`).then(res => res.data),
        refetchOnWindowFocus: false
    });

    const {data: driversLapData} = useQuery<DetailedLapData[]>({
        queryKey: [`/laps/detailedForAllDrivers/${session_key}`],
        queryFn: () => baseApi.get(`/laps/detailedForAllDrivers/session_key=${session_key}`).then(res => res.data),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    });

    const maxLaps = useMemo(() => {
        if (!driversLapData || driversLapData.length === 0) return 0;
        const lapCounts = driversLapData.map(driver => driver.laps?.length || 0);
        return Math.max(...lapCounts);
    }, [driversLapData]);

    if(isFetched){
        if(drivers == undefined){
            navigate("/");
        }
    }

    const handleDriverAddition = (driver_number: number) =>{
        if(selectedDrivers.length < 5){
            setSelectedDrivers(prev => [...prev, driver_number]);
        }
    }
    const handleDriverRemove = (driver_number: number) =>{
        setSelectedDrivers(prev => prev.filter((id) => id !== driver_number));
    }

    const handleLapSelect = (lap_number: number) =>{
        selectedDrivers.forEach((driver_number) => {
            const lapData = driversLapData?.filter((lapData) => selectedDrivers.includes(driver_number));
            if (lapData === undefined){return};
            const driverLapData = lapData.find((data) => data.driverNumber === driver_number);
            if(driverLapData && driverLapData.laps.length < lap_number){
                setSelectedDrivers(prev => prev.filter((id) => id!= driver_number));
            }
            if(selectedDrivers.length > 0){
                setSelectedLap(lap_number);
            } else{
                setSelectedLap(1);
            }
        })
        setSelectedLap(lap_number);
        console.log(lap_number);
    }

    const handleLapSelectNext = () => {
            setSelectedLap(selectedLap === maxLaps - 1 ? maxLaps - 1 : selectedLap + 1);
    }

    const handleLapSelectPrev = () => {
            setSelectedLap(selectedLap === 0 ? 0 : selectedLap - 1);
    }

    return (
        <div className="bg-dark-black p-2 rounded-2xl mt-5 w-full">
            <div className="flex flex-row w-full">
            {drivers != null && (
                <div className="flex flex-col w-full">
                    <div className="rounded-2xl m-2 p-2 flex flex-row">
                    {selectedDrivers?.map((driver_id) => (
                        <div className="m-2 rounded-lg bg-blue-800 p-0.5 group grid" key={driver_id}>
                            <p className="col-start-1 row-start-1 m-1.5 transition-opacity duration-200 group-hover:opacity-0 pointer-events-none text-center">{drivers.find((d) => d.driverNumber == driver_id)?.fullName}</p>
                            <button onClick={() => handleDriverRemove(driver_id)} className="col-start-1 row-start-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer flex justify-center items-center text-red-500"><UserRoundX/></button>
                        </div>
                    ))}
                    <div className="flex">
                        {selectedDrivers.length !== 5 && (
                            <select onChange={(e) => handleDriverAddition(Number(e.target.value))} value="">
                                <option value="" disabled>Select a driver...</option>
                                {drivers?.filter((driver) => driver && !selectedDrivers.includes(driver.driverNumber)).map((driver) => {
                                    if(driversLapData == undefined) return (<option>No Data</option>)
                                    const driverData = driversLapData.find(d => String(d?.driverNumber) === String(driver.driverNumber));
                                    const hasData = !!driverData?.laps[selectedLap];
                                    return (
                                        <option 
                                        key={driver.driverNumber} 
                                        value={driver.driverNumber}
                                        disabled={!hasData} 
                                        className={!hasData ? "text-gray-400" : "text-black"}>
                                        {driver.fullName}
                                        </option>
                                    );
                                })}
                            </select>
                        )}
                        </div>
                    </div>
                    <div className="flex flex-row ms-6">
                        <Button onClick={handleLapSelectPrev} className="bg-slate-900 border border-slate-800 px-2 py-2 rounded-lg"><ChevronLeft/></Button>
                        <div className="relative w-26 ms-1 me-1">
                            <Listbox value={selectedLap} onChange={handleLapSelect}>
                                <ListboxButton className="flex w-full items-center justify-between rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-white">
                                    Lap {selectedLap + 1}
                                </ListboxButton>
                                <ListboxOptions as="div" className="max-h-60 absolute overflow-y-auto opacity-80 rounded-lg border border-slate-800 bg-slate-900 p-1 shadow-xl [--anchor-gap:4px]" style={{ maxHeight: '15rem' }}>
                                {Array.from({ length: maxLaps }, (_, i) => {
                                    return (
                                        <ListboxOption key={i} value={i}
                                            className="group flex cursor-pointer items-center gap-2 rounded-md py-1.5 px-3 select-none 
                                                data-focus:bg-purple-600 data-focus:text-black
                                                data-disabled:opacity-20 data-disabled:cursor-not-allowed text-white text-sm">
                                            {i + 1}
                                        </ListboxOption>
                                        );
                                    })}
                                </ListboxOptions>
                            </Listbox>
                        </div>
                        <Button onClick={handleLapSelectNext} className="bg-slate-900 border border-slate-800 px-2 py-2 rounded-lg"><ChevronRight/></Button>
                    </div>
                </div> 
            )}
            </div>
                {driversLapData != undefined && (
                    <div className="flex">
                    {driversLapData.filter((lapData) => selectedDrivers.includes(lapData.driverNumber)) != undefined &&
                        <SessionTrack lapData={driversLapData.filter((lapData) => selectedDrivers.includes(lapData.driverNumber))} selectedLap={selectedLap}/>
                    }
                    </div>
                )}
        </div>
    )
}