import type { JourneyCity, JourneyRoute } from './types';

type CitySeed = Omit<JourneyCity, 'routes' | 'countryName' | 'countryCode'> & { landmarks: string[] };

const CITY_COUNTRY_NAMES: Record<string, string> = {
  hangzhou: 'China',
  beijing: 'China',
  shanghai: 'China',
  xian: 'China',
  tokyo: 'Japan',
  paris: 'France',
  london: 'United Kingdom',
  'new-york': 'United States',
  sydney: 'Australia',
  rio: 'Brazil',
  cairo: 'Egypt',
  bangkok: 'Thailand',
  mumbai: 'India',
  singapore: 'Singapore',
  moscow: 'Russia',
  'los-angeles': 'United States',
  rome: 'Italy',
  dubai: 'United Arab Emirates',
  berlin: 'Germany',
  toronto: 'Canada',
};

const CITY_COUNTRY_CODES: Record<string, string> = {
  hangzhou: '156', beijing: '156', shanghai: '156', xian: '156', tokyo: '392',
  paris: '250', london: '826', 'new-york': '840', sydney: '036', rio: '076',
  cairo: '818', bangkok: '764', mumbai: '356', singapore: '702', moscow: '643',
  'los-angeles': '840', rome: '380', dubai: '784', berlin: '276', toronto: '124',
};

const ROUTE_SUFFIXES = [
  'Morning Loop', 'Waterfront Run', 'Old Town Trail', 'Park Run', 'Architecture Tour',
  'Neighborhood Run', 'Art Walk', 'Skyline Route', 'Sunset Run', 'Grand Finale',
] as const;

const DISTANCES = [3.2, 4.1, 4.8, 5.4, 3.7, 6.2, 4.5, 7.1, 5.8, 8.4] as const;
const PACE_MINUTES_PER_KM = [7.2, 7.5, 7.1, 7.8, 7.3, 7.6, 7.4, 7.7, 7.2, 7.5] as const;

