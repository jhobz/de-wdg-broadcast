import React from 'react'
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'
import { useReplicant } from '@nodecg/react-hooks'

import { StatsData } from '../extension/index'
import { AssetOverlay } from '../components/AssetOverlay'
import { OpponentLogo, WDGLogo } from '../components/TeamLogo'

const WDGImage = styled(WDGLogo)`
	width: 250px;
	height: 250px;
	position: absolute;
	left: 900px;
	top: 40px;
	object-fit: contain;
`

const OpponentImage = styled(OpponentLogo)`
	width: 250px;
	height: 250px;
	position: absolute;
	left: 1500px;
	top: 40px;
	object-fit: contain;
`

export function MatchupStats() {
	return (
		<AssetOverlay assetName='matchup-stats-overlay'>
			<WDGImage />
			<OpponentImage />
			<MatchupStatsData />
		</AssetOverlay>
	)
}

function MatchupStatsData() {
	// @ts-expect-error This is an error with useReplicant that will be fixed in the next version
	const [statsRep] = useReplicant<StatsData>('stats')

	return (
		<>
			<div id="stats-col1" className="stats-col">
				<div id="wdg-WIN%">{statsRep?.teams[0]['WIN%']}</div>
				<div id="wdg-PTS">{statsRep?.teams[0]['PTS']}</div>
				<div id="wdg-FG%">{statsRep?.teams[0]['FG%']}</div>
				<div id="wdg-3P%">{statsRep?.teams[0]['3P%']}</div>
				<div id="wdg-FT%">{statsRep?.teams[0]['FT%']}</div>
				<div id="wdg-OREB">{statsRep?.teams[0]['OREB']}</div>
				<div id="wdg-DREB">{statsRep?.teams[0]['DREB']}</div>
				<div id="wdg-REB">{statsRep?.teams[0]['REB']}</div>
				<div id="wdg-TOV">{statsRep?.teams[0]['TOV']}</div>
				<div id="wdg-STL">{statsRep?.teams[0]['STL']}</div>
				<div id="wdg-BLK">{statsRep?.teams[0]['BLK']}</div>
			</div>
			<div id="stats-col2" className="stats-col">
				<div id="opp-WIN%">{statsRep?.teams[1]['WIN%']}</div>
				<div id="opp-PTS">{statsRep?.teams[1]['PTS']}</div>
				<div id="opp-FG%">{statsRep?.teams[1]['FG%']}</div>
				<div id="opp-3P%">{statsRep?.teams[1]['3P%']}</div>
				<div id="opp-FT%">{statsRep?.teams[1]['FT%']}</div>
				<div id="opp-OREB">{statsRep?.teams[1]['OREB']}</div>
				<div id="opp-DREB">{statsRep?.teams[1]['DREB']}</div>
				<div id="opp-REB">{statsRep?.teams[1]['REB']}</div>
				<div id="opp-TOV">{statsRep?.teams[1]['TOV']}</div>
				<div id="opp-STL">{statsRep?.teams[1]['STL']}</div>
				<div id="opp-BLK">{statsRep?.teams[1]['BLK']}</div>
			</div>
		</>
	)
}

// Bootstrap stuff
const root = createRoot(document.getElementById('root')!)
root.render(<MatchupStats />)