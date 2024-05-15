import React, { useEffect, useState } from 'react'
import 'primereact/resources/themes/md-dark-indigo/theme.css'
import 'primeicons/primeicons.css'
import { FlexColumn, FlexRow } from '../components/layout/Flexbox'
import { useReplicant } from '@nodecg/react-hooks'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'
import styled from 'styled-components'
import { Checkbox } from 'primereact/checkbox'

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1em;
`

const Todo = (props: { children: JSX.Element[] }) => (
    <FlexRow justify="flex-start" align="center" gap="0.5em">
        {props.children}
    </FlexRow>
)

const Editor: React.FC<{
    tasks: string[] | undefined
    onSave: (text: string[]) => void
    onCancel: () => void
}> = ({ tasks, onSave, onCancel }) => {
    const [text, setText] = useState<string | undefined>(tasks?.join('\n'))

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault()
                const target = e.target as typeof e.target & {
                    markdown: { value: string }
                }
                onSave(target.markdown.value.split('\n'))
            }}
        >
            <InputTextarea
                name="markdown"
                rows={10}
                value={text}
                onChange={(e) => {
                    setText(e.currentTarget.value)
                }}
            />
            <FlexRow gap="0.5em">
                <Button
                    type="submit"
                    style={{
                        justifyContent: 'center',
                    }}
                >
                    <i className="pi pi-check"></i>
                </Button>
                <Button
                    type="button"
                    onClick={() => {
                        onCancel()
                    }}
                    style={{
                        justifyContent: 'center',
                    }}
                >
                    <i className="pi pi-times"></i>
                </Button>
            </FlexRow>
        </Form>
    )
}

export const TasksPanel: React.FC = () => {
    const [checklistRep, setChecklistRep] = useReplicant<string[]>('checklist')
    const [showEditor, setShowEditor] = useState<boolean>(false)
    const [completedTasks, setCompletedTasks] = useState<string[]>([])

    useEffect(() => {
        if (checklistRep && !Array.isArray(checklistRep)) {
            setChecklistRep(['item 1', 'item 2'])
        }
    }, [checklistRep, setChecklistRep])

    const TaskViewer: React.FC<{ tasks: string[] | undefined }> = ({
        tasks,
    }) => {
        return (
            <FlexColumn align="flex-start" gap="1rem">
                <Button
                    style={{ justifyContent: 'center' }}
                    onClick={() => {
                        setShowEditor(true)
                    }}
                >
                    <i className="pi pi-pencil" />
                </Button>
                {tasks?.map((task, key) => {
                    return (
                        <Todo key={key}>
                            <Checkbox
                                inputId={key.toString()}
                                name="tasks"
                                value={task}
                                checked={completedTasks.some((t) => t === task)}
                                onChange={(e) => {
                                    if (e.checked) {
                                        setCompletedTasks([
                                            ...completedTasks,
                                            e.value,
                                        ])
                                    } else {
                                        setCompletedTasks(
                                            completedTasks.filter(
                                                (t) => t !== e.value
                                            )
                                        )
                                    }
                                }}
                            />
                            <label htmlFor={key.toString()}>{task}</label>
                        </Todo>
                    )
                })}
            </FlexColumn>
        )
    }

    return showEditor ? (
        <Editor
            tasks={checklistRep}
            onSave={(tasks) => {
                setChecklistRep(tasks)
                setShowEditor(false)
            }}
            onCancel={() => {
                setShowEditor(false)
            }}
        />
    ) : (
        <TaskViewer tasks={checklistRep} />
    )
}
