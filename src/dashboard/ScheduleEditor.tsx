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
    matchData?: Match
    onSave: (key: string, data: Match | null) => void
    onDelete: () => void
    startInEditMode?: boolean
}

const MatchEditor: React.FC<MatchEditorProps> = ({
    matchId,
    matchData,
    onSave,
    onDelete,
    startInEditMode,
}) => {
    const [isEditing, setIsEditing] = useState<boolean>(!!startInEditMode)
    const [opponent, setOpponent] = useState<string>(matchData?.opponent || '')
    const [date, setDate] = useState<Date>(
        matchData?.date ? new Date(matchData.date) : new Date()
    )
    const [stateSnapshot, setStateSnapshot] = useState<{
        opponent: string
        date: Date
    }>()

    // Set initial snapshot if component was created with data
    useEffect(() => {
        if (!matchData) {
            return
        }

        setStateSnapshot({
            opponent: matchData.opponent,
            date: new Date(matchData.date),
        })
    }, [matchData])

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

            {isEditing ? (
                <Button
                    onClick={() => {
                        // Newly created item that was canceled -- unmount component entirely
                        if (!stateSnapshot) {
                            onDelete()
                            return
                        }

                        setOpponent(stateSnapshot.opponent)
                        setDate(stateSnapshot.date)
                        setIsEditing(false)
                    }}
                >
                    Cancel
                </Button>
            ) : (
                <Button onClick={() => onDelete()}>Delete</Button>
            )}
        </FlexRow>
    )
}

interface HideableMatchEditorProps extends Partial<MatchEditorProps> {
    matchId: string
    onSave: (key: string, data: Match | null) => void
}

const HideableMatchEditor: React.FC<HideableMatchEditorProps> = ({
    matchId,
    onSave,
    ...props
}) => {
    const [isShowing, setIsShowing] = useState<boolean>(true)

    return isShowing ? (
        <MatchEditor
            matchId={matchId}
            onSave={onSave}
            onDelete={() => {
                if (props.matchData) {
                    onSave(matchId, null)
                }
                setIsShowing(false)
            }}
            {...props}
        />
    ) : (
        <></>
    )
}

export const ScheduleEditor: React.FC = () => {
    // @ts-expect-error useReplicant bug fixed in next version
    const [scheduleRep, setScheduleRep] = useReplicant<Schedule>('schedule')
    const [matchElements, setMatchElements] = useState<JSX.Element[]>([])

    const onSave = useCallback(
        (key: string, data: Match | null) => {
            const newRep = Array.from(scheduleRep ?? [])
            const index = Number.parseInt(key)

            if (!data) {
                newRep.splice(index, 1)
            } else if (index >= newRep.length) {
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
                    <HideableMatchEditor
                        key={i}
                        matchId={i.toString()}
                        matchData={match}
                        onSave={onSave}
                    />
                )
            })
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduleRep])

    return (
        <FlexColumn align="flex-start" gap="1em">
            {matchElements}
            <Button
                text
                onClick={() => {
                    const newMatches = [...matchElements]
                    newMatches.push(
                        <HideableMatchEditor
                            matchId={matchElements.length.toString()}
                            key={matchElements.length}
                            startInEditMode
                            onSave={onSave}
                        ></HideableMatchEditor>
                    )
                    setMatchElements(newMatches)
                }}
            >
                Add match
            </Button>
        </FlexColumn>
    )
}
