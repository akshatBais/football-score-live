import React from 'react';
import '../App.css';
import { v4 as uuidv4 } from 'uuid';
import {Match} from '../models/model';

function ScoreBoard() {
    
    const [inProgressMatches, setInProgress] = React.useState<Match[]>([]);
    const [scoreboard, setScoreboard] = React.useState<Match[]>([]);
    const [teams, setTeams] = React.useState([
        {
            name : 'Mexico',
            isAvailable: true,
        },
        {
            name: 'Canada',
            isAvailable: true
        },
        {
            name: 'Spain',
            isAvailable: true
        },
        {
            name: 'Brazil',
            isAvailable: true
        },
        {
            name: 'Germany',
            isAvailable: true
        },
        {
            name: 'France',
            isAvailable: true
        },
        {
            name: 'Italy',
            isAvailable: true
        },
        {
            name: 'Argentina',
            isAvailable: true
        },
        {
            name: 'Australia',
            isAvailable: true
        },
        {
            name: 'Uruguay',
            isAvailable: true
        }]);
    const [selectedTeams, setSelectedTeams] = React.useState<string[]>([]);
    let updatedMatches: Match[];

    const handleTeamSelect = (event: any) => {
        let updatedList = [...selectedTeams];
        let allTeams = [...teams];
        setTeams(allTeams);
        if (event.target.checked) {
            if (selectedTeams.length < 2) {
                allTeams = allTeams.map(team => {
                    if (team.name === event.target.value) {
                        team.isAvailable = !team.isAvailable;
                    }
                    return team;
                })
                updatedList = [...selectedTeams, event.target.value];
            } else {
                event.target.checked = false;
                alert('Only two teams can be selected at a time to start a match')
            }
        } else {
            allTeams = allTeams.map(team => {
                if (team.name === event.target.value) {
                    team.isAvailable = !team.isAvailable;
                }
                return team;
            })
            updatedList.splice(selectedTeams.indexOf(event.target.value), 1);
        }
        setSelectedTeams(updatedList);
    }

    /**
     * Following method is resposible for startign a match 
     * between two teams
     */
    const startMatch = () => {  
        if (selectedTeams.length == 2) {
            const match : Match = {
                matchId: uuidv4(),
                teamA : {
                    team: selectedTeams[0],
                    score: 0
                },
                teamB : {
                    team: selectedTeams[1],
                    score: 0
                },
                totalScore: 0,
                startedAt: new Date().getTime(),
                updatedAt: new Date().getTime()
            }
            setInProgress([...inProgressMatches, {...match}]);
            setScoreboard([...scoreboard, JSON.parse(JSON.stringify(match))]);
            setSelectedTeams([]);
        } else {
            alert('Please select two teams to start a match');
        }
    }

    /**
     * Following method is responsibge for finishing the match
     * after the match is finished, the teams are available again for a new match
     * @param event 
     */
    const gameOver = (event: any) => {
        
        const matches = [...inProgressMatches];
        const scoreboardMatches = [...scoreboard];
        const matchId = event.target.value;

        const inProgressMatchIndex = inProgressMatches.findIndex(m => m.matchId === matchId);
        const scoreboardMatchIndex = scoreboard.findIndex(m => m.matchId === matchId);
        const match = scoreboard.find(m => m.matchId === matchId);
        matches.splice(inProgressMatchIndex, 1);
        scoreboardMatches.splice(scoreboardMatchIndex, 1);

        setInProgress(matches);
        setScoreboard(scoreboardMatches);

        let allTeams = [...teams];
        if (match) {
            allTeams = allTeams.map(team => {
                if (team.name === match['teamA'].team || team.name === match['teamB'].team) {
                    team.isAvailable = true;
                }
                return team;
            })
        }
        setTeams(allTeams);
    }

    /**
     * This updates the real time score and saves it temporarily in updatedMatches
     * and updat
     * @param event 
     */
    const handleScoreChange = (event: any) => {
        const team: string = event.target.id.split('::')[0];
        const matchId = event.target.id.split('::')[1];
        const inProgMatchIdx = inProgressMatches.findIndex(inProgMatch => inProgMatch.matchId === matchId);
        const match: Match = inProgressMatches.find(inProgMatch => inProgMatch.matchId === matchId)!;
        if (match) {
            match[team as keyof Match].score = event.target.value ? event.target.value : 0;
            match['totalScore'] = match['teamA'].score + match['teamB'].score;
            updatedMatches = [...inProgressMatches];
            updatedMatches[inProgMatchIdx] = match;
        }
        setInProgress(updatedMatches);
    }   

    /**
     * On click of update button , the match of those teams are updated as saved in updatedMatches
     * @param event 
     */
    const updateMatchScore = (event: any) => {
        updatedMatches = [...inProgressMatches];
        if (updatedMatches) {
            const updatedMatch: Match = updatedMatches.find(m => m.matchId === event.target.value)!;
            updatedMatch.updatedAt = new Date().getTime();
            let updatedScoreboard = [...scoreboard];
            updatedScoreboard = updatedScoreboard.map((m:Match)  => {
                if (m.matchId === updatedMatch.matchId) {
                    m = updatedMatch;
                }
                return m;
            });
            updatedScoreboard = sortMatchesByScoreAndDate(updatedScoreboard);
            setScoreboard(updatedScoreboard);
        }
    }

    /**
     * This method is responsible for sorting the matches as per the total score and 
     * matches that have same total score are tehn sorted as per the start date
     * @param scoreboardMatches 
     * @returns 
     */
    const sortMatchesByScoreAndDate = (scoreboardMatches: Match[]) => {
        const sortedArr: Match[] = [];
        // Step 1 : sort by score
        const sameScoreMatches = new Map<number, Match[]>();
        scoreboardMatches.sort((a: Match,b: Match) => {
            return b.totalScore - a.totalScore;
        });
        // Step 2 : same score matches should be sorted by date ( most recently started )
        scoreboardMatches.forEach(m => {
            if (sameScoreMatches.has(m.totalScore)) {
                const setData :Match[] = sameScoreMatches.get(m.totalScore)!;
                sameScoreMatches.set(m.totalScore, [...setData,m]);
            } else if (!sameScoreMatches.has(m.totalScore)) {
                sameScoreMatches.set(m.totalScore, [m])
            } else if (sameScoreMatches.has(m.totalScore)) {
                const setData :Match[] = sameScoreMatches.get(m.totalScore)!;
                sameScoreMatches.set(m.totalScore, [...setData, m]);
            } else if (!sameScoreMatches.has(m.totalScore)) {
                sameScoreMatches.set(m.totalScore, [m]);
            }
        });

        sameScoreMatches.forEach((val: any, key, map: any) => {
            val.sort((a: Match,b: Match) => {
                return b.startedAt - a.startedAt;
            });
            map[key] = val;
        });

        sameScoreMatches.forEach((val: any, key) => {
            sortedArr.push(...val);
        });

        return sortedArr;
    }

    return (
        <div>
            <div className='container'>
                <div className='start-match-container'>
                    {/* //Code to add the game */}
                    <div className='label'><h3>Start Match</h3></div>
                    <div className='teams'>
                        {teams.map((team, index) => (
                            <div key={index}>
                                <input value={team.name}
                                checked={!team.isAvailable}
                                disabled={inProgressMatches.filter(m => m.teamA.team === team.name || m['teamB'].team === team.name).length > 0} type="checkbox" 
                                onChange={handleTeamSelect} />
                                <span>{team.name}</span>
                            </div>
                        ))}
                    </div>
                    <button className='start-match-btn' onClick={startMatch} >Start Match</button>
                    
                </div>
                <div className='update-match-container'>
                    <div className='label'><h3>Update Match</h3></div>
                    <div className='teams'>
                        {inProgressMatches.map((match, index) => (
                            <div className='update-score-container'>    
                                <div className='update-score-field'>
                                    {match.teamA.team}
                                </div> 
                                <div><input style={{marginRight: '10px'}} id={`teamA::${match.matchId}`} onChange={handleScoreChange} type='number' /></div>
                                <div style={{marginRight: '10px'}}>-</div>
                                <div className='update-score-field'> {match.teamB.team} </div> 
                                <div><input style={{marginRight: '10px'}} id={`teamB::${match.matchId}`} onChange={handleScoreChange} type='number' /></div>
                                <button className='update-btn' value={match.matchId} onClick={updateMatchScore}>Update Score</button>
                                <button className='game-over-btn' value={match.matchId} onClick={gameOver}>Game Over</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='scoreboard-container'>
                <div className='label'><h3>Scoreboard</h3></div>
                <div className='team-scores-container'>
                    {scoreboard.map((match, index) => (
                        <div className='team-scores'>
                            {match['teamA'].team} {match['teamA'].score} -  {match['teamB'].team} {match['teamB'].score} 
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ScoreBoard;
