import { useEffect, useRef, useState } from 'react';
import { drawsLeft, ownPieces, puzzleComplete, type PuzzleTeam, type RelayDraw } from '../journey/puzzleTeam';
import { WEEKEND_PRIZES } from '../journey/weekendRelay';
import styles from './WeekendRelayWheel.module.css';
export default function WeekendRelayWheel({team,onDraw,preview=false}:{team:PuzzleTeam;onDraw:(id:string)=>RelayDraw|undefined;preview?:boolean}) {
  const [rotation,setRotation]=useState(0),[spinning,setSpinning]=useState(false),[result,setResult]=useState<number|null>(null);
  const [error,setError]=useState('');
  const guard=useRef(false),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  useEffect(()=>{setRotation(0);setResult(null);setError('');setSpinning(false);guard.current=false;return()=>{if(timer.current)clearTimeout(timer.current);};},[team.id]);
  const unlocked=puzzleComplete(team),remaining=drawsLeft(team),history=team.draws.filter(d=>d.memberId==='self');
  const displayedResult=spinning?null:result??history[history.length-1]?.cents??null;
  const spin=()=>{
    if(guard.current||!remaining)return;
    guard.current=true;setError('');
    let draw:RelayDraw|undefined;
    try{draw=onDraw(team.id);}catch{guard.current=false;setError('The draw is temporarily unavailable. Please try again.');return;}
    if(!draw){guard.current=false;setError('The draw is temporarily unavailable. Please try again.');return;}
    setSpinning(true);setResult(null);
    const index=WEEKEND_PRIZES.findIndex(p=>p.cents===draw.cents);
    const target=(360-index*60-30+360)%360;
    setRotation(previous=>previous+(360-previous%360)%360+1440+target);
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current=setTimeout(()=>{setResult(draw.cents);setSpinning(false);guard.current=false;},reduced?30:3200);
  };
  return <section className={styles.page} aria-label="Weekend prize wheel">
    <div className={styles.chances}>
      {unlocked&&<p className={styles.contribution}>You completed {ownPieces(team).length} routes and earned {ownPieces(team).length} draws.</p>}
      <p className={styles.intro}>{unlocked?'Draws remaining':'Prize draws'} <strong>{remaining}</strong></p>
    </div>
    <div className={styles.frame}><span className={styles.pointer} aria-hidden="true"/><div className={styles.wheel} style={{transform:`rotate(${rotation}deg)`}} aria-hidden="true">
      {WEEKEND_PRIZES.map((p,i)=>{
        const angle=(i*60+30)*Math.PI/180;
        return <span className={styles.prize} key={p.cents} style={{left:`${50+31*Math.sin(angle)}%`,top:`${50-31*Math.cos(angle)}%`}}><b style={{transform:`rotate(${-rotation}deg)`}}>${(p.cents/100).toFixed(2)}</b></span>;
      })}
    </div><span className={styles.hub} aria-hidden="true"><span>CASH</span><strong>PRIZE WHEEL</strong></span></div>
    <div className={styles.result} data-result={displayedResult!==null} role="status" aria-live="polite">
      {displayedResult!==null?<><span>{result!==null?'You won':'Last prize'}</span><strong><small>$</small>{(displayedResult/100).toFixed(2)}</strong></>:<span>{spinning?'Spinning...':!unlocked?'Complete all three team routes to unlock the wheel.':'Spin for a weekend reward.'}</span>}
    </div>
    <button className={styles.button} disabled={!remaining||spinning} onClick={spin}>{spinning?'Spinning...':!unlocked?'Complete the Relay':remaining?'Spin the Wheel':'No Draws Left'}</button>
    {error&&<p className={styles.error} role="alert">{error}</p>}
    {history.length>0&&<section className={styles.history} aria-label="Your draw history"><h3>Draw History</h3><ol>{history.slice().reverse().map((d,i)=><li key={d.id}><span>Draw {history.length-i}</span><strong><small>$</small>{(d.cents/100).toFixed(2)}</strong></li>)}</ol></section>}
    <details className={styles.rules}><summary>Prizes & Rules</summary><p>Complete three different routes as a two-person team. The teammate who completes two routes earns two draws, and the teammate who completes one route earns one draw. {preview?'Reopen or refresh this preview to restart the event flow.':'Progress, results, and unused draws are saved on this device after the event ends.'} Draw results are saved before the wheel animation begins.</p><p>Prize amounts: $0.18 / $0.38 / $0.88 / $1.88 / $5.88 / $8.88. Wheel segment size does not represent the odds.</p></details>
    <p className={styles.note}>This prototype simulates rewards and does not distribute real cash.</p>
  </section>;
}
