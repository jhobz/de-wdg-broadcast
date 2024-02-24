import React from 'react'
import NodeCG from '@nodecg/types'
import { useReplicant } from 'use-nodecg'

type IndexProps = {
	videoUrl: string
}

export function Index() {
	const [bgUrl] = useReplicant<NodeCG.AssetFile[]>('assets:pg-teamlineupstats', [])
	const ref = React.createRef<HTMLVideoElement>()
	console.log(bgUrl[0]?.url)

	React.useEffect(() => {
		if (!ref.current) {
			return
		}

		console.log('loaded')
		ref.current.load()
	}, [bgUrl])
	return (
		<IndexElement
			ref={ref}
			videoUrl={bgUrl[0]?.url}
		/>
	)
}

const IndexElement = React.forwardRef<HTMLVideoElement, IndexProps>((props, ref) => {
	const videoRef = React.createRef<HTMLVideoElement>()
	return (
		<>
			<p>
				Video URL is currently: {props.videoUrl}
			</p>
			<p>
				Hello, I'm one of the graphics in your bundle! I'm where you put the graphics you want to run in your
				broadcast software!
			</p>

			<p>
				To edit me, open "<span className="monospace">src/graphics/Index.tsx</span>" in your favorite text
				editor or IDE.
			</p>

			<p>You can use any libraries, frameworks, and tools you want. There are no limits.</p>

			<p>
				Visit{' '}
				<a href="https://nodecg.dev" target="_blank" rel="noopener">
					https://nodecg.dev
				</a>{' '}
				for full documentation.
			</p>

			<p>Have fun!</p>

			<video ref={ref} controls autoPlay>
				<source src={props.videoUrl} type="video/mp4" />
			</video>
		</>
	)
})
