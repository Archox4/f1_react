import { useQuery } from "@tanstack/react-query"
import LoadingDots from "./util/LoadingAnim"
import baseApi from "./util/ApiConfig"
import { useContext, useMemo, useState, useTransition } from "react"
import axios from "axios"
import ErrorDisplay from "./util/ErrorDisplay"

export default function RaceList(){
    
    interface Session{
        circuitShortName: string,
        dateEnd: string,
        dateStart: string,
        id: number,
        sessionName: string,
        sessionType: string
    };
    interface Race{
        circuitShortName: string,
        countryCode: string,
        countryFlag: string,
        dateEnd: string,
        dateStart: string,
        id: number,
        location: string,
        meetingName: string,
        meetingOfficialName: string,
        sessions: Session[],
        year: number
    };

    const [year, setYear] = useState('2023');
    const [isSelectPending, startSelectTransition] = useTransition();
    const [isPopUp, setPopUp] = useState(false);

    

    const {data, isPending, error} = useQuery<Race[]>({
        queryKey: [`races/${year}`],
        queryFn: () => baseApi.get(`/races/year/${year}`).then(res => res.data),
        refetchOnWindowFocus: false
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

    const handleMeetingChange = (event: React.MouseEvent, data: Race) => {
        setSelectedId(data.id);
        if(data != null){
            setPopUp(true);
        }
    };

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
                <option id="2024">2024</option>
                <option id="2025">2025</option>
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
                                return (
                                <a key={session.id} href="/">
                                    <div className="flex flex-row m-1 p-2 hover:bg-dark-black rounded-2xl">
                                        <div className="flex-col">
                                            <p className="text-xl text-center w-80">{session.sessionName}</p>
                                            <p className="text-sm text-center w-80">{session.dateStart.split("T")[0]}</p>
                                        </div>
                                    </div>
                                </a>)
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
                        <a key={race.id} className="mt-2 cursor-pointer" onClick={(e) => handleMeetingChange(e, race)}>
                            <div className="flex flex-row justify-between items-center">
                                <p>{race.meetingOfficialName}</p>
                                <img src={race.countryFlag} alt={race.location} className="w-15 ml-5"/>
                            </div>
                        </a> 
                    )
                })}
            </div>
            }
        </div>
    </>)
}