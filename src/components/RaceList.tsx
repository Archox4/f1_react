import { useQuery } from '@tanstack/react-query'
import LoadingDots from './util/LoadingAnim'
import baseApi from '../interfaces/ApiConfig'
import { useMemo, useState, useTransition } from 'react'
import axios from 'axios'
import ErrorDisplay from './util/ErrorDisplay'
import type { Race } from '../interfaces/types'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

export default function RaceList () {
  const navigate = useNavigate()
  const [year, setYear] = useState('2023')
  const [isSelectPending, startSelectTransition] = useTransition()
  const [isPopUp, setPopUp] = useState(false)

  const { data, isPending, error } = useQuery<Race[]>({
    queryKey: [`races/${year}`],
    queryFn: () => baseApi.get(`/meetings/year/${year}`).then(res => res.data),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  })

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selectedRace = useMemo(
    () => data?.find(r => r.id === selectedId),
    [data, selectedId]
  )

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isPending) {
      const nextYear = event.target.value
      startSelectTransition(() => {
        setYear(nextYear)
      })
    }
  }

  const handleMeetingChange = (data: Race) => {
    setSelectedId(data.id)
    if (data != null) {
      setPopUp(true)
    }
  }

  const handleSessionClick = (session_key: number) => {
    if (session_key != null) {
      navigate(`/session/${session_key}`)
    }
  }

  if (axios.isAxiosError(error)) {
    const status = error?.response?.status
    if (status === 404) {
      return <ErrorDisplay msg='No data found...' />
    } else if (status === 500) {
      return <ErrorDisplay msg='No connection to the server...' />
    }
  }

  return (
    <>
      <div className='flex flex-col w-full justify-start p-4 bg-dark-black min-h-100 rounded-2xl mt-2 lg:mt-10'>
        <div
          style={{
            opacity: isSelectPending ? 0.5 : 1,
            transition: 'opacity 0.2s'
          }}
        ></div>
        <select
          className='bg-dark-gray w-50 rounded-xl pr-2 h-8 text-center'
          value={year}
          onChange={handleYearChange}
        >
          <option id='2023' className='bg-gray-900 rounded-2xl border-0'>
            2023
          </option>
          <option id='2024' disabled>
            2024
          </option>
          <option id='2025' disabled>
            2025
          </option>
        </select>
        <AnimatePresence>
          {isPopUp && (
            <motion.div
              className='fixed inset-0 z-50 flex justify-center items-center p-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <motion.div
                className='fixed inset-0 bg-black/80 backdrop-blur-sm' onClick={() => setPopUp(false)}/>
              <motion.div className='relative bg-zinc-900 border border-zinc-700 p-6 rounded-2xl shadow-2xl max-w-md w-full z-10'>
                <div className='flex flex-row justify-around items-center'>
                  <h2 className='text-xl font-bold text-white'>
                    {selectedRace?.circuitShortName}
                  </h2>
                  <img
                    src={selectedRace?.countryFlag}
                    alt={selectedRace?.location}
                    className='w-15 ml-5'
                  />
                </div>  
                <div className='flex flex-col mt-2 w-full'>
                  {selectedRace?.sessions
                    .sort(
                      (a, b) =>
                        new Date(a.dateStart).getTime() -
                        new Date(b.dateStart).getTime()
                    )
                    .map(session => {
                      const isAvaible = session.sessionType === 'Race'
                      const disabledStyle = [
                        'flex',
                        'flex-row',
                        'm-1',
                        'p-2',
                        'items-center',
                        'justify-center',
                        isAvaible ? 'hover:bg-dark-black' : 'bg-gray-900',
                        'rounded-2xl'
                      ].join(' ')
                      return (
                        <div
                          key={session.id}
                          onClick={
                            isAvaible
                              ? () => handleSessionClick(session.id)
                              : undefined
                          }
                        >
                          <div className={disabledStyle}>
                            <div className='flex-col'>
                              <p className='text-xl text-center w-full'>
                                {session.sessionName}
                              </p>
                              <p className='text-sm text-center w-full'>
                                {session.dateStart.split('T')[0]}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {isPending ? (
          <>
            <LoadingDots />
          </>
        ) : (
          <div className='flex flex-col mt-2'>
            {data?.map(race => {
              return (
                <div
                  key={race.id}
                  className='mt-2 cursor-pointer'
                  onClick={() => handleMeetingChange(race)}
                >
                  <div className='flex flex-row justify-between items-center'>
                    <p className='md:text-xl text-xs text-left'>
                      {race.meetingOfficialName}
                    </p>
                    <img
                      src={race.countryFlag}
                      alt={race.location}
                      className='w-15 ml-5'
                    />
                  </div>
                  <hr className='rounded-xl mt-0.5 text-gray-800' />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
