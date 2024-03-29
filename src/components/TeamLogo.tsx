import React from 'react'
import { useReplicant } from '@nodecg/react-hooks'

type TeamLogoProps = {
	className?: string
	team: string
}

export const TeamLogo: React.FC<TeamLogoProps> = ({ className, team }) => {
	// @ts-expect-error This is an error with useReplicant that will be fixed in the next version
	const [teamLogosRep] = useReplicant<NodeCG.AssetFile[]>('assets:team-logos')

	const teamLogo = teamLogosRep?.find((asset) => {
		return asset.name.includes(team.replaceAll(' ', '_'))
	})

	return (
		<img className={`TeamLogo ${className}`} src={teamLogo?.url} />
	)
}

export const WDGLogo: React.FC<{ className?: string, color?: 'red' | 'white' }> = ({ className, color }) => {
	const fileColor = `Wizards District Gaming Primary Icon${color === 'white' ? ' White' : ''}`

    return (
        <TeamLogo className={className} team={fileColor} />
    )
}

export const OpponentLogo: React.FC<{ className?: string }> = ({ className }) => {
	const [opponentRep] = useReplicant<string>('opponent')

    return (
        <TeamLogo className={className} team={opponentRep || ''} />
    )
}