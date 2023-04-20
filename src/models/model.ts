export interface Team {
    name: string,
    isAvailable: boolean
}
export interface TeamScore {
    team: string,
    score: number
}
export interface Match {
    matchId: any,
    teamA: TeamScore,
    teamB: TeamScore,
    totalScore: number,
    startedAt: number,
    updatedAt: number
}