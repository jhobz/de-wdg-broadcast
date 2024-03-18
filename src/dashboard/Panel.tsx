import React from 'react'
import { Button } from 'primereact/button'
import 'primereact/resources/themes/md-dark-indigo/theme.css'

import { OpponentSelector } from './OpponentSelector'
import { RundownEditor } from './RundownEditor'

export function Panel() {
	// const [selectedOption, setSelectedOption] = React.useState()

	const loadStats = () => {
		nodecg.sendMessage('loadStats')
	}

	return (
		<div className='Panel'>
			<div>
				<div>
					<OpponentSelector />
				</div>
				<div>
					<Button onClick={loadStats}>Load Stats</Button>
				</div>
			</div>
			<RundownEditor></RundownEditor>
		</div>
	)
}
