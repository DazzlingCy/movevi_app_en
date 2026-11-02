import { useEffect, useState, type CSSProperties } from 'react';
import {
  BookOpen, Building2, Castle, Check, ChevronLeft, Church, Clapperboard, Clock3, Columns3,
  Drama, Factory, Flag, Globe2, Hotel, Landmark, MapPin, Mountain, Palmtree, Pyramid,
  RadioTower, Route, Snowflake, Sparkles, Telescope, TowerControl, TrainFront, Trees, Waves, X,
  type LucideIcon
} from 'lucide-react';
import { getJourneyCity } from '../journey/data';
import { getCountryLevelProgress } from '../journey/state';
import type { JourneyCity, JourneyState } from '../journey/types';

interface JourneyLevelViewProps {
  state: JourneyState;
  onBack: () => void;
}

const cityRecordIcons: Record<string, LucideIcon> = {
  hangzhou: Waves,
  beijing: Landmark,
  shanghai: Building2,
  xian: Castle,
  tokyo: RadioTower,
  paris: Church,
  london: Clock3,
  'new-york': Hotel,
  sydney: Drama,
  rio: Mountain,
  cairo: Pyramid,
  bangkok: Palmtree,
  mumbai: TrainFront,
  singapore: Trees,
  moscow: Snowflake,
  'los-angeles': Clapperboard,
  rome: Columns3,
  dubai: TowerControl,
  berlin: Factory,
  toronto: Telescope
};

export default function JourneyLevelView({ state, onBack }: JourneyLevelViewProps) {
  const [rulesOpen, setRulesOpen] = useState(false);
  const level = getCountryLevelProgress(state);
  const completedCities = state.completedCityIds
    .map(cityId => getJourneyCity(cityId))
    .filter((city): city is NonNullable<typeof city> => Boolean(city));
  const completedCountries = completedCities.reduce<Array<{ countryCode: string; countryName: string; cities: JourneyCity[] }>>((records, city) => {
    const existing = records.find(record => record.countryCode === city.countryCode);
    if (existing) existing.cities.push(city);
    else records.push({ countryCode: city.countryCode, countryName: city.countryName, cities: [city] });
    return records;
  }, []);
  const nextLevel = Math.min(level.maxLevel, level.level + 1);
  const isMaxLevel = level.level >= level.maxLevel;
  const progress = Math.min(100, (level.completedCountries / level.maxLevel) * 100);

  useEffect(() => {
    if (!rulesOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setRulesOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [rulesOpen]);

  return (
    <main className="level-record-page" id="main-content">
      <header className="level-record-nav">
        <button type="button" onClick={onBack} aria-label="Back"><ChevronLeft /></button>
        <span>{"Globe Level"}</span>
        <button className="level-record-nav__rule" type="button" onClick={() => setRulesOpen(true)} aria-label="View Hierarchy Rules"><BookOpen aria-hidden="true" /><span>{"Rule"}</span></button>
      </header>

      <div className="level-record-content">
        <section className="level-record-intro" aria-labelledby="level-record-title">
          <div>
            <span><Sparkles aria-hidden="true" />MOVEVI WORLD LEVEL</span>
            <h1 id="level-record-title">{"You've lighted the world."}<br /><strong>{level.completedCountries}</strong> {"Countries and territories"}</h1>
            <p>{"Continue to complete the new national journey and expand your global footprint."}</p>
          </div>
          <div className="level-record-badge" aria-label={`Current Global Level LV.${level.level}`}>
            <Globe2 aria-hidden="true" />
            <strong>LV.{level.level}</strong>
          </div>
        </section>

        <section className="level-record-progress" aria-labelledby="level-progress-title">
          <header>
            <div><h2 id="level-progress-title">{"Globe Level"}</h2><span>LV.{level.level}</span></div>
          </header>
          <div className="level-record-progress__track" role="progressbar" aria-label="Globe Level Progress" aria-valuemin={0} aria-valuemax={level.maxLevel} aria-valuenow={level.completedCountries}>
            <i style={{ width: `${progress}%` }} />
          </div>
          <footer>
            <span>{isMaxLevel ? "Highest level achieved" : <>{"Distance"} <b>LV.{nextLevel}</b> {"It's not good."} <strong>1</strong> {"Country or area"}</>}</span>
            <small>{level.completedCountries}/{level.maxLevel}</small>
          </footer>
        </section>

        <section className="level-record-cities" aria-labelledby="completed-city-records-title">
          <header>
            <span><MapPin aria-hidden="true" /></span>
            <div><h2 id="completed-city-records-title">{"Completed countries and territories"}</h2><p>{"Multiple completed city consolidation records in the same country"}</p></div>
            <strong>{completedCountries.length}</strong>
          </header>
          <div className="level-record-cities__list">
            {completedCountries.map((country, index) => {
              const representativeCity = country.cities[0];
              const CountryIcon = cityRecordIcons[representativeCity.id] ?? Route;
              const completedRouteCount = country.cities.reduce((total, city) => total + city.routes.length, 0);
              return (
                <article key={country.countryCode}>
                  <span className="level-record-city__icon" style={{ '--city-icon-accent': representativeCity.accent } as CSSProperties}><CountryIcon aria-hidden="true" /></span>
                  <div>
                    <strong>{country.countryName}<small>{country.cities.map(city => city.name).join(' · ')}</small></strong>
                    <p><Flag aria-hidden="true" />{country.cities.length} {"City"}<i aria-hidden="true" />{completedRouteCount}/{completedRouteCount} {"Route"}</p>
                  </div>
                  <span className="level-record-city__status"><Check aria-hidden="true" />{"Lighted"}</span>
                  <b>{String(index + 1).padStart(2, '0')}</b>
                </article>
              );
            })}
          </div>
        </section>

      </div>

      {rulesOpen && (
        <div className="level-record-rules-overlay" onMouseDown={event => { if (event.currentTarget === event.target) setRulesOpen(false); }}>
          <section className="level-record-rules-dialog" role="dialog" aria-modal="true" aria-labelledby="level-record-rules-title">
            <header>
              <span><Globe2 aria-hidden="true" /></span>
              <div><h2 id="level-record-rules-title">{"Hierarchy rules"}</h2><p>{"Redecalation by country and region"}</p></div>
              <button type="button" onClick={() => setRulesOpen(false)} aria-label="Close Level Rule" autoFocus><X /></button>
            </header>
            <ol>
              <li><span>1</span><p>{"Completion of the entire route of a city, i.e., to light up the country or region to which it belongs, the global level"} <strong>+1</strong>。</p></li>
              <li><span>2</span><p>{"Several completed cities in the same country or region count only once, such as Beijing and Shanghai, which are counted as China."}</p></li>
              <li><span>3</span><p>{"Global upper limit is"} <strong>LV.195</strong>。</p></li>
            </ol>
          </section>
        </div>
      )}
    </main>
  );
}
