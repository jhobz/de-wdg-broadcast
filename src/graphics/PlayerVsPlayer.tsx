import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import styled, { css } from 'styled-components'
import { useReplicant } from '@nodecg/react-hooks'

import { StatsData } from '../extension/index'
import { AssetOverlay } from '../components/AssetOverlay'
import { OpponentLogo, WDGLogo } from '../components/TeamLogo'
import { FlexColumn, FlexRow } from '../components/layout/Flexbox'
import NodeCG from '@nodecg/types'

const STATS_TO_DISPLAY = [
    'PTS',
    'FG%',
    '3P%',
    'FT%',
    'AST',
    'FGM',
    'FGA',
    'REB',
    'TOV',
    'STL',
    'BLK',
] as (keyof StatsData['comparison'][0])[]

const logoStyles = css`
    position: absolute;
    width: 250px;
    height: 250px;
    object-fit: contain;
    filter: drop-shadow(15px 15px 5px #222);
`

const OpponentImage = styled(OpponentLogo)`
    ${logoStyles}
    width: 145px;
    height: 226px;
    /* border: 1px solid lime; */
    filter: saturate(0.5) brightness(0.5);
    transform: skew(-4deg, -4deg) rotate3d(0, 1, 0, -15deg);
    left: 1502px;
    top: 335px;
`

const Player = styled.img<{ silhouette?: boolean }>`
    position: absolute;
    left: -150px;
    bottom: -300px;
    aspect-ratio: 2401/3600;
    height: 1440px;
    /* border: 1px solid lime; */
    filter: drop-shadow(-5px 0 5px #ddd);
`

const OpponentPlayer = styled(Player)`
    left: 1236px;
    bottom: 0;
    height: 1080px;
    filter: drop-shadow(-5px 0 5px #ddd);
    transform: scaleX(-1);
`

const PlayerTitle = styled.span`
    position: absolute;
    bottom: 200px;
    width: 675px;
    font-weight: 700;
    font-size: 6rem;
    color: white;
    text-align: center;
    text-transform: uppercase;
    text-shadow: 5px 5px 5px #000;
    -webkit-text-stroke: 2px black;
`

export const PlayerVsPlayerOverlay: React.FC = () => {
    // @ts-expect-error This is an error with useReplicant that will be fixed in the next version
    const [playerImageAssetsRep] = useReplicant<NodeCG.AssetFile[]>(
        'assets:player-photos'
    )
    // @ts-expect-error This is an error with useReplicant that will be fixed in the next version
    const [statsRep] = useReplicant<StatsData>('stats')
    const [playerImages, setPlayerImages] = useState<string[]>([])

    useEffect(() => {
        if (!playerImageAssetsRep?.length || !statsRep?.comparison.length) {
            return
        }

        setPlayerImages([
            playerImageAssetsRep.find((asset) => {
                return asset.name
                    .toLowerCase()
                    .includes(
                        statsRep.comparison[0]['PLAYER']?.toLowerCase() ||
                            'newdini'
                    )
            })?.url || '',
            playerImageAssetsRep.find((asset) => {
                return asset.name.toLowerCase().includes('silhouette')
            })?.url || '',
        ])
    }, [playerImageAssetsRep, statsRep])

    return (
        <AssetOverlay
            assetName="player-stat-comparison-overlay"
            style={{ overflow: 'hidden' }}
        >
            <Player src={playerImages[0]} />
            <PlayerTitle
                style={{
                    left: 0,
                }}
            >
                {statsRep?.comparison[0]['PLAYER']}
            </PlayerTitle>
            <OpponentPlayer src={playerImages[1]} />
            <OpponentImage />
            <PlayerTitle
                style={{
                    right: 0,
                }}
            >
                {statsRep?.comparison[1]['PLAYER']}
            </PlayerTitle>
            <MatchupStats />
        </AssetOverlay>
    )
}

const StatColumn = styled(FlexColumn)`
    position: absolute;
    justify-content: space-around;
    font-size: 0.5em;
    width: 572px;
    height: 802px;
    top: 258px;
    left: 674px;
    line-height: 1em;
    box-sizing: border-box;
    padding: 25px 0;
`

const StatRow = styled(FlexRow)`
    text-align: center;

    & > span {
        flex: 1 0 200px;
    }

    & > .stat-name {
        color: white;
        font-weight: 700;
        flex: 0 0 122px;
        text-shadow: 5px 5px 5px #000;
        -webkit-text-stroke: 2px black;
    }
`

type StatRowProps = {
    wdgStat?: string
    statName: string
    oppStat?: string
}

const MatchupStat: React.FC<StatRowProps> = ({
    wdgStat,
    statName,
    oppStat,
}) => {
    return (
        <StatRow>
            <span>{wdgStat}</span>
            <span className="stat-name">{statName}</span>
            <span>{oppStat}</span>
        </StatRow>
    )
}

const MatchupStats: React.FC = () => {
    // @ts-expect-error This is an error with useReplicant that will be fixed in the next version
    const [statsRep] = useReplicant<StatsData>('stats')

    const statRows: Array<JSX.Element> = []

    if (statsRep && statsRep.comparison.length) {
        console.log(statsRep)
        STATS_TO_DISPLAY.forEach((statName) => {
            statRows.push(
                <MatchupStat
                    key={statName}
                    statName={statName}
                    wdgStat={statsRep.comparison[0][statName]}
                    oppStat={statsRep.comparison[1][statName]}
                />
            )
        })
    }

    return <StatColumn>{statRows}</StatColumn>
}

// Bootstrap stuff
const root = createRoot(document.getElementById('root')!)
root.render(<PlayerVsPlayerOverlay />)
