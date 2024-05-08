import React, { ChangeEvent, useEffect, useState } from 'react'
import { useReplicant } from '@nodecg/react-hooks'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { FlexColumn, FlexRow } from '../components/layout/Flexbox'
import styled from 'styled-components'
import { Nullable } from 'primereact/ts-helpers'

const timeOptions: Intl.DateTimeFormatOptions = {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
}

const timeAdd = (
    date: Date,
    minutes: number,
    returnDate?: boolean
): string | Date => {
    const MS_IN_MIN = 60000
    const newDate = new Date(date.valueOf() + minutes * MS_IN_MIN)
    return returnDate ? newDate : newDate.toLocaleTimeString([], timeOptions)
}
const add = timeAdd

const generateRundownTemplate = (startTime: Date) => {
    const start = add(startTime, 0)
    const gameDayStart = add(startTime, -15, true) as Date
    const preShowStart = add(gameDayStart, -60, true) as Date

    return `Template generated for ${start} start time. Update things in <brackets>, then delete this line.


# PRE-SHOW (50m)
| Time | Segment | Length |
| ---- | ------- | ------ |
| ${add(preShowStart, 0)} | Stream Starting Soon loop | 10m |
| ${add(preShowStart, 10)} | Intro video | 30s |
| ${add(preShowStart, 10.5)} | **Talent intro** | 30s |
| ${add(preShowStart, 11)} | The Rewind | 5m |
| ${add(preShowStart, 16)} | Standings, League Format, Schedule | 3m |
| ${add(preShowStart, 19)} | <PLAYER> interview | 10m |
| ${add(preShowStart, 29)} | **BRB** | 3m |
| ${add(preShowStart, 32)} | McDonald's Gamer Bundle | 30s |
| ${add(preShowStart, 32.5)} | Tonight's Matchup | 7m |
| ${add(preShowStart, 39)} | Jon Byrum handoff | 10m |
| ${add(preShowStart, 49)} | **Talent outro** | 1m |
---
# BREAK (10m)
| Time | Segment | Length |
| ---- | ------- | ------ |
| ${add(preShowStart, 50)} | BRB scene. Pre-show is encouraged to run long. | 10m (or less) |
---
# GAME DAY
| Time | Segment | Length |
| ---- | ------- | ------ |
| ${add(gameDayStart, 0)} | Intro video | 20s |
| ${add(gameDayStart, 0.5)} | **Talent intro** | 40s |
| ${add(gameDayStart, 1)} | General recap | 2m |
| ${add(gameDayStart, 3)} | Matchup discussion | 2m |
| ${add(gameDayStart, 5)} | Starting lineup | 90s |
| ${add(gameDayStart, 6.5)} | 3v3 rules breakdown | 30s |
| ${add(gameDayStart, 7)} | Standings/bracket | 2m |
| ${add(gameDayStart, 9)} | <CONTENT PIECE> | 1m |
| ${add(gameDayStart, 10)} | Live look-in, player matchups to watch, other content, etc. | 5m |
| ${start} | **GAME 1 START** |

## Content after game 1
* <PROMO OR CONTENT AFTER GAME 1>

## Content after game 2
* <PROMO OR CONTENT AFTER GAME 2>

## Content after game 3
* <PROMO OR CONTENT AFTER GAME 3>

## Content after game 4
* <PROMO OR CONTENT AFTER GAME 4>

## END OF SERIES
* Recap
* Upcoming games
* PROMO | Rivalry Series (if not done earlier)
* Sign-off
`
}

const MD_CHEAT_SHEET_LINK = 'https://www.markdownguide.org/cheat-sheet/'

const RundownElement = styled.div`
    .monospace {
        font-family: monospace;
    }
`

export const RundownEditor: React.FC = () => {
    const [rundownRep, setRundownRep] = useReplicant<string>('rundown')
    const [gameStartTime, setGameStartTime] = useState<Nullable<Date>>(
        new Date('May 8, 2024 20:15:00')
    )
    const [markdownText, setMarkdownText] = useState<string>('')

    useEffect(() => {
        if (rundownRep) {
            setMarkdownText(rundownRep)
        }
    }, [rundownRep])

    const onBlur = (e: ChangeEvent<HTMLTextAreaElement>) => {
        console.log('onBlur')
        setRundownRep(e.target.value)
    }

    const writeTemplate = () => {
        let time = gameStartTime
        if (!time) {
            time = new Date('May 8, 2024 20:15:00')
            setGameStartTime(time)
        }

        setRundownRep(generateRundownTemplate(time))
    }

    return (
        <RundownElement>
            <FlexColumn justify="space-between" align="flex-start" gap="1rem">
                <FlexRow gap="0.5rem">
                    <FlexColumn
                        justify="space-between"
                        align="flex-start"
                        gap="1rem"
                    >
                        <label htmlFor="timePicker">Match Start Time</label>
                        <Calendar
                            id="timePicker"
                            value={gameStartTime}
                            onChange={(e) => setGameStartTime(e.value)}
                            hourFormat="12"
                            timeOnly
                        />
                    </FlexColumn>
                    <FlexColumn
                        justify="space-between"
                        align="flex-start"
                        gap="1rem"
                    >
                        <label htmlFor="timePicker">Pre-Show Start Time</label>
                        <Calendar
                            id="timePicker"
                            value={
                                gameStartTime
                                    ? (timeAdd(
                                          gameStartTime,
                                          -75,
                                          true
                                      ) as Date)
                                    : null
                            }
                            onChange={(e) => setGameStartTime(e.value)}
                            hourFormat="12"
                            timeOnly
                            disabled
                        />
                    </FlexColumn>
                    <FlexColumn
                        justify="space-between"
                        align="flex-start"
                        gap="1rem"
                    >
                        <label htmlFor="timePicker">GameDay Start Time</label>
                        <Calendar
                            id="timePicker"
                            value={
                                gameStartTime
                                    ? (timeAdd(
                                          gameStartTime,
                                          -15,
                                          true
                                      ) as Date)
                                    : null
                            }
                            onChange={(e) => setGameStartTime(e.value)}
                            hourFormat="12"
                            timeOnly
                            disabled
                        />
                    </FlexColumn>
                </FlexRow>
                <InputTextarea
                    className="monospace"
                    value={markdownText}
                    onChange={(e) => setMarkdownText(e.target.value)}
                    onBlur={onBlur}
                    rows={20}
                    cols={68}
                />
                <FlexRow justify="space-between" style={{ width: '100%' }}>
                    <Button onClick={writeTemplate}>Reset Template</Button>
                    <p>
                        This editor uses{' '}
                        <a href={MD_CHEAT_SHEET_LINK}>Markdown</a> formatting.
                    </p>
                </FlexRow>
            </FlexColumn>
        </RundownElement>
    )
}
