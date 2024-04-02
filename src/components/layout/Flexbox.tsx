import styled from 'styled-components'

export const FlexColumn = styled.div<{ justify?: string, align?: string, gap?: string }>`
	display: flex;
	flex-direction: column;
    justify-content: ${(props) => props.justify ? props.justify : 'initial'};
    align-items: ${(props) => props.align ? props.align : 'initial'};
    gap: ${(props) => props.gap ? props.gap : 'initial'};
`

export const FlexRow = styled.div<{ justify?: string, align?: string, gap?: string }>`
	display: flex;
	flex-direction: row;
    justify-content: ${(props) => props.justify ? props.justify : 'initial'};
    align-items: ${(props) => props.align ? props.align : 'initial'};
    gap: ${(props) => props.gap ? props.gap : 'initial'};
`