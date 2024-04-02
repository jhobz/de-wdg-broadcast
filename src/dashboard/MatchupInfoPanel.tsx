import React from 'react'
import { createRoot } from 'react-dom/client'
import { OpponentSelector } from './OpponentSelector'
import 'primereact/resources/themes/md-dark-indigo/theme.css'
import { FlexColumn } from '../components/layout/Flexbox'

export default function MatchupInfoPanel() {
    return (
        <FlexColumn>
            <p>Opponent</p>
            <OpponentSelector />
            <p>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            </p>
        </FlexColumn>
    )
}

const root = createRoot(document.getElementById('root')!)
root.render(<MatchupInfoPanel />)