import React, { useCallback, useEffect, useState } from 'react'
import { useReplicant } from '@nodecg/react-hooks'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { FlexColumn, FlexRow } from '../components/layout/Flexbox'
import { Schedule } from '../types/schemas'
import { InputText } from 'primereact/inputtext'

type Match = Schedule[0]

interface InputWithLabelProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string
    id?: string
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({
    label,
    id,
    children,
    ...props
}) => (
    <FlexColumn
        {...props}
        justify="space-between"
        align="flex-start"
        gap="1rem"
    >
        <label htmlFor={id}>{label}</label>
        {children}
    </FlexColumn>
)

interface MatchEditorProps extends React.HTMLAttributes<HTMLDivElement> {
    matchId: string
    matchData: Match
    onSave: (key: string, data: Match) => void
    startInEditMode?: boolean
}

const MatchEditor: React.FC<MatchEditorProps> = ({
    matchId,
    matchData,
    onSave,
    startInEditMode,
}) => {
    const [isEditing, setIsEditing] = useState<boolean>(!!startInEditMode)
    const [opponent, setOpponent] = useState<string>(matchData.opponent || '')
    const [date, setDate] = useState<Date>(
        matchData?.date ? new Date(matchData.date) : new Date()
    )

    return (
        <FlexRow align="flex-end" gap="1em">
            <InputWithLabel label="Opponent">
                <InputText
                    disabled={!isEditing}
                    placeholder="Opponent"
                    value={opponent}
                    onChange={(e) => setOpponent(e.currentTarget.value)}
                ></InputText>
            </InputWithLabel>

            <InputWithLabel label="Date & Time">
                <Calendar
                    disabled={!isEditing}
                    showTime
                    hourFormat="12"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value ?? new Date())}
                ></Calendar>
            </InputWithLabel>

            {isEditing ? (
                <Button
                    onClick={() => {
                        onSave(matchId, {
                            opponent,
                            date: date.toISOString(),
                        })
                        setIsEditing(false)
                    }}
                >
                    Save
                </Button>
            ) : (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}

            {isEditing ? <Button>Cancel</Button> : <Button>Delete</Button>}
        </FlexRow>
    )
}

export const ScheduleEditor: React.FC = () => {
    // @ts-expect-error useReplicant bug fixed in next version
    const [scheduleRep, setScheduleRep] = useReplicant<Schedule>('schedule')
    const [matchElements, setMatchElements] = useState<JSX.Element[]>([])

    const onSave = useCallback(
        (key: string, data: Match) => {
            const newRep = Array.from(scheduleRep ?? [])
            const index = Number.parseInt(key)

            if (index >= newRep.length) {
                newRep.push(data)
            } else {
                newRep[index] = data
            }

            setScheduleRep(newRep)
        },
        [scheduleRep, setScheduleRep]
    )

    useEffect(() => {
        if (!scheduleRep) {
            return
        }

        setMatchElements(
            scheduleRep.map((match, i) => {
                return (
                    <MatchEditor
                        matchId={i.toString()}
                        matchData={match}
                        key={i}
                        onSave={onSave}
                    ></MatchEditor>
                )
            })
        )
    }, [scheduleRep])

    return (
        <FlexColumn align="flex-start" gap="1em">
            {matchElements}
            <Button
                text
                onClick={() => {
                    const newMatches = [...matchElements]
                    newMatches.push(
                        <MatchEditor
                            matchId={matchElements.length.toString()}
                            matchData={{} as Match}
                            key={matchElements.length}
                            startInEditMode
                            onSave={onSave}
                        ></MatchEditor>
                    )
                    setMatchElements(newMatches)
                }}
            >
                Add match
            </Button>
        </FlexColumn>
    )
}
