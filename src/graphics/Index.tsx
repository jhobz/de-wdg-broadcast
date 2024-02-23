import React from 'react'

export function Index() {
	const statsBg = nodecg.Replicant('assets:pg-teamlineupstats')
	let bgUrl = ''
	statsBg.on('change', (newValue: any, oldValue) => {
		console.log(newValue[0].url)
		bgUrl = newValue[0].url
	})
	return (
		<>
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

			<video key={bgUrl}>
				<source src={bgUrl} />
			</video>
		</>
	)
}
