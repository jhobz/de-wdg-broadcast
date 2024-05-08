import React from 'react'
import { createRoot } from 'react-dom/client'
import 'primereact/resources/themes/md-dark-indigo/theme.css'
import { Button } from 'primereact/button'
import { useReplicant } from '@nodecg/react-hooks'
import NodeCG from '@nodecg/types'

const SPECIAL_ASSET_NAME = 'gameplay-specials'

export default function SpecialControlsPanel() {
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

    return <>{buttons}</>
}

const root = createRoot(document.getElementById('root')!)
root.render(<SpecialControlsPanel />)
