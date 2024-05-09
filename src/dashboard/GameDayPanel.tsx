import React from 'react'
import styled from 'styled-components'
import { createRoot } from 'react-dom/client'
import { StatusPanel } from './StatusPanel'
import { MatchupInfoPanel } from './MatchupInfoPanel'
import { RundownPanel } from './RundownPanel'
import { SpecialControlsPanel } from './SpecialControlsPanel'
import { FlexColumn } from '../components/layout/Flexbox'

const PanelGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    grid-template-rows: auto;
    grid-auto-rows: 220px;
    grid-auto-flow: row dense;
    gap: 0.5rem;

    & > * {
        background-color: rgba(0, 0, 0, 0.2);
        padding: 1em;
    }

    & > .span2 {
        grid-row: span 2;
    }

    & > .span3 {
        grid-row: span 3;
    }
`

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
}

const Panel: React.FC<PanelProps> = ({ title, children, ...props }) => {
    return (
        <FlexColumn gap="1rem" {...props}>
            <h2>{title}</h2>
            <div>{children}</div>
        </FlexColumn>
    )
}

const GameDayPanel: React.FC = () => {
    return (
        <PanelGrid>
            <Panel title="Connection Status">
                <StatusPanel></StatusPanel>
            </Panel>
            <Panel className="span2" title="Matchup Info">
                <MatchupInfoPanel></MatchupInfoPanel>
            </Panel>
            <Panel className="span3" title="Rundown Editor">
                <RundownPanel></RundownPanel>
            </Panel>
            <Panel title="Special Effects">
                <SpecialControlsPanel></SpecialControlsPanel>
            </Panel>
        </PanelGrid>
    )
}

export default GameDayPanel

createRoot(document.getElementById('root')!).render(<GameDayPanel />)
