import test from 'node:test';
import assert from 'node:assert/strict';
import { puzzleProgressFeedback } from './puzzleFeedback';
import { createPuzzle, emptyPuzzleState, joinPuzzle, finishPuzzle, drawPuzzle, type PuzzlePiece } from './puzzleTeam';

const now=Date.parse('2026-10-30T01:00:00+08:00');
const city={id:'tokyo',name:"Tokyo",image:'/tokyo.jpg'};
function paired() {
  return joinPuzzle(createPuzzle(emptyPuzzleState(),city,'team',now),'team',{id:'friend',name:"Kobayashi.",joinedAt:now});
}
function piece(index:number,memberId='self'):PuzzlePiece {
  return {id:'finish-'+index,memberId,slot:index,route:{...city,routeId:'route-'+index,routeIndex:index+1,title:"Route"+index,distanceKm:3,minutes:20},startedAt:now,finishedAt:now,distanceKm:3};
}

test('feedback follows credited routes through self 2 + partner 1 and ignores retries and draws',()=>{
  let state=paired(),previous=state.teams[0];
  assert.equal(puzzleProgressFeedback(undefined,previous),undefined,'restoring a team must not announce old completions');
  assert.equal(puzzleProgressFeedback(previous,previous),undefined);
  state=finishPuzzle(state,'team',piece(0),now);
  assert.equal(puzzleProgressFeedback(previous,state.teams[0]),'Route complete! Team progress: 1/3.');
  previous=state.teams[0];
  const retry=finishPuzzle(state,'team',piece(0),now);
  assert.equal(puzzleProgressFeedback(previous,retry.teams[0]),undefined);
  state=finishPuzzle(state,'team',piece(1),now);
  assert.equal(puzzleProgressFeedback(previous,state.teams[0]),'You completed two routes. Your teammate can finish the final leg.');
  previous=state.teams[0];
  const blocked=finishPuzzle(state,'team',piece(2),now);
  assert.equal(puzzleProgressFeedback(previous,blocked.teams[0]),undefined,'rejected third self route must not announce success');
  state=finishPuzzle(state,'team',piece(2,'friend'),now);
  assert.equal(puzzleProgressFeedback(previous,state.teams[0]),'Team challenge complete! The prize wheel is unlocked with 2 draws.');
  previous=state.teams[0];
  state=drawPuzzle(state,'team','self','draw-1',now,0.5);
  assert.equal(puzzleProgressFeedback(previous,state.teams[0]),undefined,'drawing must not repeat task completion feedback');
});

test('partner feedback names the member and final feedback uses the one-route participant allowance',()=>{
  let state=paired(),previous=state.teams[0];
  state=finishPuzzle(state,'team',piece(0,'friend'),now);
  assert.equal(puzzleProgressFeedback(previous,state.teams[0]),'Kobayashi. completed a route. Team progress: 1/3.');
  state=finishPuzzle(state,'team',piece(1,'friend'),now);
  previous=state.teams[0];
  state=finishPuzzle(state,'team',piece(2),now);
  assert.equal(puzzleProgressFeedback(previous,state.teams[0]),'Team challenge complete! The prize wheel is unlocked with 1 draw.');
  assert.equal(puzzleProgressFeedback({...previous,id:'different-team'},state.teams[0]),undefined);
});
