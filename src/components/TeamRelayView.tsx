import WeekendRelayWheel from './WeekendRelayWheel';
import { weekendPeriod, periodOpen } from '../journey/weekendRelay';
import { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Gift, Globe2, MapPin, Users, Award, X } from 'lucide-react';
import CityImage from './CityImage';
import Modal from './journey/Modal';
import { resolveLocalImage } from '../lib/localImages';
import { previewPuzzleHistory } from '../journey/puzzleHistory';
import { PUZZLE_LOBBY_LIMIT } from '../journey/puzzleDemo';
import { puzzleProgressFeedback } from '../journey/puzzleFeedback';
import { currentPuzzle, periodParticipation, openPuzzleTeams, ownPieces, puzzleComplete, drawsLeft, type RelayDraw, type PuzzleCity, type PuzzleRoute, type PuzzleState, type PuzzleTeam, type PuzzleMember } from '../journey/puzzleTeam';
import styles from './TeamRelayView.module.css';

interface Props {
  state: PuzzleState; cities: PuzzleCity[]; routes: PuzzleRoute[]; storageFailed: boolean;
  onBack: () => void; onCreate: (city: PuzzleCity) => boolean; onJoin: (teamId:string) => boolean; onDraw: (id: string) => RelayDraw | undefined; now: number;
  onRun: (route: PuzzleRoute) => void;
  onSimulatePartner?: (route: PuzzleRoute) => void;
  onSimulateJoin?: () => void;
  preview?: boolean;
}
const time = (n: number) => new Date(n).toLocaleString('en-US', { timeZone:'Asia/Shanghai', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false });
const cityNames = (team: PuzzleTeam) => [...new Set(team.pieces.map(p => p.route.name))].join(' · ');

function Passport({ team, now }: { team?: PuzzleTeam; now: number }) {
  return <div className={styles.passport} aria-label={`Current team passport, ${team?.pieces.length ?? 0} of 3 routes complete`}>
    <div className={styles.passportHeading}><Globe2 size={21} /><span>MOVEVI · {team?.city.name ?? "City"} Passport</span><span>{team ? puzzleComplete(team) ? "Complete" : now >= team.period.endsAt ? "Ended" : "Collecting memories" : "Ready to go"}</span></div>
    <div className={styles.stamps}>{[0,1,2].map(i => {
      const piece = team?.pieces[i];
      return <div key={i} className={`${styles.stamp} ${piece ? styles.stamped : ''}`}>
        <span className={styles.stampNumber}>Stop {i + 1}</span>
        {piece ? <><CityImage src={piece.route.image} alt="" /><strong>{piece.route.name}</strong><small>{team?.members.find(m => m.id === piece.memberId)?.name}</small><Check className={styles.stampCheck} size={14} /></>
          : <><MapPin size={23} /><strong>{i === (team?.pieces.length ?? 0) ? "Next Stop" : "Waiting"}</strong><small>{i === 0 ? "Your route" : i === 1 ? "Teammate route" : "Team finish"}</small></>}
      </div>;
    })}</div>
    <p>{team?.pieces.length ? cityNames(team) : "Each completed route adds a stamp to your team passport."}</p>
  </div>;
}

function MemberAvatar({member}:{member?:PuzzleMember}) {
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[member?.avatarUrl]);
  return <span className={styles.memberAvatar} role="img" aria-label={member?member.name + " avatar":"Waiting for a teammate"}>{member?.avatarUrl&&!failed?<img src={resolveLocalImage(member.avatarUrl)} alt="" onError={()=>setFailed(true)}/>:member?member.name.slice(0,1):<Users size={18}/>}</span>;
}

