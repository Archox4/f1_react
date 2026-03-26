import { useParams } from "react-router-dom";
import type { Driver, DetailedLapData } from "./interfaces/types";
import baseApi from "./components/util/ApiConfig";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UserRoundX } from "lucide-react";

export default function SessionPage(){
    const { session_key } = useParams<{session_key: string}>();
    const [selectedDrivers, setSelectedDrivers] = useState<number[]>([1]);
    
    const {data: drivers} = useQuery<Driver[]>({
        queryKey: [`drivers/${session_key}`],
        queryFn: () => baseApi.get(`/drivers/${session_key}`).then(res => res.data),
        refetchOnWindowFocus: false
    });

    const lapsData = useQueries<DetailedLapData[]>({
        queries: selectedDrivers.map((id) => ({
            queryKey: ['laps', id],
            queryFn: () => baseApi.get(`/laps/detailed/session_key=${session_key}&driver_number=${id}`).then((res) => res.data as DetailedLapData),
            staleTime: 1000 * 60 * 5
        }))
    });

    const handleDriverAddition = (driver_number: number) =>{
        if(selectedDrivers.length < 5){
            setSelectedDrivers(prev => [...prev, driver_number]);
        }
    }
    const handleDriverRemove = (driver_number: number) =>{
        setSelectedDrivers(prev => prev.filter((id) => id !== driver_number));
    }

    return (
        <div className="bg-dark-black p-2 rounded-2xl mt-5 flex flex-row justify-between">
            {drivers != null && 
                (<div className="rounded-2xl m-2 p-2 flex flex-row">
                    {selectedDrivers?.map((driver_id) => {
                    return (
                        <div className="m-2 rounded-2xl bg-blue-800 p-2 group grid">
                            <p className="col-start-1 row-start-1 transition-opacity duration-200 group-hover:opacity-0 pointer-events-none text-center">{drivers.find((d) => d.driverNumber == driver_id).fullName}</p>
                            <button onClick={() => handleDriverRemove(driver_id)} className="col-start-1 row-start-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer flex justify-center text-red-500"><UserRoundX/></button>
                        </div>)
                    })
                }
                <div className="flex right-0">
                    <select onChange={(e) => handleDriverAddition(Number(e.target.value))} value="">
                        <option value="" disabled>Select a driver...</option>
                        {drivers.filter((driver) => !selectedDrivers.includes(driver.driverNumber)).map((driver) => {
                            return (<option key={driver.driverNumber} className="text-black" value={driver.driverNumber}>{driver.fullName}</option>)
                        })}
                    </select>
                </div>
            </div>)}
        </div>
    )
}