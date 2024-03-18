import React from 'react'
import { Button } from 'primereact/button'
import 'primereact/resources/themes/md-dark-indigo/theme.css'
import 'primeicons/primeicons.css'

import { OpponentSelector } from './OpponentSelector'
import { RundownEditor } from './RundownEditor'
import { useReplicant } from '@nodecg/react-hooks'
import { FlexRow } from '../components/layout/Flexbox'

export function Panel() {
	const [isConnectedToGoogle] = useReplicant<boolean>('googleStatus')

	const loadStats = () => {
		nodecg.sendMessage('loadStats')
	}

	return (
		<div className='Panel'>
			<div>
				<FlexRow align='center' gap='1rem' style={{width: 300}}>
					<Button onClick={loadStats} icon='pi pi-refresh'></Button>
					<span>{ isConnectedToGoogle ? 'Stats loaded successfully!' : 'Connecting to stats sheet...' }</span>
				</FlexRow>
				<div>
					<OpponentSelector />
				</div>
			</div>
			<RundownEditor></RundownEditor>
		</div>
	)
}
