import { useMemo, useRef } from 'react'
import type { DetailedLapData } from '../../interfaces/types'
import TrackLoader from './TrackLoader'
import CompoundLoader from './CompoundLoader'

const SessionTrack = ({
  lapData,
  selectedLap,
  circuitName
}: {
  lapData: DetailedLapData[]
  selectedLap: number
  circuitName: string | undefined
}) => {
  const sortedLaps = useMemo(() => {
    if (lapData != undefined && lapData.length == 0) return []
    return [...lapData].sort((a, b) => {
      const aTime = a.laps?.[selectedLap]?.lapDuration ?? 999
      const bTime = b.laps?.[selectedLap]?.lapDuration ?? 999
      return aTime - bTime
    })
  }, [lapData, selectedLap])

  const sectorTooltipRef = useRef<HTMLDivElement>(null)

  const handleTrackHover = (
    id: string | null,
    centerX?: number,
    centerY?: number
  ) => {
    const tooltip = sectorTooltipRef.current

    if (id !== null) {
      if (!tooltip) return

      tooltip.style.display = 'block'
      tooltip.style.left = `${centerX ?? 160}px`
      tooltip.style.top = `${centerY ?? 160}px`

      const tooltipLapExists = lapData && lapData.length > 0 && lapData[0]?.laps?.[selectedLap]
      if (tooltipLapExists) {
        let sectorHTML = ``
        lapData.forEach(data => {
          const lap = data?.laps?.[selectedLap]
          if (!lap) return
          sectorHTML += `<div>${data.fullName}: `
          const duration = (value: number | null) =>
            value == null ? 'N/A' : value
          switch (id) {
            case 's1':
              sectorHTML += `${duration(lap.durationSector1)}<div>`
              break
            case 's2':
              sectorHTML += `${duration(lap.durationSector2)}<div>`
              break
            case 's3':
              sectorHTML += `${duration(lap.durationSector3)}<div>`
              break
          }
        })
        tooltip.innerHTML = `<div class="font-bold min-w-2xs border-b mb-1">Sector ${id.charAt(
          1
        )} times</div>
                ${sectorHTML}`
      }
    } else {
      if (!tooltip) return
      tooltip.style.display = 'none'
    }
  }

  if (circuitName === undefined) {
    return <p>Error loading track</p>
  }
  return (
    <div className='m-2 p-2 overflow-x-auto'>
      {lapData?.length != 0 && (
        <div className='flex lg:flex-row flex-col justify-between overflow-x-auto'>
          <TrackLoader
            circuitName={circuitName}
            lapData={lapData}
            selectedLap={selectedLap}
            onSectorHover={(
              id: string | null,
              centerX?: number,
              centerY?: number
            ) => handleTrackHover(id, centerX, centerY)}
          />
          <div className='flex flex-col'>
            {sortedLaps != undefined &&
              sortedLaps.length > 0 &&
              sortedLaps?.map((lap, i) => {
                const currentLap = lap?.laps?.[selectedLap]
                const previousLap = lap?.laps?.[selectedLap - 1]
                const isPitOutLap = currentLap?.isPitOutLap
                return (
                  <div key={i}>
                    {currentLap != undefined && (
                      <div className='mt-1 text-start bg-slate-900 p-3 rounded-2xl'>
                        <p>
                          <span style={{ color: String('#' + lap.teamColour) }}>
                            {lap.fullName} {lap.driverNumber}
                          </span>
                        </p>
                        {(isPitOutLap === undefined || isPitOutLap === 'false') ? (
                          <p className='flex flex-row items-center justify-between'>
                            <CompoundLoader
                              compound={currentLap.compound}
                            />{' '}
                            {currentLap.lapDuration}
                          </p>
                        ) : (
                          <div className='flex flex-row items-center justify-around'>
                            <CompoundLoader
                              compound={previousLap?.compound ?? currentLap.compound}
                            />{' '}
                            {'>>>'}{' '}
                            <CompoundLoader
                              compound={currentLap.compound}
                            />{' '}
                            <p>{currentLap.lapDuration}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
          <div
            ref={sectorTooltipRef}
            className='fixed hidden pointer-events-none bg-dark-gray text-white p-3 rounded shadow-xl z-50 text-xs'
            style={{ transform: 'translate(-50%, -120%)' }}
          />
        </div>
      )}
    </div>
  )
}
export default SessionTrack
