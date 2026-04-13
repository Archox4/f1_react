import { useQuery } from "@tanstack/react-query"
import LoadingDots from "./util/LoadingAnim"
import baseApi from "./util/ApiConfig"
import { useMemo, useState, useTransition } from "react"
import axios from "axios"
import ErrorDisplay from "./util/ErrorDisplay"
import type { Race } from "../interfaces/types"
import { useNavigate } from "react-router-dom"

export default function RaceList(){

    const navigate = useNavigate();
    const [year, setYear] = useState('2023');
    const [isSelectPending, startSelectTransition] = useTransition();
    const [isPopUp, setPopUp] = useState(false);

    const {data, isPending, error} = useQuery<Race[]>({
        queryKey: [`races/${year}`],
        queryFn: () => baseApi.get(`/races/year/${year}`).then(res => res.data),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    });

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const selectedRace = useMemo(() => data?.find(r => r.id === selectedId), [data, selectedId]);

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if(!isPending){
            const nextYear = event.target.value;
            startSelectTransition(() => {
                setYear(nextYear);
            });
        }
    };

    const handleMeetingChange = (data: Race) => {
        setSelectedId(data.id);
        if(data != null){
            setPopUp(true);
        }
    };

    const handleSessionClick = (session_key: number) => {
        if(session_key != null){
            navigate(`/session/${session_key}`);
        }
    }

    if(axios.isAxiosError(error)){
        const status = error?.response?.status;
        if(status === 404){
            return <ErrorDisplay msg="No data found..."/>
        } else if(status === 500){
            return <ErrorDisplay msg="No connection to the server..."/>
        }
    }

    return (
    <>
        <div className="flex flex-col justify-start p-4 bg-dark-black min-h-100 rounded-2xl mt-10">
            <div style={{ opacity: isSelectPending ? 0.5 : 1, transition: 'opacity 0.2s' }}></div>
            <select className="bg-dark-gray w-50 rounded-xl pr-2 h-8 text-center" value={year} onChange={handleYearChange}>
                <option id="2023" className="bg-gray-900 rounded-2xl border-0">2023</option>
                <option id="2024" disabled>2024</option>
                <option id="2025" disabled>2025</option>
            </select>
            {isPopUp && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPopUp(false)}/>
                    <div className="relative bg-zinc-900 border border-zinc-700 p-6 rounded-2xl shadow-2xl max-w-md w-full z-10">
                        <div className="flex flex-row justify-around items-center">
                            <h2 className="text-xl font-bold text-white">{selectedRace?.circuitShortName}</h2>
                            <img src={selectedRace?.countryFlag} alt={selectedRace?.location} className="w-15 ml-5"/>
                        </div>
                        <div className="flex flex-col mt-2 w-100">
                            {selectedRace?.sessions.sort((a,b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime())
                            .map((session) => {
                                const isAvaible = session.sessionType === "Race"; 
                                const disabledStyle = ["flex", "flex-row", "m-1", "p-2", 
                                    isAvaible ? "hover:bg-dark-black" : "bg-gray-900", "rounded-2xl"].join(" ");
                                return (
                                <div key={session.id} onClick={isAvaible ? () => handleSessionClick(session.id) : undefined}>
                                    <div className={disabledStyle}>
                                        <div className="flex-col">
                                            <p className="text-xl text-center w-80">{session.sessionName}</p>
                                            <p className="text-sm text-center w-80">{session.dateStart.split("T")[0]}</p>
                                        </div>
                                    </div>
                                </div>)
                            })}
                        </div>
                    </div>
                </div>
            )}
            {isPending ? 
            <>
                <LoadingDots/>
            </>
            :
            <div className="flex flex-col mt-2">
                {data?.map((race) => {
                    return (
                        <div key={race.id} className="mt-2 cursor-pointer" onClick={() => handleMeetingChange(race)}>
                            <div className="flex flex-row justify-between items-center">
                                <p>{race.meetingOfficialName}</p>
                                <img src={race.countryFlag} alt={race.location} className="w-15 ml-5"/>
                            </div>
                        </div> 
                    )
                })}
            </div>
            }
        </div>
    </>)
}