export function RelayHistoryView({teams,now,onBack}:{teams:PuzzleTeam[];now:number;onBack:()=>void}) {
  const joinedAt=(t:PuzzleTeam)=>t.members.find(m=>m.id==='self')?.joinedAt??t.createdAt;
  const history=teams.filter(t=>t.members.some(m=>m.id==='self')).slice().sort((a,b)=>joinedAt(b)-joinedAt(a)||b.createdAt-a.createdAt);
  return <main className={`${styles.page} ${styles.historyPage}`}>
    <nav className={styles.nav} aria-label="Event history navigation"><button autoFocus onClick={onBack} aria-label="Back to event"><ChevronLeft size={22}/></button><span>Event History</span><span aria-hidden="true"/></nav>
    <div className={styles.body}><div className={styles.historyHeading}><h1>Past Teams</h1><span>{history.length} records</span></div>
      {history.length?<div className={styles.historyList}>{history.map(t=>{
        const complete=puzzleComplete(t),ended=now>=t.period.endsAt;
        const status=complete?"Completed":t.archived?"Archived":ended?"Incomplete · "+t.pieces.length+'/3':t.members.length<2?"Waiting for teammate":"In progress · "+t.pieces.length+'/3';
        return <article className={styles.historyCard} key={t.id} aria-label={`${t.city.name} event record`}>
          <div className={styles.historyRecordHeading}>
            <time className={styles.historyDate} dateTime={new Date(joinedAt(t)).toISOString()}>{time(joinedAt(t))}</time>
            <span className={complete?styles.historyComplete:styles.historyStatus} data-state={complete?'complete':t.archived?'archived':ended?'ended':t.members.length<2?'waiting':'active'}>{status}</span>
          </div>
          <CityImage src={t.city.image} alt="" className={styles.historyCityPhoto}/>
          <div className={styles.historyContent}>
            <div className={styles.historyCity}><h2>{t.city.name}</h2></div>
            <div className={styles.historyMembers} aria-label="Team members.">{Array.from({length:Math.max(2,t.members.length)},(_,i)=>{const member=t.members[i];return <div key={member?.id??'empty'}><MemberAvatar member={member}/><span><strong>{member?.name??"Waiting for a teammate"}</strong><small>{member?ownPieces(t,member.id).length+" routes":"Open spot"}</small></span></div>;})}</div>
          </div>
        </article>;
      })}</div>:<div className={styles.lobbyEmpty}><Users size={26}/><strong>No event history yet.</strong><p>Your completed and past teams will appear here.</p></div>}
    </div>
  </main>;
}

function ActivityRules() {
  return <><ol className={styles.rules}>
    <li><strong>Choose a city and find a teammate.</strong><p>Create or join a two-person team. Routes open when both spots are filled.</p></li>
    <li><strong>Complete three different routes together.</strong><p>Split three routes 2+1 between teammates. You do not need to run at the same time.</p></li>
    <li><strong>Unlock prize draws when the team finishes.</strong><p>The teammate who completes two routes gets two draws; the other teammate gets one.</p></li>
  </ol><section className={styles.ruleDetails} aria-labelledby="relay-notice-title">
    <h3 id="relay-notice-title">Event Details</h3>
    <dl>
      <div><dt>Event Schedule</dt><dd>Friday through Sunday, starting at 10:00 AM Beijing time.</dd></div>
      <div><dt>One Team per Round</dt><dd>You can create or join one team per round. Teams cannot be changed after joining.</dd></div>
      <div><dt>Eligible Routes</dt><dd>Only unlocked routes in your team city count, and the team must have two members before a run starts.</dd></div>
      <div><dt>Completion Rules</dt><dd>Each teammate must complete at least one and no more than two routes. A route can only count once per team.</dd></div>
      <div><dt>After the Round</dt><dd>Completed routes and earned prize draws remain available after the round ends.</dd></div>
    </dl>
    <p className={styles.prototypeNote}>This preview simulates matchmaking and rewards.</p>
  </section></>;
}

function LobbyTeam({team,eligible,canEnroll,periodActive,onJoin}:{team:PuzzleTeam;eligible:boolean;canEnroll:boolean;periodActive:boolean;onJoin:(id:string)=>void}) {
  return <button className={styles.lobbyTeam} disabled={!canEnroll||!eligible} onClick={()=>onJoin(team.id)} aria-label={`Join ${team.city.name} team hosted by ${team.members[0].name}`}>
    <CityImage src={team.city.image} alt="" className={styles.lobbyPhoto}/>
    <span><strong>{team.city.name}</strong><small className={styles.lobbyHost}><MemberAvatar member={team.members[0]}/><span>{team.members[0].name} · 1/2 runners</span></small></span>
    <b>{!eligible?"Locked":canEnroll?"Join":periodActive?"Participated":"Closed"}</b>
  </button>;
}