const citySeeds: CitySeed[] = [
  { id: 'hangzhou', name: 'Hangzhou', englishName: 'Hangzhou', continent: 'Asia', longitude: 120.1551, latitude: 30.2741, accent: '#4f8f7a', description: 'Follow lakeside paths, tea fields, and canal bridges through one of China\'s most graceful cities.', landmarks: ['Broken Bridge', 'Bai Causeway', 'West Lake', 'Lingyin Temple', 'Beishan Road', 'Longjing Village', 'Qiantang River', 'Gongchen Bridge', 'Nine Creeks', 'West Lake Loop'] },
  { id: 'beijing', name: 'Beijing', englishName: 'Beijing', continent: 'Asia', longitude: 116.4074, latitude: 39.9042, accent: '#a55343', description: 'Run from the imperial center to modern greenways through layers of capital-city history.', landmarks: ['Forbidden City', 'Temple of Heaven', 'Summer Palace', 'Olympic Forest Park', 'Jingshan Park', 'Tsinghua Garden', 'Liangma River', 'Sanlitun', 'Chang\'an Avenue', 'Central Axis'] },
  { id: 'shanghai', name: 'Shanghai', englishName: 'Shanghai', continent: 'Asia', longitude: 121.4737, latitude: 31.2304, accent: '#3e7b88', description: 'Trace the Huangpu River where historic neighborhoods meet a futuristic skyline.', landmarks: ['The Bund', 'Wukang Road', 'Suzhou Creek', 'Century Park', 'Sinan Mansions', 'Yuyuan Garden', 'West Bund', 'Lujiazui', 'North Bund', 'Huangpu River Loop'] },
  { id: 'xian', name: "Xi'an", englishName: "Xi'an", continent: 'Asia', longitude: 108.9398, latitude: 34.3416, accent: '#9b6544', description: 'Cross ancient walls and lively lanes shaped by the beginning of the Silk Road.', landmarks: ['Yongning Gate', 'Giant Wild Goose Pagoda', 'Daming Palace', 'Qujiang Lake', 'Shuyuanmen Street', 'Muslim Quarter', 'Small Wild Goose Pagoda', 'Bell Tower', 'City Moat', 'City Wall Loop'] },
  { id: 'tokyo', name: 'Tokyo', englishName: 'Tokyo', continent: 'Asia', longitude: 139.6503, latitude: 35.6762, accent: '#b3544d', description: 'Move between quiet temples, energetic neighborhoods, and neon-lit towers.', landmarks: ['Senso-ji', 'Sumida River', 'Imperial Palace', 'Yoyogi Park', 'Kagurazaka', 'Ginza', 'Ueno Park', 'Tokyo Tower', 'Odaiba', 'Yamanote Loop'] },
  { id: 'paris', name: 'Paris', englishName: 'Paris', continent: 'Europe', longitude: 2.3522, latitude: 48.8566, accent: '#9d624d', description: 'Follow the Seine through art, grand boulevards, gardens, and warm city light.', landmarks: ['Louvre Museum', 'Left Bank', 'Notre-Dame', 'Luxembourg Gardens', 'Montmartre', 'Le Marais', "Musee d'Orsay", 'Eiffel Tower', 'Champs-Elysees', 'Seine Loop'] },
  { id: 'london', name: 'London', englishName: 'London', continent: 'Europe', longitude: -0.1276, latitude: 51.5072, accent: '#566d78', description: 'Pass bridges, clock towers, royal parks, and the creative heart of the city.', landmarks: ['Big Ben', 'South Bank', 'Tower Bridge', 'Hyde Park', 'Covent Garden', 'Notting Hill', 'Tate Modern', 'The Shard', "Regent's Canal", 'Thames Loop'] },
  { id: 'new-york', name: 'New York', englishName: 'New York', continent: 'North America', longitude: -74.006, latitude: 40.7128, accent: '#ba6d3f', description: 'Run the grid, the waterfront, and the parks of a city that never slows down.', landmarks: ['Brooklyn Bridge', 'Hudson River', 'High Line', 'Central Park', 'Greenwich Village', 'Fifth Avenue', 'The Met', 'Empire State Building', 'Times Square', 'Manhattan Loop'] },
  { id: 'sydney', name: 'Sydney', englishName: 'Sydney', continent: 'Oceania', longitude: 151.2093, latitude: -33.8688, accent: '#3d8390', description: 'Harbor paths, ocean cliffs, and open skies set the pace for every run.', landmarks: ['Sydney Opera House', 'Circular Quay', 'Harbour Bridge', 'Royal Botanic Garden', 'The Rocks', 'Bondi Beach', 'Art Gallery of NSW', 'Darling Harbour', 'Manly Beach', 'Harbor Loop'] },
  { id: 'rio', name: 'Rio de Janeiro', englishName: 'Rio de Janeiro', continent: 'South America', longitude: -43.1729, latitude: -22.9068, accent: '#4e8a68', description: 'Bay views, mountain ridges, and samba energy power a bright tropical journey.', landmarks: ['Copacabana', 'Guanabara Bay', 'Sugarloaf Mountain', 'Flamengo Park', 'Santa Teresa', 'Lapa', 'Museum of Tomorrow', 'Christ the Redeemer', 'Ipanema', 'Bay Loop'] },
  { id: 'cairo', name: 'Cairo', englishName: 'Cairo', continent: 'Africa', longitude: 31.2357, latitude: 30.0444, accent: '#b0834f', description: 'Measure centuries of history from the Nile waterfront to the Giza Plateau.', landmarks: ['Giza Pyramids', 'Nile Corniche', 'The Sphinx', 'Al-Azhar Park', 'Old Cairo', 'Khan el-Khalili', 'Egyptian Museum', 'Cairo Tower', 'Saladin Citadel', 'Nile Loop'] },
  { id: 'bangkok', name: 'Bangkok', englishName: 'Bangkok', continent: 'Asia', longitude: 100.5018, latitude: 13.7563, accent: '#a76c43', description: 'Golden temples, river paths, and vivid street life create a warm city rhythm.', landmarks: ['Wat Arun', 'Chao Phraya River', 'Grand Palace', 'Lumphini Park', 'Charoen Krung', 'Chinatown', 'Bangkok Art and Culture Centre', 'Mahanakhon', 'Rattanakosin Island', 'River Loop'] },
  { id: 'mumbai', name: 'Mumbai', englishName: 'Mumbai', continent: 'Asia', longitude: 72.8777, latitude: 19.076, accent: '#a96546', description: 'Run beside the Arabian Sea through cinematic landmarks and everyday city life.', landmarks: ['Gateway of India', 'Marine Drive', 'Chhatrapati Shivaji Terminus', 'Sanjay Gandhi National Park', 'Colaba', 'Bandra', 'CSMVS Museum', 'Worli Sea Face', 'Juhu Beach', 'Coastal Loop'] },
  { id: 'singapore', name: 'Singapore', englishName: 'Singapore', continent: 'Asia', longitude: 103.8198, latitude: 1.3521, accent: '#438673', description: 'Gardens, bays, and diverse neighborhoods shape a precise city on the equator.', landmarks: ['Merlion Park', 'Marina Bay', 'Gardens by the Bay', 'Botanic Gardens', 'Chinatown', 'Kampong Glam', 'National Gallery', 'Marina Bay Sands', 'East Coast Park', 'Waterfront Loop'] },
  { id: 'moscow', name: 'Moscow', englishName: 'Moscow', continent: 'Europe', longitude: 37.6173, latitude: 55.7558, accent: '#925046', description: 'Grand walls, riverside paths, and long avenues reveal the scale of the city.', landmarks: ['Red Square', 'Moskva River', "St. Basil's Cathedral", 'Gorky Park', 'Arbat Street', 'Zaryadye Park', 'Pushkin Museum', 'Moscow City', 'Sparrow Hills', 'Garden Ring'] },
  { id: 'los-angeles', name: 'Los Angeles', englishName: 'Los Angeles', continent: 'North America', longitude: -118.2437, latitude: 34.0522, accent: '#b87848', description: 'Run from movie-set hills to the Pacific through the open light of the West Coast.', landmarks: ['Griffith Observatory', 'Santa Monica', 'Hollywood Boulevard', 'Griffith Park', 'Silver Lake', 'Arts District', 'Getty Center', 'Downtown Skyline', 'Venice Beach', 'Pacific Loop'] },
  { id: 'rome', name: 'Rome', englishName: 'Rome', continent: 'Europe', longitude: 12.4964, latitude: 41.9028, accent: '#a66047', description: 'Ancient plazas, stone columns, and umbrella pines turn every mile into history.', landmarks: ['Colosseum', 'Tiber River', 'Pantheon', 'Villa Borghese', 'Trastevere', 'Piazza Navona', 'Capitoline Museums', "St. Peter's Basilica", 'Spanish Steps', 'Ancient Rome Loop'] },
  { id: 'dubai', name: 'Dubai', englishName: 'Dubai', continent: 'Asia', longitude: 55.2708, latitude: 25.2048, accent: '#b98a4e', description: 'The creek, desert neighborhoods, and a future-facing skyline reflect one another.', landmarks: ['Burj Khalifa', 'Jumeirah Beach', 'Museum of the Future', 'Safa Park', 'Al Fahidi', 'Gold Souk', 'Dubai Design District', 'Dubai Marina', 'Palm Jumeirah', 'Creek Loop'] },
  { id: 'berlin', name: 'Berlin', englishName: 'Berlin', continent: 'Europe', longitude: 13.405, latitude: 52.52, accent: '#65756b', description: 'Cross historic fault lines, forested parks, and neighborhoods always being remade.', landmarks: ['Brandenburg Gate', 'Spree River', 'Museum Island', 'Tiergarten', 'Kreuzberg', 'East Side Gallery', 'Neue Nationalgalerie', 'TV Tower', 'Tempelhof', 'Berlin Loop'] },
  { id: 'toronto', name: 'Toronto', englishName: 'Toronto', continent: 'North America', longitude: -79.3832, latitude: 43.6532, accent: '#47798a', description: 'Lakefront paths and multicultural neighborhoods unfold across a spacious city.', landmarks: ['CN Tower', 'Lake Ontario', 'Distillery District', 'High Park', 'Kensington Market', 'Yorkville', 'Art Gallery of Ontario', 'Financial District', 'Toronto Islands', 'Lakefront Loop'] },
];

