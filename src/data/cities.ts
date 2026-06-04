export type CityStatus = 'unlit' | 'in-progress' | 'lit' | 'upcoming';
export type LabelPosition = 'top' | 'bottom' | 'left' | 'right';

export interface CityData {
  id: string;
  name: string;
  englishName: string;
  continent: string;
  x: number;
  y: number;
  image: string;
  routes: number;
  spots: number;
  completed: number;
  status: CityStatus;
  completedRouteIndices?: number[];
  completedRouteTimestamps?: Record<number, number>;
  justLit?: boolean;
  labelPosition?: LabelPosition;
  description?: string;
}

export const CITIES: CityData[] = [
  { id: '1', name: 'Hangzhou', englishName: 'Hangzhou', continent: 'China', x: 83.5, y: 33.8, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/%E6%9D%AD%E5%B7%9E%E9%92%B1%E6%B1%9F%E6%96%B0%E5%9F%8E_4_%28cropped%29.jpg/1280px-%E6%9D%AD%E5%B7%9E%E9%92%B1%E6%B1%9F%E6%96%B0%E5%9F%8E_4_%28cropped%29.jpg', routes: 3, spots: 24, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'bottom', description: 'The starting point of awakening memories. From the poetic West Lake to the modern Qianjiang New Town, feel the blend of ancient culture and future tech.' },
  { id: '2', name: 'Beijing', englishName: 'Beijing', continent: 'China', x: 82.33, y: 27.83, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Skyline_of_Beijing_CBD_with_B-5906_approaching_%2820211016171955%29_%281%29.jpg/1280px-Skyline_of_Beijing_CBD_with_B-5906_approaching_%2820211016171955%29_%281%29.jpg', routes: 3, spots: 15, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'top', description: 'Ancient imperial majesty runs in sync with a modern metropolis. Traverse the historic central axis and light up the heart of Chinese civilization.' },
  { id: '3', name: 'Shanghai', englishName: 'Shanghai', continent: 'China', x: 84.8, y: 32.5, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Huangpu_Park_20124-Shanghai_%2832208802494%29.jpg/1280px-Huangpu_Park_20124-Shanghai_%2832208802494%29.jpg', routes: 3, spots: 83, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'right', description: 'Where neon lights gleam by the Huangpu River. The historic architecture and the futuristic Lujiazui skyline capture the timeless passage of eras.' },
  { id: '4', name: 'Nanjing', englishName: 'Nanjing', continent: 'China', x: 82.5, y: 31.8, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Nanjing_CBD_from_City_Wall.jpg/1280px-Nanjing_CBD_from_City_Wall.jpg', routes: 3, spots: 71, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'left', description: 'A dream of Jinling, capital of six ancient dynasties. Poetic river lantern ripples, towering mountain mausoleums, and majestic historical landscapes.' },
  { id: '5', name: 'Xi\'an', englishName: 'Xi\'an', continent: 'China', x: 80.25, y: 30.94, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/City_wall_of_Xi%27an_51550-Xian_%2827959363326%29.jpg/1280px-City_wall_of_Xi%27an_51550-Xian_%2827959363326%29.jpg', routes: 3, spots: 66, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'left', description: 'The ancient capital of Chang\'an, home of the Terracotta Army and the Great Wild Goose Pagoda. The millennium-old beginning of the legendary Silk Road.' },
  { id: '6', name: 'Tokyo', englishName: 'Tokyo', continent: 'Asia', x: 88.80, y: 30.16, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/1280px-Skyscrapers_of_Shinjuku_2009_January.jpg', routes: 3, spots: 120, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'right', description: 'Cherry blossoms, the iconic Tokyo Tower, and bustling street crossings. A super-metropolis where anime culture collides with ancient shrines.' },
  { id: '7', name: 'Paris', englishName: 'Paris', continent: 'Europe', x: 50.63, y: 22.83, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/1280px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg', routes: 3, spots: 90, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'bottom', description: 'The city of romance along the River Seine. Bask in the Eiffel Tower lights and Louvre masterpieces—the elegance and eternity of the City of Light.' },
  { id: '8', name: 'London', englishName: 'London', continent: 'Europe', x: 49.3, y: 21.0, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/1280px-London_Skyline_%28125508655%29.jpeg', routes: 3, spots: 140, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'top', description: 'Hear the toll of Big Ben echoing across the Thames. Explore West End theatres, foggy cobblestone streets, and the historic footprints of an empire.' },
  { id: '9', name: 'New York', englishName: 'New York', continent: 'North America', x: 29.44, y: 27.38, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1280px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg', routes: 3, spots: 110, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'top', description: 'The skyscrapers of the Big Apple, the endless neon glow of Times Square, and the Statue of Liberty greeting runners in the world\'s vibrant melting pot.' },
  { id: '10', name: 'Sydney', englishName: 'Sydney', continent: 'Oceania', x: 92.00, y: 68.83, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/1280px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg', routes: 3, spots: 85, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'right', description: 'The jewel of the Southern Hemisphere. Run past the sails of the Sydney Opera House and the sparkling waves of Darling Harbour.' },
  { id: '11', name: 'Rio', englishName: 'Rio', continent: 'South America', x: 38.00, y: 62.72, image: 'https://upload.wikimedia.org/wikipedia/6/62/Praia_de_Copacabana_-_Rio_de_Janeiro%2C_Brasil.jpg', routes: 3, spots: 50, completed: 0, status: 'upcoming', completedRouteIndices: [], labelPosition: 'right', description: 'Stunning bays overlooked by the Christ the Redeemer statue, the passion of Copacabana Beach, and the energetic rhythm of Samba and tropical sun.' },
  { id: '12', name: 'Cairo', englishName: 'Cairo', continent: 'Africa', x: 58.66, y: 33.33, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Cairo_Opera_House%2C_Al_Hurriyah_Park_and_the_Nile_river_%2814797782354%29.jpg/1280px-Cairo_Opera_House%2C_Al_Hurriyah_Park_and_the_Nile_river_%2814797782354%29.jpg', routes: 3, spots: 60, completed: 0, status: 'upcoming', completedRouteIndices: [], labelPosition: 'right', description: 'Ancient pyramids standing by the Nile and the thousand-year riddle of the Sphinx. Discover ancient secrets and golden desert majesty.' },
];

export const CONTINENTS_ORDER = ['China', 'Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'];

// Group cities by continent
export const CITIES_BY_CONTINENT = CITIES.reduce((acc, city) => {
  if (!acc[city.continent]) {
    acc[city.continent] = [];
  }
  acc[city.continent].push(city);
  return acc;
}, {} as Record<string, typeof CITIES>);

export interface RouteDetailConfig {
  title: string;
  distance: string;
  duration: string;
  calories: string;
  rating: string;
  spots: string;
  intro: string;
}

export const getRouteData = (cityId: string, routeIndex: number): RouteDetailConfig => {
  const city = CITIES.find(c => c.id === cityId);
  const cityName = city?.englishName || 'Unknown City';
  
  const routeConfigs: Record<string, RouteDetailConfig[]> = {
    '1': [ // Hangzhou
      { title: 'West Lake Winter Snow', distance: '3.5', duration: '25:00', calories: '210', rating: '4.9', spots: 'Broken Bridge — Bai Causeway — Autumn Moon Over Calm Lake', intro: 'Morning lakeside with gentle breezes brushing the willows. Take a run along the historic Bai Causeway to feel ancient poetic charm.' },
      { title: 'Lingyin Temple Sanctuary', distance: '4.2', duration: '40:00', calories: '320', rating: '4.8', spots: 'Lingyin Temple — Feilai Peak — Faxi Temple', intro: 'Escape the city rush and run deep into the quiet mountain forests. Renew your stride and clear your mind among towering ancient trees.' },
      { title: 'Qianjiang New Town Lights', distance: '5.0', duration: '35:00', calories: '350', rating: '4.7', spots: 'Citizen Center — City Balcony — Grand Theatre', intro: 'Run along the river embankments under the glittering night sky of Qianjiang New Town. Feel the cool river breeze and the futuristic pulse of the city.' }
    ],
    '2': [ // Beijing
      { title: 'Forbidden City Corner Tower', distance: '4.0', duration: '30:00', calories: '260', rating: '5.0', spots: 'Shenwu Gate — Corner Tower — Jingshan Front Street', intro: 'Run alongside the magnificent red walls of the Forbidden City, catching the beautiful reflection of the corner tower, blending history with modern stride.' },
      { title: 'Olympic Forest Park Green', distance: '10.0', duration: '60:00', calories: '650', rating: '4.9', spots: 'South Gate — Yangshan Mountain — Olympic Lake', intro: 'A runners\' sanctuary of lush wilderness inside Beijing. Professional tracks and changing seasonal scenery invite you to break your limits.' }
    ],
    '3': [ // Shanghai
      { title: 'Pujiang City Memories', distance: '5.2', duration: '35:00', calories: '340', rating: '4.9', spots: 'The Bund — Yu Garden — Tianzifang', intro: 'Trace the banks of the Huangpu River, weaving through historic European-style buildings and glittering skyscrapers. Experience Shanghai\'s unique modern heritage.' }
    ],
    '4': [ // Nanjing
      { title: 'Ancient Capital Journey', distance: '4.8', duration: '32:00', calories: '310', rating: '4.9', spots: 'Xuanwu Lake — Taicheng Ming City Wall — Confucius Temple', intro: 'Stroll along the historic Ming dynasty city walls overlooking Xuanwu Lake. Listen to the river poetry at Confucius Temple and soak in Nanjing\'s grand past.' }
    ],
    '5': [ // Xi'an
      { title: 'Millennium Chang\'an City Wall', distance: '6.0', duration: '40:00', calories: '390', rating: '5.0', spots: 'South Gate Yongning — East Gate Changle — Great Wild Goose Pagoda', intro: 'Run atop the fully-preserved city walls of the ancient gateway. Revisit the grand vistas of the Silk Road\'s cradle.' }
    ],
    '6': [ // Tokyo
      { title: 'Historic Streets of Asakusa', distance: '3.8', duration: '28:00', calories: '250', rating: '4.8', spots: 'Sensoji Temple — Kaminarimon Gate — Sumida Park', intro: 'Pass through the iconic red lantern of Kaminarimon, running past wooden shopfronts and cherry-blossom paths to feel Tokyo\'s nostalgic charm.' }
    ],
    '7': [ // Paris
      { title: 'Sunset on the Seine', distance: '6.5', duration: '45:00', calories: '410', rating: '5.0', spots: 'Louvre Museum — Pont Neuf — Musée d\'Orsay', intro: 'Run with the river breeze as the sunset paints the clock tower of Musée d\'Orsay in gold. Truly the most romantic run in Paris.' },
      { title: 'Eiffel Tower Stars', distance: '3.0', duration: '20:00', calories: '180', rating: '4.8', spots: 'Champ de Mars — Eiffel Tower — Trocadéro', intro: 'Sprint under the sparkling towers of the Eiffel Tower, traversing Champ de Mars. Experience the heartbeat of the City of Light.' }
    ],
    '8': [ // London
      { title: 'West End Musical Theatre Walk', distance: '2.0', duration: '15:36', calories: '169', rating: '5.0', spots: 'Royal Opera House — Covent Garden — Shaftesbury Avenue', intro: 'A trip to the West End is the local way of living. Set off from the Lyceum Theatre into the musical heart of London. Let music and art carry your stride.' },
      { title: 'Thames River Bank Wander', distance: '5.5', duration: '38:00', calories: '340', rating: '4.8', spots: 'Big Ben — London Eye — Tate Modern', intro: 'Run alongside the South Bank of the Thames, bridging the gap between classical wonders and vanguard design.' }
    ],
    '9': [ // New York
      { title: 'Liberty Island Memory Line', distance: '4.5', duration: '30:00', calories: '290', rating: '4.8', spots: 'Battery Park — Ellis Island — Statue of Liberty', intro: 'Face the brisk Hudson River wind with the Statue of Liberty raising her torch before you. This route honors centuries of global journeys.' }
    ],
    '12': [ // Cairo
      { title: 'Ancient Nile Civilization', distance: '5.0', duration: '38:00', calories: '320', rating: '4.9', spots: 'Giza Pyramids — Sphinx — Nile Valley', intro: 'Race through the shimmering golden sands of the desert, rounding the towering pyramids. Discover pharaonic secrets sleeping for three millennia.' }
    ]
  };

  const cityRoutes = routeConfigs[cityId];
  if (cityRoutes && cityRoutes[routeIndex - 1]) {
    return cityRoutes[routeIndex - 1];
  }

  // Generic fallback
  return {
    title: `${cityName} Grand Explorer Route`,
    distance: (2 + (routeIndex % 5)).toFixed(1),
    duration: `${15 + (routeIndex % 5) * 10}:00`,
    calories: `${150 + (routeIndex % 5) * 60}`,
    rating: '4.5',
    spots: `${cityName} Landmark A — ${cityName} Landmark B — ${cityName} Landmark C`,
    intro: `Dive deep into the secret corners of ${cityName} on this scenic path, grasping its unique local customs and breathtaking views.`
  };
};
