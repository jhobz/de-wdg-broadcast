import React from 'react'
import { Dropdown } from 'primereact/dropdown'

export type Option = {
    name: string
    img?: string
}

type ImageSelectProps = {
    options: Option[] | undefined
}

export default function ImageSelect(props: ImageSelectProps) {
    const [selectedOption, setSelectedOption] = React.useState<Option | null>(null)

    const optionTemplate = (option: Option) => {
        return (
            <div className='ImageSelect'>
                <img src={option.img}/>
                <label>{option.name}</label>
            </div>
        )
    }

    // const options: Option[] = [
    //     { img: 'https://static.wikia.nocookie.net/fruits-information/images/2/2b/Apple.jpg', label: 'one', value: 0 },
    //     { img: 'https://assets.bonappetit.com/photos/57daf2c35a14a530086efae5/master/pass/green-apple-640.jpg', label: 'two', value: 1 },
    //     { img: 'https://static.libertyprim.com/files/varietes/pomme-golden-large.jpg?1569321839', label: 'three', value: 2 },
    // ]

	return (
        <Dropdown
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.value)}
            options={ props.options }
            optionLabel='name'
            optionValue='name'
            placeholder='Select opponent'
            itemTemplate={optionTemplate}
        />
	)
}