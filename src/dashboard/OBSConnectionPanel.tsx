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
import { Dropdown } from 'primereact/dropdown'
import { OBSInput } from '../extension'

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
	// @ts-expect-error useReplicant issue
	const [sourcesRep] = useReplicant<OBSInput[]>('obsVideoSources')
	const [obsMatchupGraphicRep, setObsMatchupGraphicRep] = useReplicant<string>('obsMatchupGraphicId')
	const [obsAddress, setObsAddress] = useState<string>('')
	const [obsPassword, setObsPassword] = useState<string>('')
	const [selectedSource, setSelectedSource] = useState<OBSInput>()

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

	useEffect(() => {
		setSelectedSource(sourcesRep?.find((s) => s.inputUuid === obsMatchupGraphicRep))
	}, [sourcesRep, obsMatchupGraphicRep])

	useEffect(() => {
		console.log(selectedSource)
		if (!selectedSource) {
			return
		}

		setObsMatchupGraphicRep(selectedSource.inputUuid)
	}, [selectedSource, setObsMatchupGraphicRep])

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
			<h4>Source Assignment</h4>
			<FlexColumn gap='1rem'>
				<label htmlFor='matchup-graphic'>Matchup Graphic</label>
				<Dropdown
					id="matchup-graphic"
					disabled={!obsStatusRep}
					value={selectedSource}
					onChange={(e) => setSelectedSource(e.value)}
					options={sourcesRep || []}
					optionLabel='inputName'
					placeholder='Select a source' />
			</FlexColumn>
		</div>
	)
}

// Bootstrap stuff
const root = createRoot(document.getElementById('root')!)
root.render(<OBSConnectionPanel />)