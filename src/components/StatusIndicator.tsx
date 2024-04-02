import React from 'react'
import { FlexRow } from './layout/Flexbox'
import 'primeicons/primeicons.css'

const OK_COLOR = 'green'
const BAD_COLOR = 'red'
const OK_ICON = 'pi-circle-fill'
const BAD_ICON = 'pi-exclamation-circle'

type StatusIndicatorProps = {
    status: boolean
    okMessage: string
    badMessage: string
}

export default function StatusIndicator({ status, okMessage, badMessage }: StatusIndicatorProps) {
    const icon = `pi ${status ? OK_ICON : BAD_ICON}`

    return (
        <FlexRow className='StatusIndicator' align='center' gap='0.5rem'>
            <i className={icon} style={{color: status ? OK_COLOR : BAD_COLOR, fontSize: '1.4em'}}></i>
            <p>{status ? okMessage : badMessage}</p>
        </FlexRow>
    )
}
