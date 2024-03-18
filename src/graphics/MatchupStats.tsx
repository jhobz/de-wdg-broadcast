import React from 'react'
import { createRoot } from 'react-dom/client'
import styled, { css } from 'styled-components'
import { useReplicant } from '@nodecg/react-hooks'

import { StatsData } from '../extension/index'
import { AssetOverlay } from '../components/AssetOverlay'
import { OpponentLogo, WDGLogo } from '../components/TeamLogo'
import { FlexColumn, FlexRow } from '../components/layout/Flexbox'

const STATS_TO_DISPLAY = [
	'WIN%',
	'PTS',
	'FG%',
	'3P%',
	'FT%',
	'OREB',
	'DREB',
	'REB',
	'TOV',
	'STL',
	'BLK'
] as (keyof StatsData['teams'][0])[]

const logoStyles = css`
	position: absolute;
	width: 250px;
	height: 250px;
	object-fit: contain;
	filter: drop-shadow(15px 15px 5px #222);
`

const WDGImage = styled(WDGLogo)<{ color: string }>`
	${logoStyles}
	left: 900px;
	top: 40px;
`

const OpponentImage = styled(OpponentLogo)`
	${logoStyles}
	left: 1500px;
	top: 40px;
`

export const MatchupStatsOverlay: React.FC = () => {
	const queryParams = new URLSearchParams(window.location.search)
	const backgroundType = queryParams.get('show')
	let filter, color
	switch (backgroundType) {
		case 'pg':
			filter = 'TailGate'	
			color = 'red'
			break
		default:
			filter = 'Gameday'
			color = 'white'
			break
	}

	return (
		<AssetOverlay
			assetName='matchup-stats-overlay'
			assetFilter={filter}
		>
			<WDGImage color={color} />
			<OpponentImage />
			<MatchupStats />
		</AssetOverlay>
	)
}

const StatColumn = styled(FlexColumn)`
	position: absolute;
	justify-content: space-evenly;
	font-size: 0.5em;
	width: 868px;
	height: 629px;
	top: 422px;
	left: 900px;
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
		flex: 0 0 172px;
		text-shadow: 5px 5px 5px #000;
		-webkit-text-stroke: 2px black;
	}
`

type StatRowProps = {
	wdgStat?: string
	statName: string
	oppStat?: string
}

const MatchupStat: React.FC<StatRowProps> = ({ wdgStat, statName, oppStat }) => {
	return (
		<StatRow>
			<span>{wdgStat}</span>
			<span className='stat-name'>{statName}</span>
			<span>{oppStat}</span>
		</StatRow>
	)
}

const MatchupStats: React.FC = () => {
	// @ts-expect-error This is an error with useReplicant that will be fixed in the next version
	const [statsRep] = useReplicant<StatsData>('stats')

	const statRows: Array<JSX.Element> = []

	if (statsRep && statsRep.teams.length) {
		STATS_TO_DISPLAY.forEach((statName) => {
			statRows.push(
				<MatchupStat
					key={statName}
					statName={statName}
					wdgStat={statsRep.teams[0][statName]}
					oppStat={statsRep.teams[1][statName]}
				/>)
		})
	}

	return (
		<StatColumn>
			{statRows}
		</StatColumn>
	)
}

// Bootstrap stuff
const root = createRoot(document.getElementById('root')!)
root.render(<MatchupStatsOverlay />)