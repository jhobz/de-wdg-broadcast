import React from 'react'
import { Button } from 'primereact/button'
import 'primereact/resources/themes/md-dark-indigo/theme.css'
import 'primeicons/primeicons.css'

import { useReplicant } from '@nodecg/react-hooks'
import { FlexRow, FlexColumn } from '../components/layout/Flexbox'
import StatusIndicator from '../components/StatusIndicator'

export const StatusPanel: React.FC = () => {
    const [googleStatusRep] = useReplicant<boolean>('googleStatus')
    const [obsStatusRep] = useReplicant<boolean>('obsStatus')

    const loadStats = () => {
        nodecg.sendMessage('loadStats')
    }

    const doObsThings = () => {
        nodecg.sendMessage('obs:debugTasks')
    }

    return (
        <div className="Panel">
            <FlexColumn align="flex-start" gap="1rem">
                <StatusIndicator
                    status={!!obsStatusRep}
                    okMessage="Connected to OBS"
                    badMessage="Disconnected from OBS"
                />
                <Button onClick={doObsThings}>Trigger OBS Debug Tasks</Button>
                <FlexRow align="center" gap="1rem" style={{ width: 300 }}>
                    <StatusIndicator
                        status={!!googleStatusRep}
                        okMessage="Stats loaded successfully!"
                        badMessage="Connecting to stats sheet..."
                    />
                    <Button onClick={loadStats} icon="pi pi-refresh"></Button>
                </FlexRow>
                <div></div>
            </FlexColumn>
        </div>
    )
}
