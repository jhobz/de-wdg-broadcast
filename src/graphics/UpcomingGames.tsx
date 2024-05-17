import React from 'react'
import { createRoot } from 'react-dom/client'
import { useReplicant } from '@nodecg/react-hooks'
import { AssetOverlay } from '../components/AssetOverlay'
import { Schedule } from '../types/schemas'
import { FlexColumn } from '../components/layout/Flexbox'
import styled from 'styled-components'
import { TeamLogo } from '../components/TeamLogo'

const SPECIAL_ASSET_NAME = 'upcoming-games'
const NUMBER_OF_GAMES_TO_DISPLAY = 3

const MatchColumn = styled(FlexColumn)`
    width: 888px;
    height: 1080px;
    position: absolute;
    top: 0;
    right: 0;
    padding: 20px 180px 20px 214px; // Damn you, Cam!
    color: white;
    text-shadow: 5px 5px 5px #000;
    -webkit-text-stroke: 2px black;
`

const MatchRow = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 194px);
    grid-template-rows: 182px 104px;
    column-gap: 106px;
    row-gap: 32px;
    text-align: center;
    align-items: center;
`

const MatchImage = styled(TeamLogo)`
    width: 100%;
    height: 100%;
    padding: 0 12px;
    object-fit: contain;
    filter: drop-shadow(2px 2px 4px #000);
`

export const UpcomingGames: React.FC = () => {
    // @ts-expect-error This is an error with useReplicant that will be fixed in the next version
    const [scheduleRep] = useReplicant<Schedule>('schedule')

    if (!scheduleRep) {
        return
    }

    let count = 0
    const matchElements: JSX.Element[] = scheduleRep
        .filter((match) => {
            return (
                new Date(match.date).getTime() > Date.now() &&
                ++count <= NUMBER_OF_GAMES_TO_DISPLAY
            )
        })
        .map((match, i) => {
            const date = new Date(match.date).toLocaleDateString(['en-US'], {
                month: 'numeric',
                day: 'numeric',
            })
            const time = new Date(match.date)
                .toLocaleTimeString(['en-US'], {
                    hour: 'numeric',
                    minute: '2-digit',
                })
                .replace(' AM', '')
                .replace(' PM', '')
            return (
                <MatchRow key={i}>
                    <div></div>
                    <MatchImage team={match.opponent}></MatchImage>
                    <div>{date}</div>
                    <div>{time}</div>
                </MatchRow>
            )
        })

    return (
        <AssetOverlay assetName={SPECIAL_ASSET_NAME}>
            <MatchColumn gap="43px">{matchElements}</MatchColumn>
        </AssetOverlay>
    )
}

// Bootstrap stuff
const root = createRoot(document.getElementById('root')!)
root.render(<UpcomingGames />)
