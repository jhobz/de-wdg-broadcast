import React from 'react'
import 'primereact/resources/themes/md-dark-indigo/theme.css'
import { Button } from 'primereact/button'
import { useReplicant } from '@nodecg/react-hooks'
import NodeCG from '@nodecg/types'
import { EvenGrid } from '../components/layout/Flexbox'

const SPECIAL_ASSET_NAME = 'gameplay-specials'

export const SpecialControlsPanel: React.FC = () => {
    // @ts-expect-error This is an error with useReplicant that will be fixed in the next version
    const [assetsRep] = useReplicant<NodeCG.AssetFile[]>(
        'assets:' + SPECIAL_ASSET_NAME
    )

    if (!assetsRep) {
        return
    }

    const buttons = assetsRep.map((asset) => {
        return (
            <Button
                style={{ minWidth: 'min-content' }}
                key={asset.name}
                onClick={(e) => {
                    onSpecialClick(e.currentTarget.innerText)
                }}
            >
                {asset.name.toUpperCase()}
            </Button>
        )
    })

    const onSpecialClick = (name: string) => {
        nodecg.sendMessage('playSpecial', name)
    }

    return (
        <EvenGrid rows={3} cols={3} gap="0.5rem">
            {buttons}
        </EvenGrid>
    )
}
