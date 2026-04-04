    export interface Session{
        circuitShortName: string,
        dateEnd: string,
        dateStart: string,
        id: number,
        sessionName: string,
        sessionType: string
    };
    export interface Race{
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
    export interface Driver{
        broadcastName: string,
        driverNumber: number,
        fullName: string,
        headshotUrl: string | null,
        nameAcronym: string,
        teamName: string
    }
    export interface DetailedLapData{
        driverNumber: number,
        headshotUrl: string,
        nameAcronym: string,
        teamColour: string,
        fullName: string,
        laps: Lap[]
    }
    export interface Lap{
        compound: string,
        lapNumber: number,
        durationSector1: number,
        durationSector2: number,
        durationSector3: number,
        lapDuration: number,
        isPitOutLap: string,
        tyreAgeAtStart: number
    }