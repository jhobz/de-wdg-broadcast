import React from 'react'
import { createRoot } from 'react-dom/client'
import { RundownEditor } from './RundownEditor'
import 'primereact/resources/themes/md-dark-indigo/theme.css'

// As-is, this file is superfluous as it's just a wrapper for the Rundown Editor.
// But it's likely that this panel will contain more elements in the future.
export default function RundownPanel() {
    return (
        <RundownEditor></RundownEditor>
    )
}


const root = createRoot(document.getElementById('root')!)
root.render(<RundownPanel />)