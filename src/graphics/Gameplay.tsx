import React, { Ref, createRef, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import NodeCG from '@nodecg/types'
import styled from 'styled-components'
import { useReplicant, useListenFor } from '@nodecg/react-hooks'

const SPECIAL_ASSET_NAME = 'gameplay-specials'

const Special = styled.video`
    position: absolute;
    inset: 0;
    pointer-events: none;
`

type RefList = {
    [key: string]: React.RefObject<HTMLVideoElement>
}

export const GameplayOverlay: React.FC = () => {
    // @ts-expect-error This is an error with useReplicant that will be fixed in the next version
    const [assetsRep] = useReplicant<NodeCG.AssetFile[]>(
        'assets:' + SPECIAL_ASSET_NAME
    )
    useListenFor('playSpecial', (specialName: string) => {
        if (specialRefs[specialName.toLowerCase()]) {
            specialRefs[specialName.toLowerCase()].current?.play()
        }
    })
    const specialRefs: RefList = {}

    if (!assetsRep) {
        return
    }

    const specialElements = assetsRep.map((asset: NodeCG.AssetFile) => {
        const ref = createRef<HTMLVideoElement>()
        specialRefs[asset.name.toLowerCase()] = ref

        return (
            <Special ref={ref} key={asset.name} autoPlay={false}>
                <source src={asset.url} type="video/webm" />
            </Special>
        )
    })

    return <>{specialElements}</>
}

// Bootstrap stuff
const root = createRoot(document.getElementById('root')!)
root.render(<GameplayOverlay />)
