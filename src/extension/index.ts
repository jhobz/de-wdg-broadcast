import type NodeCG from '@nodecg/types'

import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import creds  from './../../.config/wizards-district-gaming-13fa1a1ef6e2.json'

/**
 * How to log to NodeCG console: 
 * nodecg.log.info("Hello, from your bundle's extension!")
 */

// TODO: Move this stuff to the graphics and import it? Might require waiting until useReplicant branch is merged. See how ASM does it.
type TeamStatsRowData = {
	TEAM: string
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

export type PlayerStatsData = {
	AGE: number
	POS: number
	GAMES: number
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

type StatsData = {
	teams: TeamStatsRowData[]
	players: PlayerStatsData[]
}

const STATS_SHEET_ID = '1je1brcelW1SDgeuTFsS9ulsyiuNlfe5trZndqDd9kfQ'

module.exports = function (nodecg: NodeCG.ServerAPI) {
	const statsReplicant = nodecg.Replicant('stats')

	const statsDoc = setupGoogle()
	loadStatsFromGoogle(statsDoc).then((stats) => {
		statsReplicant.value = stats
	})

	nodecg.listenFor('loadStats', () => {
		nodecg.log.info('loadStats')
		loadStatsFromGoogle(statsDoc).then((newStats) => {
			statsReplicant.value = newStats
		})
	})
}

function setupGoogle() {
	const serviceAccountAuth = new JWT({
		// email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		// key: process.env.GOOGLE_PRIVATE_KEY,
		email: creds.client_email,
		key: creds.private_key,
		scopes: [
			'https://www.googleapis.com/auth/spreadsheets',
		],
	})

	return new GoogleSpreadsheet(STATS_SHEET_ID, serviceAccountAuth)
}

async function loadStatsFromGoogle(doc: GoogleSpreadsheet) {
	await doc.loadInfo()
	const teamSheet = doc.sheetsByIndex[0]
	const teamRows = await teamSheet.getRows<TeamStatsRowData>()
	const stats = { teams: [], players: [] } as StatsData
	stats.teams.push(teamRows[0].toObject() as TeamStatsRowData)
	if (teamRows[1]) {
		stats.teams.push(teamRows[1].toObject() as TeamStatsRowData)
	}

	for (let i = 1; i < 6; i++) {
		const playerSheet = doc.sheetsByIndex[i]
		const playerRows = await playerSheet.getRows<PlayerStatsData>()
		stats.players.push(playerRows[0].toObject() as PlayerStatsData)
	}

	return stats
}
