import React from 'react';

export function Index() {
	const statsRep = nodecg.Replicant('stats')
	statsRep.on('change', (newValue: any) => {
		console.log(newValue.teams[0])
		Object.keys(newValue.teams[0]).forEach((key) => {
			const element = document.getElementById(`wdg-${key}`)
			if (element) {
				element.innerText = newValue.teams[0][key]
			}
		})
	})
	return (
		<>
			<div id="stats-row1">
				<div class="stats-row-inner">
					<span id="wdg-WINS"></span>
					<span id="wdg-LOSSES"></span>
					<span id="wdg-WIN%"></span>
					<span id="wdg-PTS"></span>
					<span id="wdg-FG%"></span>
					<span id="wdg-3P%"></span>
					<span id="wdg-FT%"></span>
				</div>
			</div>
			<div id="stats-row2">
				<div class="stats-row-inner">
					<span id="wdg-OREB"></span>
					<span id="wdg-DREB"></span>
					<span id="wdg-REB"></span>
					<span id="wdg-AST"></span>
					<span id="wdg-TOV"></span>
					<span id="wdg-STL"></span>
					<span id="wdg-BLK"></span>
				</div>
			</div>
		</>
	);
}
