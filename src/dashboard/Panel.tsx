import React, { createRef, useRef } from 'react'

export function Panel() {

	const loadStats = () => {
		nodecg.sendMessage('loadStats')
	}

	return (
		<>
			<button onClick={loadStats}>Load Stats</button>
		</>
	)
}
