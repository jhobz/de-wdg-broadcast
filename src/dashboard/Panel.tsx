import React from 'react'
import { useReplicant } from '@nodecg/react-hooks'
import { Button } from 'primereact/button'
import 'primereact/resources/themes/md-dark-indigo/theme.css'
import { TeamInfo } from '../extension/index'

import ImageSelect, { Option } from '../components/ImageSelect'
import RundownEditor from './RundownEditor'

export function Panel() {
	// const [selectedOption, setSelectedOption] = React.useState()
	// @ts-expect-error there is a bug with ts arrays in @nodecg/react-hooks@1.0.1 that will be fixed in the next release
	const [teamsRep] = useReplicant<TeamInfo[]>('teams')
	// @ts-expect-error there is a bug with ts arrays in @nodecg/react-hooks@1.0.1 that will be fixed in the next release
	const [teamLogosRep] = useReplicant<NodeCG.AssetFile[]>('assets:team-logos')
	const [teamOptions, setTeamOptions] = React.useState<Option[] | undefined>([])

	const loadStats = () => {
		nodecg.sendMessage('loadStats')
	}

	React.useEffect(() => {
		setTeamOptions(teamsRep?.map((team) => {
			const matchingLogo = teamLogosRep?.find((asset) => {
				return asset.base.indexOf(team.team.replaceAll(' ', '_')) > -1
			})

			return {
				name: team.team,
				img: matchingLogo ? matchingLogo.url : ''
			} as Option
		}))
	}, [teamsRep, teamLogosRep])

	return (
		<div className='Panel'>
			<div>
				<ImageSelect options={teamOptions}/>
				<Button onClick={loadStats}>Load Stats</Button>
			</div>
			<RundownEditor></RundownEditor>
		</div>
	)
}
