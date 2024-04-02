import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import 'primereact/resources/themes/md-dark-indigo/theme.css'
import 'primeicons/primeicons.css'

import { useReplicant } from '@nodecg/react-hooks'
import { FlexColumn } from '../components/layout/Flexbox'
import StatusIndicator from '../components/StatusIndicator'
import { ObsConnectionInfo } from '../types/schemas/obsConnectionInfo'
import styled from 'styled-components'

const InputGroup = styled.span.attrs({ className: 'p-float-label' })`
	align-self: stretch;

	& > input {
		width: 100%;
	}
`

export function OBSConnectionPanel() {
	const [obsStatusRep] = useReplicant<boolean>('obsStatus')
	// @ts-expect-error useReplicant issue
	const [obsConnectionInfoRep, setObsConnectionInfoRep] = useReplicant<ObsConnectionInfo>('obsConnectionInfo')
	const [obsAddress, setObsAddress] = useState<string>('')
	const [obsPassword, setObsPassword] = useState<string>('')

	const onInputBlur = () => {
		setObsConnectionInfoRep({
			address: obsAddress,
			password: obsPassword
		})
	}

	const onConnectButtonClick = () => {
		if (obsStatusRep) {
			nodecg.sendMessage('obs:disconnect')
			return
		}

		nodecg.sendMessage('obs:connect')
	}

	useEffect(() => {
		setObsAddress(obsConnectionInfoRep?.address || '')
		setObsPassword(obsConnectionInfoRep?.password || '')
	}, [obsConnectionInfoRep])

	return (
		<div className='ConnectionsPanel'>
				<StatusIndicator status={!!obsStatusRep} okMessage='Connected to OBS' badMessage='Disconnected from OBS' />
				<h4>Connection Info</h4>
			<FlexColumn gap='1rem' align='flex-start'>
				<InputGroup>
					<InputText id='address' value={obsAddress} onChange={(e) => setObsAddress(e.target.value)} onBlur={onInputBlur} disabled={obsStatusRep} />
					<label htmlFor='address'>Address</label>
				</InputGroup>
				<InputGroup>
					<InputText id='password' value={obsPassword} onChange={(e) => setObsPassword(e.target.value)} onBlur={onInputBlur} disabled={obsStatusRep} />
					<label htmlFor='password'>Password</label>
				</InputGroup>
				<Button onClick={onConnectButtonClick}>{obsStatusRep ? 'Disconnect' : 'Connect'}</Button>
			</FlexColumn>
		</div>
	)
}

// Bootstrap stuff
const root = createRoot(document.getElementById('root')!)
root.render(<OBSConnectionPanel />)