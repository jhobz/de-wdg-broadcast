import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import 'primereact/resources/themes/md-dark-indigo/theme.css'
import 'primeicons/primeicons.css'

import { useReplicant } from '@nodecg/react-hooks'
import { FlexColumn, FlexRow } from '../components/layout/Flexbox'
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
    const [obsConnectionInfoRep, setObsConnectionInfoRep] =
        // @ts-expect-error useReplicant issue
        useReplicant<ObsConnectionInfo>('obsConnectionInfo')
    // @ts-expect-error useReplicant issue
    const [sourcesRep] = useReplicant<OBSInput[]>('obsVideoSources')
    const [obsMatchupGraphicRep, setObsMatchupGraphicRep] =
        useReplicant<string>('obsMatchupGraphicId')
    const [obsAddress, setObsAddress] = useState<string>('')
    const [obsPassword, setObsPassword] = useState<string>('')
    const [obsReconnect, setObsReconnect] = useState<boolean>(false)
    const [selectedSource, setSelectedSource] = useState<OBSInput>()

    const onInputBlur = () => {
        setObsConnectionInfoRep({
            address: obsAddress,
            password: obsPassword,
            reconnect: obsReconnect,
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
        setObsReconnect(!!obsConnectionInfoRep?.reconnect)
    }, [obsConnectionInfoRep])

    useEffect(() => {
        setSelectedSource(
            sourcesRep?.find((s) => s.inputUuid === obsMatchupGraphicRep)
        )
    }, [sourcesRep, obsMatchupGraphicRep])

    useEffect(() => {
        if (!selectedSource) {
            return
        }

        setObsMatchupGraphicRep(selectedSource.inputUuid)
    }, [selectedSource, setObsMatchupGraphicRep])

    return (
        <div className="ConnectionsPanel">
            <StatusIndicator
                status={!!obsStatusRep}
                okMessage="Connected to OBS"
                badMessage="Disconnected from OBS"
            />
            <h4>Connection Info</h4>
            <FlexColumn gap="1em" align="flex-start">
                <InputGroup>
                    <InputText
                        id="address"
                        value={obsAddress}
                        onChange={(e) => setObsAddress(e.target.value)}
                        onBlur={onInputBlur}
                        disabled={obsStatusRep}
                    />
                    <label htmlFor="address">Address</label>
                </InputGroup>
                <InputGroup>
                    <InputText
                        id="password"
                        type="password"
                        value={obsPassword}
                        onChange={(e) => setObsPassword(e.target.value)}
                        onBlur={onInputBlur}
                        disabled={obsStatusRep}
                    />
                    <label htmlFor="password">Password</label>
                </InputGroup>
                <Button onClick={onConnectButtonClick}>
                    {obsStatusRep ? 'Disconnect' : 'Connect'}
                </Button>
                <FlexRow gap="0.8em" align="flex-start">
                    <Checkbox
                        inputId="reconnect"
                        checked={obsReconnect}
                        onChange={(e) => setObsReconnect(!!e.checked)}
                        onBlur={onInputBlur}
                    ></Checkbox>
                    <label htmlFor="reconnect">
                        Automatically attempt to reconnect (every 5s)?
                    </label>
                </FlexRow>
            </FlexColumn>
            <h4>Source Assignment</h4>
            <FlexColumn gap="1rem">
                <label htmlFor="matchup-graphic">Matchup Graphic</label>
                <Dropdown
                    id="matchup-graphic"
                    disabled={!obsStatusRep}
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.value)}
                    options={sourcesRep || []}
                    optionLabel="inputName"
                    placeholder="Select a source"
                />
            </FlexColumn>
        </div>
    )
}

// Bootstrap stuff
const root = createRoot(document.getElementById('root')!)
root.render(<OBSConnectionPanel />)
