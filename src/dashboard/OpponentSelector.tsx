import React from 'react'
import { useReplicant } from '@nodecg/react-hooks'
import { TeamInfo } from '../extension/index'

import ImageSelect, { ImageSelectOption } from '../components/ImageSelect'
import { DropdownProps } from 'primereact/dropdown'

export const OpponentSelector: React.FC<DropdownProps> = (props) => {
    // @ts-expect-error there is a bug with ts arrays in @nodecg/react-hooks@1.0.1 that will be fixed in the next release
    const [teamsRep] = useReplicant<TeamInfo[]>('teams')
    // @ts-expect-error there is a bug with ts arrays in @nodecg/react-hooks@1.0.1 that will be fixed in the next release
    const [teamLogosRep] = useReplicant<NodeCG.AssetFile[]>('assets:team-logos')
    const [opponentRep, setOpponentRep] = useReplicant<string>('opponent')

    const [teamOptions, setTeamOptions] = React.useState<
        ImageSelectOption[] | undefined
    >([])

    React.useEffect(() => {
        setTeamOptions(
            teamsRep?.map((team) => {
                const matchingLogo = teamLogosRep?.find((asset) => {
                    return (
                        asset.base.indexOf(team.team.replaceAll(' ', '_')) > -1
                    )
                })

                return {
                    name: team.team,
                    img: matchingLogo ? matchingLogo.url : '',
                } as ImageSelectOption
            })
        )
    }, [teamsRep, teamLogosRep])

    return (
        <ImageSelect
            {...props}
            style={{ width: 300 }}
            options={teamOptions}
            value={opponentRep}
            optionLabel="name"
            optionValue="name"
            placeholder="Select opponent"
            onChange={(e) => {
                setOpponentRep(e.value)
            }}
        />
    )
}