export function RelayPlazaContent({teams,routes,canEnroll,periodActive,onJoin}:{teams:PuzzleTeam[];routes:PuzzleRoute[];canEnroll:boolean;periodActive:boolean;onJoin:(id:string)=>void}) {
  return <><p>{teams.length} teams are looking for a teammate.</p>{teams.length?teams.map(t=><div key={t.id}><LobbyTeam team={t} eligible={routes.some(r=>r.id===t.city.id)} canEnroll={canEnroll} periodActive={periodActive} onJoin={onJoin}/></div>):<div className={styles.lobbyEmpty}><Users size={24}/><strong>No teams are available right now.</strong><p>Create a team to get started.</p></div>}</>;
}

export function RelayJoinConfirmation({onCancel,onConfirm,team}:{onCancel:()=>void;onConfirm:()=>void;team?:PuzzleTeam}) {
  return <Modal labelId="relay-join-title" onClose={onCancel} backdropClassName={styles.createBackdrop} className={styles.joinDialog}>
    <h2 id="relay-join-title">{team ? `Join the ${team.city.name} team?` : 'Join this team?'}</h2>
    <p>You cannot switch teams during the current round.</p>
    <div className={styles.joinActions}><button onClick={onCancel}>Cancel</button><button onClick={onConfirm}>Join Team</button></div>
  </Modal>;
}

export function RelayRoutesContent({team,routes,now,onRun,preview=false,onSimulatePartner,onLottery}:{team:PuzzleTeam;routes:PuzzleRoute[];now:number;onRun:(route:PuzzleRoute)=>void;preview?:boolean;onSimulatePartner?:(route:PuzzleRoute)=>void;onLottery?:()=>void}) {
  const own=ownPieces(team),complete=puzzleComplete(team),active=periodOpen(team.period,now),ready=team.members.length===2;
  const partner=team.members.find(member=>member.id!=='self');
  const cityRoutes=routes.filter(r=>r.id===team.city.id).slice().sort((a,b)=>a.routeIndex-b.routeIndex);
  if(complete)return <section aria-label={`${team.city.name} city routes`}>
    <div className={styles.routeCityBanner}><CityImage src={team.city.image} alt="" loading="eager"/><div><h3>{team.city.name}</h3><p>Team complete · {team.pieces.length} routes · You completed {own.length}</p></div></div>
    <p className={styles.teamStatus} role="status">Team complete. The prize wheel is unlocked.</p>
    <div className={styles.routeList}>{team.pieces.map(piece=>{
      const member=team.members.find(member=>member.id===piece.memberId);
      return <div className={styles.inlineRoute} key={piece.id}><CityImage src={piece.route.image} alt="" className={styles.routePhoto}/><span><strong>{piece.route.title}</strong><small>{piece.route.distanceKm} km · {piece.route.minutes} min</small></span><span className={`${styles.routeDone} ${styles.partnerDone}`}><Check size={13}/><span>{member?.name ?? 'Teammate'} completed</span></span></div>;
    })}</div>
    {onLottery&&<div className={styles.routeRewardFooter}><button className={styles.primary} onClick={onLottery} aria-label="Open the prize wheel">{drawsLeft(team)?"Draw now · "+drawsLeft(team)+" draws":"View draw history"}<ChevronRight size={16}/></button></div>}
  </section>;
  return <section aria-label={`${team.city.name} city routes`}>
      <div className={styles.routeCityBanner}><CityImage src={team.city.image} alt="" loading="eager"/><div><h3>{team.city.name}</h3><p>{cityRoutes.length} routes · You completed {own.length} of 2 max</p></div></div>
      {(complete||!active||ready)&&<p className={styles.teamStatus} role="status">{complete?'Team complete. The prize wheel is unlocked.':!active?'This round has ended. Your route history is saved.':own.length>=2?'You finished two routes. Your teammate can complete the final leg.':'Choose a route to start your relay.'}</p>}
      <div className={styles.routeList}>{cityRoutes.length?cityRoutes.map((r,index)=>{
        const done=own.some(p=>p.route.routeId===r.routeId),canRun=active&&ready&&!complete&&own.length<2&&!done;
        const partnerDone=team.pieces.some(p=>p.memberId!=='self'&&p.route.routeId===r.routeId);
        const partnerPreview=preview&&!!onSimulatePartner&&index===2&&ready&&active&&!complete;
        return <div className={styles.inlineRoute} key={r.routeId}><CityImage src={r.image} alt="" className={styles.routePhoto}/><span><strong>{r.title}</strong><small>{r.distanceKm} km · {r.minutes} min</small></span>{partnerDone?<span className={`${styles.routeDone} ${styles.partnerDone}`}><Check size={13}/><span>{partner?.name ?? 'Teammate'} completed{done?' · You also completed this route':''}</span></span>:done?<span className={styles.routeDone}><Check size={13}/>Completed</span>:partnerPreview?<button className={styles.partnerRun} onClick={()=>onSimulatePartner?.(r)} aria-label={`Simulate teammate finishing ${r.title}`}>Simulate Teammate Finish</button>:canRun?<button onClick={()=>onRun(r)} aria-label={`Start route: ${r.title}`}>Start</button>:<span className={styles.routeUnavailable}>{complete?'Closed':!active?'Round ended':!ready?'Waiting for teammate':'Personal route limit reached'}</span>}</div>;
      }):<p className={styles.teamStatus}>No eligible routes are available in this city.</p>}</div>
  </section>;
}

