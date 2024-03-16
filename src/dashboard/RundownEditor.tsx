import React, { ChangeEvent, createRef, useEffect, useState } from 'react'
import { useReplicant } from '@nodecg/react-hooks'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'

const RUNDOWN_TEMPLATE = `Template for 8:15 PM start time. Update times and things in <brackets>, then delete this line.


# PRE-SHOW (50m)
| Time | Segment | Length |
| ---- | ------- | ------ |
| 7:00 PM    | Stream Starting Soon loop | 10m |
| 7:10 PM    | Intro video | 30s |
| 7:10:30 PM | **Talent intro** | 30s |
| 7:11 PM    | The Rewind | 5m |
| 7:16 PM    | Standings, League Format, Schedule | 3m |
| 7:19 PM    | <PLAYER> interview | 10m |
| 7:29 PM    | **BRB** | 3m |
| 7:32 PM    | McDonald's Gamer Bundle | 30s |
| 7:32:30 PM | Tonight's Matchup | 7m |
| 7:39 PM    | Jon Byrum handoff | 10m |
| 7:49 PM    | **Talent outro** | 1m |
---
# BREAK (10m)
| Time | Segment | Length |
| ---- | ------- | ------ |
| 7:50 PM | BRB scene. Pre-show is encouraged to run long. | 10m (or less) |
---
# GAME DAY
| Time | Segment | Length |
| ---- | ------- | ------ |
| 8:00 PM    | Intro video | 20s |
| 8:00:20 PM | **Talent intro** | 40s |
| 8:01 PM    | General recap | 2m |
| 8:03 PM    | Matchup discussion | 2m |
| 8:05 PM    | Starting lineup | 90s |
| 8:06:30 PM | 3v3 rules breakdown | 30s |
| 8:07 PM    | Standings/bracket | 2m |
| 8:09 PM    | <CONTENT PIECE> | 1m |
| 8:10 PM    | Live look-in, player matchups to watch, other content, etc. | 5m |
| 8:15 PM    | **GAME 1 START** |

## Content after game 1
* <PROMO OR CONTENT AFTER GAME 1>

## Content after game 2
* <PROMO OR CONTENT AFTER GAME 2>

## Content after game 3
* <PROMO OR CONTENT AFTER GAME 3>

## Content after game 4
* <PROMO OR CONTENT AFTER GAME 4>

## Content after game 5
* <PROMO OR CONTENT AFTER GAME 5>

## END OF SERIES
* Recap
* Upcoming games
* PROMO | Rivalry Series (if not done earlier)
* Sign-off
`

const MD_CHEAT_SHEET_LINK = 'https://www.markdownguide.org/cheat-sheet/'

export default function RundownEditor() {
    const [rundownRep, setRundownRep] = useReplicant<string>('rundown')
    const [cursor, setCursor] = useState<number>(0)
    const textareaRef = createRef<HTMLTextAreaElement>()

    // We need to keep track of the cursor position when using a replicant as our state
    // or the editing experience is miserable.
    useEffect(() => {
        textareaRef.current?.setSelectionRange(cursor, cursor)
    }, [textareaRef, cursor])

    const onTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCursor(e.target.selectionStart)
        setRundownRep(e.target.value)
    }

    const writeTemplate = () => {
        setRundownRep(RUNDOWN_TEMPLATE)
    }

    return (
        <div className='RundownEditor'>
            <h1>Rundown Editor</h1>
            <InputTextarea className='monospace' ref={textareaRef} value={rundownRep} onChange={onTextareaChange} rows={20} cols={70} />
            <div className="flex flex-between">
                <Button onClick={writeTemplate}>Reset to Template</Button>
                <p>This editor uses <a href={MD_CHEAT_SHEET_LINK}>Markdown</a> formatting.</p>
            </div>
        </div>
    )
}