import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import NodeCG from '@nodecg/types'
import { useReplicant } from '@nodecg/react-hooks'
import { AssetOverlay } from '../components/AssetOverlay'
import styled from 'styled-components'
import { FlexRow } from '../components/layout/Flexbox'

const DAY_IN_MS = 1000 * 60 * 60 * 24

const Month = styled(FlexRow)`
    position: absolute;
    left: var(--week-start);
    top: var(--month-start);
    width: calc(var(--week-width) + 5px);
    flex-wrap: wrap;
    align-items: flex-start;
    column-gap: var(--day-gap);
    row-gap: 7px;
`

const Cross = styled.img`
    width: var(--day-width);
    height: var(--day-height);
    background-color: rgba(0, 0, 0, 0.2);
`

const startDate = new Date('May 1, 2024')
const today = new Date(new Date().toDateString())

export const ScheduleOverlay: React.FC = () => {
    // @ts-expect-error This is an error with useReplicant that will be fixed in the next version
    const [crossAssetRep] = useReplicant<NodeCG.AssetFile[]>(
        'assets:schedule-obsolete-day'
    )
    const [crossElements, setCrossElements] = useState<JSX.Element[]>([])

    useEffect(() => {
        if (!crossAssetRep) {
            return
        }

        const daysToCross = (today.getTime() - startDate.getTime()) / DAY_IN_MS

        console.log(crossAssetRep, daysToCross)

        setCrossElements(
            new Array<JSX.Element>(daysToCross).fill(
                <Cross src={crossAssetRep[0].url} />,
                0,
                daysToCross
            )
        )
    }, [crossAssetRep])

    return (
        <AssetOverlay
            className="schedule"
            assetName="schedule"
            data-startday={startDate.getDay()}
        >
            <Month>{crossElements}</Month>
        </AssetOverlay>
    )
}

// Bootstrap stuff
const root = createRoot(document.getElementById('root')!)
root.render(<ScheduleOverlay />)
