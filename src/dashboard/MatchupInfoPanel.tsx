import React from 'react'
import { OpponentSelector } from './OpponentSelector'
import 'primereact/resources/themes/md-dark-indigo/theme.css'
import { FlexColumn, FlexRow } from '../components/layout/Flexbox'
import { PlayerSelector } from './PlayerSelector'
import { useReplicant } from '@nodecg/react-hooks'

export const MatchupInfoPanel: React.FC = () => {
    const [opponentRep] = useReplicant<string>('opponent')

    return (
        <FlexColumn gap="1rem">
            <h3>Opponent</h3>
            <OpponentSelector filter />
            <h3>Player Comparison</h3>
            <FlexRow align="center" gap="1rem">
                <PlayerSelector
                    teamFilter="Wizards District Gaming"
                    comparisonId={0}
                    filter
                />
                <p>vs.</p>
                <PlayerSelector
                    teamFilter={opponentRep}
                    comparisonId={1}
                    filter
                />
            </FlexRow>
            <p>
                Use the controls above to automatically update OBS sources and
                cells within the Google Spreadsheet &quot;database&quot; for
                stats and team/player information.
            </p>
        </FlexColumn>
    )
}