const makeRoutes = (city: CitySeed): JourneyRoute[] => city.landmarks.map((landmark, index) => {
  const nextLandmark = city.landmarks[(index + 1) % city.landmarks.length];
  const thirdLandmark = city.landmarks[(index + 2) % city.landmarks.length];
  const distanceKm = DISTANCES[index];
  const durationMinutes = Math.round(distanceKm * PACE_MINUTES_PER_KM[index]);

  return {
    id: `${city.id}-route-${index + 1}`,
    cityId: city.id,
    order: index + 1,
    name: `${landmark} · ${ROUTE_SUFFIXES[index]}`,
    landmarks: [landmark, nextLandmark, thirdLandmark],
    distanceKm,
    durationMinutes,
    calories: Math.round(distanceKm * 64),
    description: `Start at ${landmark}, continue through ${nextLandmark}, and finish near ${thirdLandmark} while discovering the character of ${city.name}.`,
  };
});

export const JOURNEY_CITIES: JourneyCity[] = citySeeds.map(({ landmarks, ...city }) => ({
  ...city,
  countryName: CITY_COUNTRY_NAMES[city.id],
  countryCode: CITY_COUNTRY_CODES[city.id],
  routes: makeRoutes({ ...city, landmarks }),
}));

export const JOURNEY_SEQUENCE = [
  'beijing', 'shanghai', 'tokyo', 'paris', 'new-york', 'london', 'rome', 'berlin',
  'moscow', 'dubai', 'cairo', 'mumbai', 'bangkok', 'singapore', 'sydney',
  'los-angeles', 'toronto', 'rio', 'hangzhou', 'xian',
] as const;

export const CITY_ROUTE_RELEASE_SCHEDULE: Readonly<Record<string, string>> = {
  toronto: 'December 2026',
  hangzhou: 'January 2027',
  xian: 'March 2027',
};

export const hasPublishedCityRoutes = (cityId: string) => !(cityId in CITY_ROUTE_RELEASE_SCHEDULE);

export const getCityRouteReleaseDate = (cityId: string) => CITY_ROUTE_RELEASE_SCHEDULE[cityId];

export const CITY_BY_ID = new Map(JOURNEY_CITIES.map(city => [city.id, city]));

export const getJourneyCity = (cityId: string) => CITY_BY_ID.get(cityId);

export const getJourneyRoute = (cityId: string, routeId: string) =>
  CITY_BY_ID.get(cityId)?.routes.find(route => route.id === routeId);
