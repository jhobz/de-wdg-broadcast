import type NodeCG from '@nodecg/types'

import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import creds  from './../../.config/wizards-district-gaming-13fa1a1ef6e2.json'

/**
 * How to log to NodeCG console: 
 * nodecg.log.info("Hello, from your bundle's extension!")
 */

const GSHEET_TEAM_COMPARISON_ID = 0
const GSHEET_PLAYER_COMPARISON_ID = 282506544
const GSHEET_WDG_PLAYERS_ID = 2122230946
const GSHEET_TEAM_INFO_ID = 2074558796

// TODO: Move this stuff to the graphics and import it? Might require waiting until useReplicant branch is merged. See how ASM does it.
export type TeamInfo = {
	team: string
	primaryColor: null
	hexCode: string
}

type TeamStatsRowData = {
	TEAM?: string
	WINS?: string
	LOSSES?: string
	'WIN%'?: string
	PTS?: string
	'FG%'?: string
	'3P%'?: string
	'FT%'?: string
	OREB?: string
	DREB?: string
	REB?: string
	AST?: string
	TOV?: string
	STL?: string
	BLK?: string
}

export type PlayerStatsData = {
	AGE?: string
	POS?: string
	GAMES?: string
	PTS?: string
	'FG%'?: string
	'3P%'?: string
	'FT%'?: string
	OREB?: string
	DREB?: string
	REB?: string
	AST?: string
	TOV?: string
	STL?: string
	BLK?: string
}

type StatsData = {
	teams: TeamStatsRowData[]
	players: PlayerStatsData[]
	comparison: PlayerStatsData[]
}

const STATS_SHEET_ID = '1je1brcelW1SDgeuTFsS9ulsyiuNlfe5trZndqDd9kfQ'

module.exports = function (nodecg: NodeCG.ServerAPI) {
	const statsReplicant = nodecg.Replicant('stats')
	const teamsReplicant = nodecg.Replicant('teams')

	const mainDoc = setupGoogle()
	loadStatsFromGoogle(mainDoc).then((stats) => {
		statsReplicant.value = stats
	})

	loadTeamsFromGoogle(mainDoc).then((teams) => {
		teamsReplicant.value = teams
	})

	nodecg.listenFor('loadStats', () => {
		nodecg.log.info('loadStats')
		loadStatsFromGoogle(mainDoc).then((newStats) => {
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
	const stats = { teams: [], players: [], comparison: [] } as StatsData

	await doc.loadInfo()
	const teamSheet = doc.sheetsById[GSHEET_TEAM_COMPARISON_ID]
	const teamRows = await teamSheet.getRows<TeamStatsRowData>()
	stats.teams.push(teamRows[0].toObject())
	if (teamRows[1]) {
		stats.teams.push(teamRows[1].toObject())
	}

	const playerSheet = doc.sheetsById[GSHEET_WDG_PLAYERS_ID]
	const playerRows = await playerSheet.getRows<PlayerStatsData>()
	for (let i = 0; i < 5; i++) {
		stats.players.push(playerRows[i].toObject())
	}

	const comparisonSheet = doc.sheetsById[GSHEET_PLAYER_COMPARISON_ID]
	const comparisonRows = await comparisonSheet.getRows<PlayerStatsData>()
	for (let i = 0; i < 2; i++) {
		stats.comparison.push(comparisonRows[i].toObject())
	}

	return stats
}

async function loadTeamsFromGoogle(doc: GoogleSpreadsheet) {
	await doc.loadInfo()
	const teamInfoSheet = doc.sheetsById[GSHEET_TEAM_INFO_ID]
	const teams = (await teamInfoSheet.getRows<TeamInfo>()).map((row: GoogleSpreadsheetRow) => {
		const item = row.toObject()
		return {
			team: item.Team,
			primaryColor: item['Primary Color'],
			hexCode: item['Hex Code']
		}
	})
	console.log(teams)

	return teams
}
