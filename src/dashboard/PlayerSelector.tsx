import React, { useEffect, useState } from 'react'
import { useReplicant } from '@nodecg/react-hooks'
import { StatsData, PlayerInfo } from '../extension/index'

import { Dropdown, DropdownProps } from 'primereact/dropdown'

interface PlayerSelectorProps extends DropdownProps {
    playerFilter?: string[]
    comparisonId: number
}

export const PlayerSelector: React.FC<PlayerSelectorProps> = ({
    playerFilter,
    comparisonId,
    ...props
}) => {
    // @ts-expect-error there is a bug with ts arrays in @nodecg/react-hooks@1.0.1 that will be fixed in the next release
    const [playersRep] = useReplicant<PlayerInfo[]>('players')
    // @ts-expect-error there is a bug with ts arrays in @nodecg/react-hooks@1.0.1 that will be fixed in the next release
    const [statsRep] = useReplicant<StatsData>('stats')

    const [selectedPlayer, setSelectedPlayer] = useState<PlayerInfo>()
    const [playerOptions, setPlayerOptions] = useState<
        PlayerInfo[] | undefined
    >([])

    useEffect(() => {
        setPlayerOptions(playersRep || [])
    }, [playersRep])

    useEffect(() => {
        setSelectedPlayer({
            id: statsRep?.comparison[comparisonId].id,
            name: statsRep?.comparison[comparisonId].PLAYER ?? '',
            team: statsRep?.comparison[comparisonId].team ?? '',
        })
    }, [statsRep, comparisonId])

    return (
        <Dropdown
            {...props}
            style={{ width: 300 }}
            options={
                playerFilter
                    ? playerOptions?.filter((value) =>
                          playerFilter.includes(value.name)
                      )
                    : playerOptions
            }
            value={selectedPlayer}
            optionLabel="name"
            placeholder="Select player"
            onChange={(e) => {
                nodecg.sendMessage('changePlayerComparison', {
                    player: e.value.name,
                    team: e.value.team,
                })
            }}
        />
    )
}
