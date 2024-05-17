import React, { useEffect, useState } from 'react'
import NodeCG from '@nodecg/types'
import styled from 'styled-components'
import { useReplicant } from '@nodecg/react-hooks'
import 'primeicons/primeicons.css'

const Background = styled.div<{ $url: string }>`
    width: 1920px;
    height: 1080px;
    position: relative;

    background: url(${(props) => props.$url});
`

const Fallback = styled.i.attrs({
    className: 'pi pi-spin pi-spinner',
})`
    position: absolute;
    left: calc(1920px / 2);
    top: calc(1080px / 2);
    transform: translate(-50%, -50%);
    font-size: 5rem;
    color: #d2353a;
`

interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {
    assetName: string
    assetFilter?: string
    children?: React.ReactNode
}

export const AssetOverlay: React.FC<OverlayProps> = ({
    assetName,
    assetFilter,
    children,
    ...props
}) => {
    // @ts-expect-error This is an error with useReplicant that will be fixed in the next version
    const [assets] = useReplicant<NodeCG.AssetFile[]>('assets:' + assetName)
    const [loading, setLoading] = useState<boolean>(true)

    const url = getAssetUrl(assets, assetFilter)

    useEffect(() => {
        const imageForLoadDetection = new Image()
        imageForLoadDetection.src = url
        imageForLoadDetection.onload = () => setLoading(false)
    })

    return loading ? (
        <Fallback></Fallback>
    ) : (
        <Background $url={url} {...props}>
            {children}
        </Background>
    )
}

const getAssetUrl = (
    assets: NodeCG.AssetFile[] | undefined,
    assetFilter?: string
) => {
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
