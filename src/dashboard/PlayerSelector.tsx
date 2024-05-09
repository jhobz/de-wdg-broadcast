import React from 'react'
import { useReplicant } from '@nodecg/react-hooks'
import { StatsData, PlayerInfo } from '../extension/index'

import { Dropdown, DropdownProps } from 'primereact/dropdown'

type PlayerSelectorProps = {
    players?: string[]
}

export const PlayerSelector: React.FC<PlayerSelectorProps> = ({ players }) => {
    // @ts-expect-error there is a bug with ts arrays in @nodecg/react-hooks@1.0.1 that will be fixed in the next release
    const [playersRep] = useReplicant<PlayerInfo[]>('players')
    // @ts-expect-error there is a bug with ts arrays in @nodecg/react-hooks@1.0.1 that will be fixed in the next release
    const [statsRep] = useReplicant<StatsData>('stats')

    const [playerOptions, setPlayerOptions] = React.useState<
        DropdownProps[] | undefined
    >([])

    React.useEffect(() => {
        setPlayerOptions(
            playersRep?.map((player) => {
                return {
                    name: player.name,
                    value: player,
                } as DropdownProps
            })
        )
    }, [playersRep])

    const setSelectedValue = (value: PlayerInfo) => {
        nodecg.sendMessage('changePlayerComparison', {
            player: value.name,
            team: value.team,
        })
    }

    return (
        <Dropdown
            style={{ width: 300 }}
            options={
                players
                    ? players.map((name: string) => {
                          return {
                              name,
                              value: {
                                  name,
                                  team: 'Wizards District Gaming',
                              },
                          }
                      })
                    : playerOptions
            }
            value={statsRep?.comparison[0]['PLAYER']}
            optionLabel="name"
            optionValue="value"
            placeholder="Select player"
            onChange={(e) => {
                setSelectedValue(e.value)
            }}
        />
    )
}
