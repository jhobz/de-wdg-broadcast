import type NodeCG from '@nodecg/types'
import type { ExampleReplicant } from '../types/schemas'

import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import creds  from './../../.config/wizards-district-gaming-13fa1a1ef6e2.json'

module.exports = function (nodecg: NodeCG.ServerAPI) {
	nodecg.log.info("Hello, from your bundle's extension!")

	const exampleReplicant = nodecg.Replicant('exampleReplicant') as unknown as NodeCG.ServerReplicantWithSchemaDefault<ExampleReplicant>
	setInterval(() => {
		exampleReplicant.value.age++
	}, 5000)

	loadStatsFromGoogle(nodecg)
}

type TeamStatsRowData = {
	WINS: number
	LOSSES: number
	'WIN%': number
	PTS: number
	'FG%': number
	'3P%': number
	'FT%': number
	OREB: number
	DREB: number
	REB: number
	AST: number
	TOV: number
	STL: number
	BLK: number
}

async function loadStatsFromGoogle(nodecg: NodeCG.ServerAPI) {
	const serviceAccountAuth = new JWT({
		// email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		// key: process.env.GOOGLE_PRIVATE_KEY,
		email: creds.client_email,
		key: creds.private_key,
		scopes: [
			'https://www.googleapis.com/auth/spreadsheets',
		],
	})

	const doc = new GoogleSpreadsheet('1je1brcelW1SDgeuTFsS9ulsyiuNlfe5trZndqDd9kfQ', serviceAccountAuth)

	await doc.loadInfo()
	const sheet = doc.sheetsByIndex[0]
	const rows = await sheet.getRows<TeamStatsRowData>()
	nodecg.log.info(rows[0].toObject())
	const stats = { teams: [], players: [] } as any
	stats.teams.push(rows[0].toObject())

	const statsRep = nodecg.Replicant('stats')
	statsRep.value = stats
	statsRep.on('change', (newValue) => {
		nodecg.log.info(statsRep.value)
	})
}
