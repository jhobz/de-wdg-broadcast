import React from 'react';
import { createRoot } from 'react-dom/client';

export function MatchupStats() {
	const statsRep = nodecg.Replicant('stats')
	statsRep.on('change', (newValue: any) => {
		Object.keys(newValue.teams[0]).forEach((key) => {
			const element = document.getElementById(`wdg-${key}`)
			if (element) {
				element.innerText = newValue.teams[0][key]
			}
		})
		Object.keys(newValue.teams[1]).forEach((key) => {
			const element = document.getElementById(`opp-${key}`)
			if (element) {
				element.innerText = newValue.teams[1][key]
			}
		})
	})
	return (
		<>
			<div id="stats-col1" className="stats-col">
				<div id="wdg-WIN%"></div>
				<div id="wdg-PTS"></div>
				<div id="wdg-FG%"></div>
				<div id="wdg-3P%"></div>
				<div id="wdg-FT%"></div>
				<div id="wdg-OREB"></div>
				<div id="wdg-DREB"></div>
				<div id="wdg-REB"></div>
				<div id="wdg-TOV"></div>
				<div id="wdg-STL"></div>
				<div id="wdg-BLK"></div>
			</div>
			<div id="stats-col2" className="stats-col">
				<div id="opp-WIN%"></div>
				<div id="opp-PTS"></div>
				<div id="opp-FG%"></div>
				<div id="opp-3P%"></div>
				<div id="opp-FT%"></div>
				<div id="opp-OREB"></div>
				<div id="opp-DREB"></div>
				<div id="opp-REB"></div>
				<div id="opp-TOV"></div>
				<div id="opp-STL"></div>
				<div id="opp-BLK"></div>
			</div>
		</>
	);
}

// Bootstrap stuff
const root = createRoot(document.getElementById('root')!);
root.render(<MatchupStats />);