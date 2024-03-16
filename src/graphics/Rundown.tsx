import { useReplicant } from '@nodecg/react-hooks'
import React from 'react'
import { createRoot } from 'react-dom/client'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Rundown() {
    const [rundownRep] = useReplicant<string>('rundown')

    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
        >{rundownRep}</Markdown>
    )
}

const root = createRoot(document.getElementById('root')!)
root.render(<Rundown />)