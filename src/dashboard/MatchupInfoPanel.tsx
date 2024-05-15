import React from 'react'
import { OpponentSelector } from './OpponentSelector'
import 'primereact/resources/themes/md-dark-indigo/theme.css'
import { FlexColumn, FlexRow } from '../components/layout/Flexbox'
import { PlayerSelector } from './PlayerSelector'

const wdgPlayers = ['Just Awkward', 'Newdini', 'Type', 'Benzo', 'BRich']

export const MatchupInfoPanel: React.FC = () => {
    return (
        <FlexColumn gap="1rem">
            <h3>Opponent</h3>
            <OpponentSelector filter />
            <h3>Player Comparison</h3>
            <FlexRow align="center" gap="1rem">
                <PlayerSelector
                    playerFilter={wdgPlayers}
                    comparisonId={0}
                    filter
                />
                <p>vs.</p>
                <PlayerSelector comparisonId={1} filter />
            </FlexRow>
            <p>
                Use the controls above to automatically update OBS sources and
                cells within the Google Spreadsheet &quot;database&quot; for
                stats and team/player information.
            </p>
        </FlexColumn>
    )
}
