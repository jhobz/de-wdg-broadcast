import React, { useEffect, useState } from 'react'
import { useReplicant } from '@nodecg/react-hooks'
import { StatsData, PlayerInfo, TeamInfo } from '../extension/index'

import { Dropdown, DropdownProps } from 'primereact/dropdown'
import { FlexRow } from '../components/layout/Flexbox'
import styled from 'styled-components'

interface PlayerSelectorProps extends DropdownProps {
    teamFilter?: string
    comparisonId: number
}

// Primereact Dropdown doesn't seem to expose this type, so we have to recreate it
type DropdownGroupOption = {
    code?: string
    group: boolean
    index: number
    label?: string
    optionGroup: GroupedOption
}

type GroupedOption = {
    name: string
    logoUrl: string
    players: PlayerInfo[]
}

const Option = styled(FlexRow)`
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    height: 30px;

    img {
        width: 30px;
        object-fit: contain;
    }

    label {
        flex-grow: 1;
    }
`

const groupTemplate = (option: DropdownGroupOption) => {
    return (
        <Option>
            <img src={option.optionGroup.logoUrl} />
            <label>{option.optionGroup.name}</label>
        </Option>
    )
}

export const PlayerSelector: React.FC<PlayerSelectorProps> = ({
    teamFilter,
    comparisonId,
    ...props
}) => {
    // @ts-expect-error there is a bug with ts arrays in @nodecg/react-hooks@1.0.1 that will be fixed in the next release
    const [teamsRep] = useReplicant<TeamInfo[]>('teams')
    // @ts-expect-error there is a bug with ts arrays in @nodecg/react-hooks@1.0.1 that will be fixed in the next release
    const [teamLogosRep] = useReplicant<NodeCG.AssetFile[]>('assets:team-logos')
    // @ts-expect-error there is a bug with ts arrays in @nodecg/react-hooks@1.0.1 that will be fixed in the next release
    const [playersRep] = useReplicant<PlayerInfo[]>('players')
    // @ts-expect-error there is a bug with ts arrays in @nodecg/react-hooks@1.0.1 that will be fixed in the next release
    const [statsRep] = useReplicant<StatsData>('stats')

    const [selectedPlayer, setSelectedPlayer] = useState<PlayerInfo>()
    const [playerOptions, setPlayerOptions] = useState<
        GroupedOption[] | undefined
    >([])

    useEffect(() => {
        const groupedOptions: GroupedOption[] =
            teamsRep?.map((team) => {
                const matchingLogo = teamLogosRep?.find(
                    (asset) =>
                        asset.base.indexOf(team.team.replaceAll(' ', '_')) > -1
                )

                return {
                    name: team.team,
                    logoUrl: matchingLogo ? matchingLogo.url : '',
                    players: [],
                }
            }) || []

        groupedOptions?.forEach((team) => {
            team.players =
                playersRep?.filter(
                    (player) =>
                        player.team.toLowerCase() === team.name.toLowerCase()
                ) || []
        })

        setPlayerOptions(groupedOptions || [])
    }, [playersRep, teamsRep, teamLogosRep])

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
            options={
                teamFilter
                    ? playerOptions?.filter((team) =>
                          teamFilter.includes(team.name)
                      )
                    : playerOptions
            }
            value={selectedPlayer}
            optionGroupLabel="name"
            optionGroupChildren="players"
            optionGroupTemplate={groupTemplate}
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
