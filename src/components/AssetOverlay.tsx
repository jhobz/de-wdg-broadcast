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
	assetFilter?: string
	children: React.ReactNode
}

export const AssetOverlay: React.FC<OverlayProps> = ({ assetName, assetFilter, children }) => {
	// @ts-expect-error This is an error with useReplicant that will be fixed in the next version
	const [assets] = useReplicant<NodeCG.AssetFile[]>('assets:' + assetName)

	const url = getAssetUrl(assets, assetFilter)

	return (
		<Background $url={url}>
			{children}
		</Background>
	)
}

const getAssetUrl = (assets: NodeCG.AssetFile[] | undefined, assetFilter?: string) => {
	if (!assets || !assets.length) {
		return ''
	}

	if (!assetFilter) {
		return assets[0].url
	}

	const asset = assets.find((asset) => {
		return asset.name.includes(assetFilter.replaceAll(' ', '_'))
	})
	
	return asset?.url || ''
}