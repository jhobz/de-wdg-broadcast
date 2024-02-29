import React from 'react';
import { createRoot } from 'react-dom/client';

export function TeamStats() {
	const statsRep = nodecg.Replicant('stats')
	statsRep.on('change', (newValue: any) => {
		Object.keys(newValue.teams[0]).forEach((key) => {
			const element = document.getElementById(`wdg-${key}`)
			if (element) {
				element.innerText = newValue.teams[0][key]
			}
		})
	})
	return (
		<>
			<div id="stats-row1" className="stats-row">
				<span id="wdg-WINS"></span>
				<span id="wdg-LOSSES"></span>
				<span id="wdg-WIN%"></span>
				<span id="wdg-PTS"></span>
				<span id="wdg-FG%"></span>
				<span id="wdg-3P%"></span>
				<span id="wdg-FT%"></span>
			</div>
			<div id="stats-row2" className="stats-row">
				<span id="wdg-OREB"></span>
				<span id="wdg-DREB"></span>
				<span id="wdg-REB"></span>
				<span id="wdg-AST"></span>
				<span id="wdg-TOV"></span>
				<span id="wdg-STL"></span>
				<span id="wdg-BLK"></span>
			</div>
		</>
	);
}

// Bootstrap stuff
const root = createRoot(document.getElementById('root')!);
root.render(<TeamStats />);