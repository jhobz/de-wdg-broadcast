import type NodeCG from '@nodecg/types'

import OBSWebSocket from 'obs-websocket-js'
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import { ObsConnectionInfo } from '../types/schemas/index'

/**
 * How to log to NodeCG console:
 * nodecg.log.info("Hello, from your bundle's extension!")
 */

const GSHEET_TEAM_COMPARISON_ID = 0
const GSHEET_PLAYER_COMPARISON_ID = 282506544
const GSHEET_WDG_PLAYERS_ID = 2122230946
const GSHEET_TEAM_INFO_ID = 2074558796
const GSHEET_PLAYER_INFO_ID = 2076137367

let logger: NodeCG.Logger

// TODO: Move this stuff to the graphics and import it? Might require waiting until useReplicant branch is merged. See how ASM does it.
export type OBSInput = {
    inputKind: string
    inputName: string
    inputUuid: string
    unversionedInputKind: string
}

export type TeamInfo = {
    team: string
    primaryColor: null
    hexCode: string
}

export type PlayerInfo = {
    name: string
    team: string
    id?: string
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
    PLAYER: string
    FGM: string
    FGA: string
    id: string
    team: string
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
    // Variable definitions

    logger = nodecg.log

    const obs = new OBSWebSocket()
    const googleCreds = nodecg.bundleConfig.google as GoogleConfig

    const obsStatusRep = nodecg.Replicant<boolean>('obsStatus')
    const obsConnectionInfoRep =
        nodecg.Replicant<ObsConnectionInfo>('obsConnectionInfo')
    const obsVideoSourcesRep = nodecg.Replicant<OBSInput[]>('obsVideoSources')
    const obsMatchupGraphicIdRep = nodecg.Replicant<string>(
        'obsMatchupGraphicId'
    )
    const googleStatusRep = nodecg.Replicant<boolean>('googleStatus')
    const statsRep = nodecg.Replicant<StatsData>('stats')
    const teamsRep = nodecg.Replicant<TeamInfo[]>('teams')
    const playersRep = nodecg.Replicant<PlayerInfo[]>('players')
    const opponentRep = nodecg.Replicant<string>('opponent')

    // OBS stuff

    const reconnectToObs = () => {
        if (!obsConnectionInfoRep.value) {
            logger.warn(
                'Skipping OBS reconnect attempt: obsConnectionInfoRep is null or undefined'
            )
            setTimeout(reconnectToObs, 5000)
            return
        }

        connectToObs(obsConnectionInfoRep.value)
    }

    obs.on('ConnectionClosed', (error) => {
        // If we already know (reconnection attempts) then don't double-log
        if (obsStatusRep.value === false) {
            return
        }

        obsStatusRep.value = false
        logger.warn(
            'Disconnected from OBS. If unexpected, check for error below.'
        )

        // We don't want to attempt to reconnect if this was an intentional disconnect
        if (!error || !error.message) {
            return
        }

        logger.error(error.message)
        if (obsConnectionInfoRep.value?.reconnect) {
            setTimeout(reconnectToObs, 5000)
        }
    })

    obsStatusRep.value = false
    const connectToObs = async ({ address, password }: ObsConnectionInfo) => {
        try {
            const { obsWebSocketVersion, negotiatedRpcVersion } =
                await obs.connect(address, password, {
                    rpcVersion: 1,
                })

            obsStatusRep.value = true
            logger.info(
                `Connected to OBS WebSocket v${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion}).`
            )

            // Refresh list of media sources for Matchup Graphic assignment panel
            const response = await obs.call('GetInputList')
            const videoInputs = response.inputs.filter((input) => {
                return input.inputKind === 'ffmpeg_source'
            })
            obsVideoSourcesRep.value = videoInputs as OBSInput[]
        } catch (e) {
            obsStatusRep.value = false
            logger.error('Failed to connect to OBS.')
            logger.error((e as Error).message)

            if (obsConnectionInfoRep.value?.reconnect) {
                setTimeout(reconnectToObs, 5000)
            }
        }
    }

    const disconnectFromObs = async () => {
        await obs.disconnect()
        obsStatusRep.value = false
    }

    const debugObsTasks = async () => {
        // const response = await obs.call('GetSceneItemList', { sceneName: 'Matchup Graphic (VO)'})
        // const si = response.scenes[0]
        // const source = await obs.call('GetInputSettings', { inputName: si.sourceName as string})
        // logger.info('source', source)
    }

    if (obsConnectionInfoRep.value) {
        connectToObs(obsConnectionInfoRep.value)
    }

    // Google stuff

    const mainDoc = setupGoogle(googleCreds)
    googleStatusRep.value = false

    loadStatsFromGoogle(mainDoc).then((stats) => {
        statsRep.value = stats
        logger.info('Successfully loaded stats from Google Spreadsheet.')
    })

    loadTeamsFromGoogle(mainDoc).then((teams) => {
        teamsRep.value = teams
        logger.info('Successfully loaded team info from Google Spreadsheet.')
    })

    try {
        const players = await loadPlayersFromGoogle(mainDoc)
        googleStatusRep.value = true
        playersRep.value = players
        logger.info('Successfully loaded player info from Google Spreadsheet.')
    } catch (e) {
        logger.error('Failed to get player info from Google Spreadsheet!', e)
    }

    if (!opponentRep.value) {
        if (statsRep.value && statsRep.value.teams.length >= 2) {
            opponentRep.value = statsRep.value.teams[1].TEAM
        }
    }

    // ========== NODECG LISTENERS ==========

    // ---------- MESSAGES ----------
    nodecg.listenFor('loadStats', () => {
        logger.info('Refreshing data from Google Spreadsheet.')
        googleStatusRep.value = false

        loadStatsFromGoogle(mainDoc).then((newStats) => {
            googleStatusRep.value = true
            statsRep.value = newStats
        })
    })

    nodecg.listenFor('changePlayerComparison', async ({ player, team }) => {
        const validPlayers = playersRep.value?.map((playerInfo) => {
            return playerInfo.name
        })

        if (!validPlayers || !validPlayers.length) {
            logger.error(
                'Could not determine list of valid teams when trying to write to Google Sheet.'
            )
            return
        }

        if (!player || !validPlayers.includes(player)) {
            logger.error('Tried to send invalid team to Google Sheet!')
            return
        }

        googleStatusRep.value = false

        try {
            logger.info('Changing player comparison in Google Spreadsheet.')

            statsRep.value = await setPlayerComparisonInGoogle(
                mainDoc,
                player,
                team === 'Wizards District Gaming'
            )
            googleStatusRep.value = true
        } catch (e) {
            logger.error('Unknown error trying to change player comparison.', e)
        }
    })

    // *** OBS ***
    nodecg.listenFor('obs:connect', () => {
        if (obsConnectionInfoRep.value) {
            connectToObs(obsConnectionInfoRep.value)
        }
    })

    nodecg.listenFor('obs:disconnect', () => {
        disconnectFromObs()
    })

    nodecg.listenFor('obs:debugTasks', () => {
        debugObsTasks()
    })

    // ---------- CHANGE EVENTS ----------
    opponentRep.on('change', async (newOpponent) => {
        const validTeams = teamsRep.value?.map((teamInfo) => {
            return teamInfo.team
        })

        if (!validTeams || !validTeams.length) {
            logger.error(
                'Could not determine list of valid teams when trying to write to Google Sheet.'
            )
            return
        }

        if (!newOpponent || !validTeams.includes(newOpponent)) {
            logger.error('Tried to send invalid team to Google Sheet!')
            return
        }

        statsRep.value = await setTeamComparisonInGoogle(mainDoc, newOpponent)

        if (!obsMatchupGraphicIdRep.value) {
            logger.warn(
                'Matchup Graphic source not set in Remote Connections workspace. Skipping changing Matchup Graphic file.'
            )
            return
        }

        if (!obsStatusRep.value) {
            logger.warn(
                'Not connected to OBS. Skipping changing Matchup Graphic file.'
            )
            return
        }

        const source = await obs.call('GetInputSettings', {
            inputUuid: obsMatchupGraphicIdRep.value,
        })
        let baseURI = source.inputSettings.local_file as string
        if (baseURI?.length) {
            baseURI = baseURI.split('/').slice(0, -1).join('/')
        }
        const settings = {
            local_file: `${baseURI}/WDG_VS_${newOpponent.replaceAll(' ', '_')}.mp4`,
        }
        await obs.call('SetInputSettings', {
            inputUuid: obsMatchupGraphicIdRep.value,
            inputSettings: settings,
        })
    })
}

