import type NodeCG from '@nodecg/types'

import OBSWebSocket, { EventSubscription } from 'obs-websocket-js'
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

/**
 * How to log to NodeCG console: 
 * nodecg.log.info("Hello, from your bundle's extension!")
 */

const GSHEET_TEAM_COMPARISON_ID = 0
const GSHEET_PLAYER_COMPARISON_ID = 282506544
const GSHEET_WDG_PLAYERS_ID = 2122230946
const GSHEET_TEAM_INFO_ID = 2074558796

let logger: NodeCG.Logger

// TODO: Move this stuff to the graphics and import it? Might require waiting until useReplicant branch is merged. See how ASM does it.
export type TeamInfo = {
	team: string
	primaryColor: null
	hexCode: string
}

type TeamStatsRowData = Partial<{
	TEAM: string
	WINS: string
	LOSSES: string
	'WIN%': string
	PTS: string
	'FG%': string
	'3P%': string
	'FT%': string
	OREB: string
	DREB: string
	REB: string
	AST: string
	TOV: string
	STL: string
	BLK: string
}>

export type PlayerStatsData = Partial<{
	AGE: string
	POS: string
	GAMES: string
	PTS: string
	'FG%': string
	'3P%': string
	'FT%': string
	OREB: string
	DREB: string
	REB: string
	AST: string
	TOV: string
	STL: string
	BLK: string
}>

export type StatsData = {
	teams: TeamStatsRowData[]
	players: PlayerStatsData[]
	comparison: PlayerStatsData[]
}

type GoogleConfig = {
	type: string
	project_id: string
	private_key_id: string
	private_key: string
	client_email: string
	client_id: string
	auth_uri: string
	token_uri: string
	auth_provider_x509_cert_url: string
	client_x509_cert_url: string
	universe_domain: string
}

const STATS_SHEET_ID = '1je1brcelW1SDgeuTFsS9ulsyiuNlfe5trZndqDd9kfQ'

module.exports = async function (nodecg: NodeCG.ServerAPI) {
	logger = nodecg.log

	const obs = new OBSWebSocket()
	const googleCreds = nodecg.bundleConfig.google as GoogleConfig

	const obsStatusRep = nodecg.Replicant<boolean>('obsStatus')
	const googleStatusRep = nodecg.Replicant<boolean>('googleStatus')
	const statsRep = nodecg.Replicant<StatsData>('stats')
	const teamsRep = nodecg.Replicant<TeamInfo[]>('teams')
	const opponentRep = nodecg.Replicant<string>('opponent')

	try {
		const { obsWebSocketVersion, negotiatedRpcVersion } = await connectToObs(obs)
		obsStatusRep.value = true
		logger.info(`Connected to OBS via ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
	} catch (e: unknown) {
		obsStatusRep.value = false
		logger.error('Failed to connect to OBS', e)
	}

	const mainDoc = setupGoogle(googleCreds)
	googleStatusRep.value = false

	loadStatsFromGoogle(mainDoc).then((stats) => {
		statsRep.value = stats
		nodecg.log.info('Successfully loaded stats from Google Spreadsheet')
	})

	loadTeamsFromGoogle(mainDoc).then((teams) => {
		googleStatusRep.value = true
		teamsRep.value = teams
		nodecg.log.info('Successfully loaded team info from Google Spreadsheet')
	})

	if (!opponentRep.value) {
		if (statsRep.value && statsRep.value.teams.length >= 2) {
			opponentRep.value = statsRep.value.teams[1].TEAM
		}
	}

	nodecg.listenFor('loadStats', () => {
		nodecg.log.info('Refreshing data from Google Spreadsheet')
		googleStatusRep.value = false

		loadStatsFromGoogle(mainDoc).then((newStats) => {
			googleStatusRep.value = true
			statsRep.value = newStats
		})
	})

	opponentRep.on('change', async (newOpponent) => {
		const validTeams = teamsRep.value?.map((teamInfo) => {
			return teamInfo.team
		})

		if (!validTeams || !validTeams.length) {
			logger.error('Could not determine list of valid teams when trying to write to Google Sheet.')
			return
		}

		if (!newOpponent || !validTeams.includes(newOpponent)) {
			logger.error('Tried to send invalid team to Google Sheet!')
			return
		}

		statsRep.value = await setTeamComparisonInGoogle(mainDoc, newOpponent)
	})
}

function connectToObs(obs: OBSWebSocket) {
	return obs.connect('ws://192.168.1.222:4455', 'passwordThatShouldBeInAKeyFile', {
		rpcVersion: 1
	})
}

function setupGoogle(creds: GoogleConfig) {
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

	if (teamRows && teamRows.length >= 2) {
		stats.teams.push(teamRows[0].toObject())
		if (teamRows[1]) {
			stats.teams.push(teamRows[1].toObject())
		}
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

	return teams
}

async function setTeamComparisonInGoogle(doc: GoogleSpreadsheet, newTeam: string) {
	await doc.loadInfo()
	const teamSheet = doc.sheetsById[GSHEET_TEAM_COMPARISON_ID]
	await teamSheet.loadCells('A2:B3')
	const opponentCell = teamSheet.getCellByA1('A3')

	opponentCell.value = newTeam
	await teamSheet.saveUpdatedCells()

	return await loadStatsFromGoogle(doc)
}
