import React from 'react'
import { createRoot } from 'react-dom/client'
import { useReplicant } from '@nodecg/react-hooks'
import { AssetOverlay } from '../components/AssetOverlay'
import { Schedule } from '../types/schemas'
import { FlexColumn } from '../components/layout/Flexbox'

const SPECIAL_ASSET_NAME = 'upcoming-games'
const NUMBER_OF_GAMES_TO_DISPLAY = 3

export const UpcomingGames: React.FC = () => {
    // @ts-expect-error This is an error with useReplicant that will be fixed in the next version
    const [scheduleRep] = useReplicant<Schedule>('schedule')

    if (!scheduleRep) {
        return
    }

    let count = 0
    const matchElements: JSX.Element[] = scheduleRep
        .filter((match) => {
            console.log(count)
            return (
                new Date(match.date).getTime() > Date.now() &&
                ++count <= NUMBER_OF_GAMES_TO_DISPLAY
            )
        })
        .map((match, i) => {
            return <div key={i}>{`${match.opponent} on ${match.date}`}</div>
        })

    return (
        <AssetOverlay assetName={SPECIAL_ASSET_NAME}>
            <FlexColumn>{matchElements}</FlexColumn>
        </AssetOverlay>
    )
}

// Bootstrap stuff
const root = createRoot(document.getElementById('root')!)
root.render(<UpcomingGames />)
