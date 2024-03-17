import React from 'react'
import NodeCG from '@nodecg/types'
import styled from 'styled-components'
import { useReplicant } from '@nodecg/react-hooks'

const Background = styled.div<{ $url: string }>`
	width: 1920px;
	height: 1080px;
    position: relative;

	background: url(${(props) => props.$url});
`

type OverlayProps = {
	assetName: string
	children: React.ReactNode
}

export const AssetOverlay: React.FC<OverlayProps> = ({ assetName, children }) => {
	// @ts-expect-error This is an error with useReplicant that will be fixed in the next version
	const [assets] = useReplicant<NodeCG.AssetFile[]>('assets:' + assetName)

	const url = assets && assets[0] ? assets[0].url : ''

	return (
		<Background $url={url}>
			{children}
		</Background>
	)
}