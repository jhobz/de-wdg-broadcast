import React from 'react'
import styled from 'styled-components'
import { Dropdown, DropdownProps } from 'primereact/dropdown'
import { FlexRow } from './layout/Flexbox'

const Option = styled(FlexRow)`
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    height: 30px;

    img {
        width: 30px;
        object-fit: contain;
    }

    label {
        flex-grow: 1;
    }
`

export type ImageSelectOption = {
    name: string
    img?: string
}

export default function ImageSelect(props: DropdownProps) {
    const optionTemplate = (option: ImageSelectOption) => {
        return (
            <Option className='ImageSelect'>
                <img src={option.img}/>
                <label>{option.name}</label>
            </Option>
        )
    }

    const valueTemplate = (option: ImageSelectOption, props: DropdownProps) => {
        if (option) {
            return optionTemplate(option)
        }

        return (<span>{ props.placeholder }</span>)
    }

	return (
        <Dropdown
            {...props}
            itemTemplate={optionTemplate}
            valueTemplate={valueTemplate}
        />
	)
}