function setupGoogle(creds: GoogleConfig) {
    const serviceAccountAuth = new JWT({
        // email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        // key: process.env.GOOGLE_PRIVATE_KEY,
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
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
    const teams = (await teamInfoSheet.getRows<TeamInfo>()).map(
        (row: GoogleSpreadsheetRow) => {
            const item = row.toObject()
            return {
                team: item.Team,
                primaryColor: item['Primary Color'],
                hexCode: item['Hex Code'],
            }
        }
    )

    return teams
}

async function loadPlayersFromGoogle(doc: GoogleSpreadsheet) {
    await doc.loadInfo()
    const playerInfoSheet = doc.sheetsById[GSHEET_PLAYER_INFO_ID]
    const players = (await playerInfoSheet.getRows()).map(
        (row: GoogleSpreadsheetRow) => {
            const item = row.toObject()
            return {
                team: item.Team,
                name: item.Player,
                id: item.Person_id,
            }
        }
    )

    return players
}

async function setTeamComparisonInGoogle(
    doc: GoogleSpreadsheet,
    newTeam: string
) {
    await doc.loadInfo()
    const teamSheet = doc.sheetsById[GSHEET_TEAM_COMPARISON_ID]
    await teamSheet.loadCells('A2:B3')
    const opponentCell = teamSheet.getCellByA1('A3')

    opponentCell.value = newTeam
    await teamSheet.saveUpdatedCells()

    return await loadStatsFromGoogle(doc)
}

async function setPlayerComparisonInGoogle(
    doc: GoogleSpreadsheet,
    newPlayer: string,
    isWdg: boolean
) {
    if (!newPlayer) {
        logger.error(
            'Tried to set player comparison without a valid player! Ignoring request.'
        )
        return
    }

    await doc.loadInfo()
    const playerSheet = doc.sheetsById[GSHEET_PLAYER_COMPARISON_ID]
    await playerSheet.loadCells('A2:B3')
    const playerCell = playerSheet.getCellByA1(isWdg ? 'A2' : 'A3')

    playerCell.value = newPlayer
    await playerSheet.saveUpdatedCells()

    return await loadStatsFromGoogle(doc)
}
