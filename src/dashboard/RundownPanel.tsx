import React from 'react'
import { RundownEditor } from './RundownEditor'
import 'primereact/resources/themes/md-dark-indigo/theme.css'

// As-is, this file is superfluous as it's just a wrapper for the Rundown Editor.
// But it's likely that this panel will contain more elements in the future.
export const RundownPanel: React.FC = () => {
    return <RundownEditor></RundownEditor>
}
