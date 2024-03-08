import React from 'react'
import { createRoot } from 'react-dom/client'
import NodeCG from '@nodecg/types'
import { useReplicant } from '@nodecg/react-hooks'

type IndexProps = {
	videoUrl: string
}

export function Index() {
	// @ts-expect-error there is a bug with ts arrays in @nodecg/react-hooks@1.0.1 that will be fixed in the next release
	const [bgUrl] = useReplicant<NodeCG.AssetFile[]>('assets:pg-teamlineupstats')
	const ref = React.createRef<HTMLVideoElement>()
	console.log(bgUrl ? bgUrl[0]?.url : 'nothing')

	React.useEffect(() => {
		if (!ref.current) {
			return
		}

		console.log('loaded')
		ref.current.load()
	}, [bgUrl, ref])
	return (
		<IndexElement
			ref={ref}
			videoUrl={bgUrl ? bgUrl[0]?.url : 'https://www.google.com'}
		/>
	)
}

const IndexElement = React.forwardRef<HTMLVideoElement, IndexProps>((props, ref) => {
	const videoRef = React.createRef<HTMLVideoElement>()
	console.log('videoref', videoRef)
	return (
		<>
			<p>
				Video URL is currently: {props.videoUrl}
			</p>

			<video ref={ref} autoPlay muted>
				<source src={props.videoUrl} type="video/mp4" />
			</video>
		</>
	)
})
IndexElement.displayName = 'IndexElement'

const root = createRoot(document.getElementById('root')!)
root.render(<Index />)