export default function TeamRelayView({state,cities,routes,storageFailed,onBack,onCreate,onJoin,onDraw,now,onRun,onSimulatePartner,onSimulateJoin,preview=false}:Props) {
  const period=weekendPeriod(now),periodActive=periodOpen(period,now);
  const participation=periodParticipation(state,period.id);
  const team=participation&&!participation.archived?participation:!periodActive?currentPuzzle(state):undefined;
  const myTeams=state.teams.filter(t=>t.members.some(m=>m.id==='self'));
  const complete=!!team&&puzzleComplete(team),own=team?ownPieces(team):[],count=team?.pieces.length??0;
  const displayMembers=team?team.members.slice().sort((a,b)=>Number(b.id==='self')-Number(a.id==='self')):[];
  const ready=!!team&&team.members.length===2;
  const ended=!!team&&now>=team.period.endsAt,canEnroll=periodActive&&!participation;
  const displayPeriod=team?.period??period;
  const stage=complete?'complete':ended?'ended':!ready?'waiting':own.length>=2?'waiting-partner':'active';
  const routeAction=complete?"View Completed Routes":ended?"View Current Routes":!ready?"View City Routes":own.length>=2?"View Team Progress":"Choose a Route";
  const outstandingTeams=myTeams.filter(t=>t.id!==team?.id&&drawsLeft(t)>0).sort((a,b)=>b.period.startsAt-a.period.startsAt);
  const outstandingDraws=outstandingTeams.reduce((sum,t)=>sum+drawsLeft(t),0);
  const canSimulateJoin=preview&&!!onSimulateJoin&&!!team&&!ready&&!ended&&!team.archived&&periodOpen(team.period,now);
  const available=openPuzzleTeams(state,now).filter(t=>!preview||routes.some(r=>r.id===t.city.id)).slice(0,PUZZLE_LOBBY_LIMIT);
  const [historyOpen,setHistoryOpen]=useState(false);
  const creatableCities=cities.filter(city=>routes.some(r=>r.id===city.id));
  const featuredCities=creatableCities.slice(0,3);
  const [createCityId,setCreateCityId]=useState('');
  const selectedCity=creatableCities.find(city=>city.id===createCityId);
  const [sheet,setSheet]=useState<'cities'|'reward'|'routes'|'lottery'|'plaza'|'join'|'draws'|null>(null);
  const [pendingJoinId,setPendingJoinId]=useState<string|null>(null),[joinOrigin,setJoinOrigin]=useState<'plaza'|null>(null);
  const [message,setMessage]=useState(''),[lotteryId,setLotteryId]=useState<string|null>(null);
  const pageRef=useRef<HTMLElement>(null);
  const previousTeam=useRef(team);
  useEffect(()=>{
    const feedback=puzzleProgressFeedback(previousTeam.current,team);
    if(team&&team.id!==previousTeam.current?.id){
      pageRef.current?.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    }
    previousTeam.current=team;
    if(feedback)setMessage(feedback);
  },[team]);
  const lotteryTeam=myTeams.find(t=>t.id===lotteryId)??team;
  const date=(n:number)=>new Date(n).toLocaleDateString('en-US',{timeZone:'Asia/Shanghai',month:'2-digit',day:'2-digit'});
  useEffect(()=>{if(message){const timer=setTimeout(()=>setMessage(''),3600);return()=>clearTimeout(timer);}},[message]);
  const create=()=>{
    if(!selectedCity||!canEnroll)return;
    if(onCreate(selectedCity)){setSheet(null);setMessage(selectedCity.name+" team created. Waiting for a teammate.");}else setMessage("You already have a team or this round is closed.");
  };
  const openCreate=()=>{setCreateCityId('');setSheet('cities');};
  const requestJoin=(id:string)=>{
    if(!canEnroll)return;
    const target=available.find(t=>t.id===id);
    if(!target||!routes.some(r=>r.id===target.city.id)){setMessage("No eligible routes are available in this city. Choose another team.");return;}
    setPendingJoinId(id);setJoinOrigin(sheet==='plaza'?'plaza':null);setSheet('join');
  };
  const cancelJoin=()=>{setPendingJoinId(null);setSheet(joinOrigin);};
  const confirmJoin=()=>{
    const target=available.find(t=>t.id===pendingJoinId);
    if(!canEnroll||!target||!routes.some(r=>r.id===target.city.id)){
      cancelJoin();setMessage("That team is no longer available. Refresh the list and choose another team.");return;
    }
    if(onJoin(target.id)){setPendingJoinId(null);setSheet(null);setMessage("Team joined. You can now choose a route.");}
    else {cancelJoin();setMessage("That team is no longer available. Refresh the list and choose another team.");}
  };
  const openLottery=(t:PuzzleTeam)=>{setLotteryId(t.id);setSheet('lottery');};
  if(historyOpen)return <RelayHistoryView teams={preview?previewPuzzleHistory(myTeams,cities,routes,now):myTeams} now={now} onBack={()=>setHistoryOpen(false)}/>;
  return <main ref={pageRef} className={`${styles.page} ${styles.homePage}`} data-modal-open={!!sheet}>
    <nav className={styles.nav} aria-label="Event navigation"><button onClick={onBack} aria-label="Back to events"><ChevronLeft size={22}/></button><span>Global Team Relay</span><button onClick={()=>setHistoryOpen(true)}>Event History</button></nav>

    <div className={styles.body}>
      <p className={styles.schedule}><span className={styles.scheduleLabel}>{ended?'ROUND ENDED':'WEEKEND EVENT'}</span><span className={styles.scheduleDates}><time dateTime={new Date(displayPeriod.startsAt).toISOString()}>{date(displayPeriod.startsAt)}</time><span aria-hidden="true">—</span><time dateTime={new Date(displayPeriod.endsAt-1).toISOString()}>{date(displayPeriod.endsAt-1)}</time></span></p>
      {outstandingDraws>0&&<button className={styles.pendingRewards} onClick={()=>outstandingTeams.length===1?openLottery(outstandingTeams[0]):setSheet('draws')}><Gift size={18}/><span>You have <strong>{outstandingDraws}</strong> unused prize draws.</span><ChevronRight size={16}/></button>}
      {!team&&featuredCities.length>0&&<div className={styles.discoveryHero}>
        <div className={styles.heroPhotos} data-count={featuredCities.length} aria-hidden="true">{featuredCities.map(city=><div key={city.id}><CityImage src={city.image} alt="" loading="eager"/></div>)}</div>
        <div className={styles.heroCopy}><h1>Run Together<br/>Bring the World Closer</h1><p>Team up, split three routes, and unlock rewards.</p></div>
      </div>}
      {!team&&!participation&&<section className={styles.createPanel} aria-labelledby="relay-create-title">
        <div className={styles.createHeading}><h2 id="relay-create-title">Create a Team</h2><p>Start by choosing a city.</p></div>
        <button className={styles.primary} disabled={!canEnroll||!creatableCities.length} onClick={openCreate}>{!periodActive?"Opens Friday at 10:00 AM":!creatableCities.length?"No Eligible Cities":<>Choose a City<ChevronRight size={16}/></>}</button>
      </section>}
      {team&&<section className={styles.inlineTeam} aria-labelledby="my-relay-team-title" data-complete={complete} data-stage={stage}>
        <div className={styles.teamCover}>
          <div className={styles.teamCoverHeading}><h2 id="my-relay-team-title">My Team</h2><span className={styles.teamState} data-state={complete?'complete':ended?'ended':ready?'ready':'waiting'}>{complete&&<Check size={12}/>}{complete?"Completed":ended?"Closed":ready?"Ready":"Waiting for a teammate"}</span></div>
          <div className={styles.teamDestination}><CityImage src={team.city.image} alt="" className={styles.teamCityPhoto} loading="eager"/><div className={styles.teamCoverCopy}><p>{team.city.name}</p><div className={styles.coverProgress} role="progressbar" aria-label="Team route progress" aria-valuemin={0} aria-valuemax={3} aria-valuenow={count}><span>Completed</span><strong>{count}<small> {"/ 3 routes"}</small></strong></div></div></div>
        </div>
        <div className={styles.teamContent}>
        <div className={styles.teamMembers} aria-label="Team members">{[0,1].map(i=>{const member=displayMembers[i],contribution=member?ownPieces(team,member.id).length:0;return <div className={styles.teamMember} key={i} aria-label={member?`${member.name}, ${contribution} routes complete`:'Waiting for a teammate'}><MemberAvatar member={member}/><span>{!member&&canSimulateJoin?<button className={styles.simulateJoin} aria-label="Simulate teammate joining" onClick={()=>{onSimulateJoin?.();setMessage('Your teammate joined. Routes are now available.');}}>Simulate Join</button>:<strong>{member?.name??'Waiting for a teammate'}</strong>}{member&&<small><b>{contribution}</b> routes</small>}</span></div>;})}</div>
        {!complete&&(ended||own.length>=2)&&<p className={styles.teamStatus} role="status">{ended?'This round has ended. Your route history is saved.':'You completed two routes. Your teammate can finish the final leg.'}</p>}
        <button className={styles.allRoutesEntry} onClick={()=>setSheet('routes')}><span>{routeAction}</span><span>{stage==='waiting-partner'?count+'/3':(complete?count:routes.filter(r=>r.id===team.city.id).length)+" routes"}<ChevronRight size={16}/></span></button>
        <button className={styles.teamLottery} data-ready={complete&&drawsLeft(team)>0} onClick={()=>openLottery(team)} aria-label="Open prize wheel"><span className={styles.giftIcon}><Gift size={18}/></span><span><strong>Prize Wheel</strong>{complete&&<small>Remaining {drawsLeft(team)} {" draws"}</small>}</span><span className={`${styles.lotteryAction} ${!complete?styles.lotteryLocked:''}`}>{complete?(drawsLeft(team)?"Draw Now":"View Records"):ended?"Round ended":"Unlock after 3 routes"}<ChevronRight size={14}/></span></button>
        </div>
      </section>}
      <section className={styles.plaza} aria-labelledby="relay-plaza-title">
        <div className={styles.plazaHeading}><h2 id="relay-plaza-title">Team Lobby</h2><button onClick={()=>setSheet('plaza')}>View All<ChevronRight size={14}/></button></div>
        {available.length?available.slice(0,3).map(t=><div key={t.id}><LobbyTeam team={t} eligible={routes.some(r=>r.id===t.city.id)} canEnroll={canEnroll} periodActive={periodActive} onJoin={requestJoin}/></div>):<div className={styles.lobbyEmpty}><Users size={25}/><strong>No teams are available right now.</strong><p>{!periodActive?"Come back Friday to find a teammate.":canEnroll?"You can create a team first.":"Try again later."}</p></div>}
      </section>
      <section className={styles.homeRules} aria-labelledby="relay-rules-title"><h2 id="relay-rules-title">How It Works</h2><ActivityRules/></section>
      {storageFailed&&<p role="alert" className={styles.error}>{"Progress could not be saved. Keep this page open to avoid losing changes."}</p>}
    </div>
    {!sheet&&<div className={styles.toast} role="status" aria-live="polite" aria-atomic="true" data-visible={!!message}>{message}</div>}
    {sheet==='join'?<RelayJoinConfirmation team={state.teams.find(t=>t.id===pendingJoinId)} onCancel={cancelJoin} onConfirm={confirmJoin}/>:sheet&&<Modal labelId="relay-sheet-title" onClose={()=>setSheet(null)} backdropClassName={sheet==='cities'?styles.createBackdrop:undefined} className={sheet==='cities'?styles.createDialog:styles.sheet}>
      <div className={styles.sheetHeading}><h2 id="relay-sheet-title">{{plaza:"Team Lobby",cities:"Choose a City",reward:"Round Results",routes:complete?"Completed Routes":"All Routes",lottery:"Prize Wheel",draws:"Available Prize Draws"}[sheet]}</h2><button onClick={()=>setSheet(null)} aria-label="Close"><X size={20}/></button></div>
      {sheet==='cities'?<><div className={styles.choices}>{creatableCities.map(city=><button key={city.id} aria-pressed={createCityId===city.id} className={createCityId===city.id?styles.citySelected:undefined} onClick={()=>setCreateCityId(city.id)}><CityImage src={city.image} alt="" className={styles.choicePhoto}/><span><strong>{city.name}</strong><small>{routes.filter(r=>r.id===city.id).length} eligible routes</small></span>{createCityId===city.id&&<Check size={18}/>}</button>)}</div>{!creatableCities.length&&<p>No eligible cities are available right now.</p>}<p className={styles.note}>You cannot change your city or team after creating it.</p><button className={`${styles.primary} ${styles.createConfirm}`} disabled={!selectedCity||!canEnroll} onClick={create}>{selectedCity?"Create " + selectedCity.name + " Team":"Choose a City"}</button></>
      :sheet==='plaza'?<RelayPlazaContent teams={available} routes={routes} canEnroll={canEnroll} periodActive={periodActive} onJoin={requestJoin}/>
      :sheet==='draws'?<div className={styles.pendingList}>{outstandingTeams.map(t=><button key={t.id} onClick={()=>openLottery(t)}><CityImage src={t.city.image} alt=""/><span><strong>{t.city.name}</strong><small>{date(t.period.startsAt)}—{date(t.period.endsAt-1)}</small></span><b>{drawsLeft(t)} {" draws"}</b><ChevronRight size={16}/></button>)}</div>
      :sheet==='lottery'&&lotteryTeam?<WeekendRelayWheel team={lotteryTeam} onDraw={onDraw} preview={preview}/>
      :sheet==='routes'&&team?<RelayRoutesContent team={team} routes={routes} now={now} preview={preview} onSimulatePartner={onSimulatePartner} onLottery={()=>openLottery(team)} onRun={route=>{if(!preview)setSheet(null);onRun(route);}}/>
      :sheet==='reward'?<>{team&&<Passport team={team} now={now}/>}<div className={styles.badge}><Award size={32}/><span><strong>Global Teammates</strong><small>{complete?'Relay badge earned':'Complete all three relay legs together to earn it.'}</small></span></div><div className={styles.rewardAmount}><span>Route contributions<small>Two routes by you, one by your teammate</small></span><strong>{complete?own.length:'2 + 1'} routes</strong></div>{complete&&team?<button className={styles.primary} onClick={()=>openLottery(team)}>Draw Now · {drawsLeft(team)} left</button>:<p>{ended?'This relay period has ended.':`${count}/3 routes complete. Finish all three to unlock rewards.`}</p>}<p className={styles.note}>This is a prototype. Cash rewards are simulated and are not distributed.</p></>:null}
      <div className={styles.toast} role="status" aria-live="polite" aria-atomic="true" data-visible={!!message}>{message}</div>
    </Modal>}
  </main>;
}
