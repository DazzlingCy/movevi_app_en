export type CityStatus = 'unlit' | 'in-progress' | 'lit' | 'upcoming';
export type LabelPosition = 'top' | 'bottom' | 'left' | 'right';

export interface RouteCompletionStats {
  completedAt: number;
  distance: number;
  durationSeconds: number;
  calories: number;
  lightValueEarned: number;
}

export interface CityData {
  id: string;
  name: string;
  englishName: string;
  continent: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  image: string;
  routes: number;
  spots: number;
  completed: number;
  status: CityStatus;
  completedRouteIndices?: number[];
  completedRouteTimestamps?: Record<number, number>;
  completedRouteStats?: Record<number, RouteCompletionStats>;
  justLit?: boolean;
  labelPosition?: LabelPosition;
  description?: string;
}

export const CITIES: CityData[] = [
  { id: '1', name: "Hangzhou", englishName: 'Hangzhou', continent: "China", x: 83.5, y: 33.8, lat: 30.2741, lng: 120.1551, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/%E6%9D%AD%E5%B7%9E%E9%92%B1%E6%B1%9F%E6%96%B0%E5%9F%8E_4_%28cropped%29.jpg/1280px-%E6%9D%AD%E5%B7%9E%E9%92%B1%E6%B1%9F%E6%96%B0%E5%9F%8E_4_%28cropped%29.jpg', routes: 3, spots: 24, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'bottom', description: "The starting point for the awakening of memory is the convergence of civilization and technology between Lake Wanjosi and the new city of the modern Changang." },
  { id: '2', name: "Beijing", englishName: 'Beijing', continent: "China", x: 82.33, y: 27.83, lat: 39.9042, lng: 116.4074, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Skyline_of_Beijing_CBD_with_B-5906_approaching_%2820211016171955%29_%281%29.jpg/1280px-Skyline_of_Beijing_CBD_with_B-5906_approaching_%2820211016171955%29_%281%29.jpg', routes: 3, spots: 15, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'top', description: "The city's roots are thick and the pulse of modern cities is the same, passing through the mid-axis of ancient times and lighting the heart of the Huai summer civilization." },
  { id: '3', name: "Shanghai", englishName: 'Shanghai', continent: "China", x: 84.8, y: 32.5, lat: 31.2304, lng: 121.4737, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Huangpu_Park_20124-Shanghai_%2832208802494%29.jpg/1280px-Huangpu_Park_20124-Shanghai_%2832208802494%29.jpg', routes: 3, spots: 83, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'right', description: "The neon of the demons flashed, and the world of buildings by the Yellow River and the skyline of Lu's mouth spoke of the new and old luxurious." },
  { id: '5', name: "Xi'an", englishName: 'Xi\'an', continent: "China", x: 80.25, y: 30.94, lat: 34.3416, lng: 108.9398, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/City_wall_of_Xi%27an_51550-Xian_%2827959363326%29.jpg/1280px-City_wall_of_Xi%27an_51550-Xian_%2827959363326%29.jpg', routes: 3, spots: 66, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'left', description: "The 13th Dynasty of the Great City of Goodu, the shock of the soldiers and the sound of the Goose Tower, passed the beginning of the silk line of the millennium." },
  { id: '6', name: "Tokyo", englishName: 'Tokyo', continent: "Other Asia", x: 88.80, y: 30.16, lat: 35.6762, lng: 139.6503, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/1280px-Skyscrapers_of_Shinjuku_2009_January.jpg', routes: 3, spots: 120, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'right', description: "The cherry blossoms, the iron towers and the noisy cross streets, the secondary dimension colliding with tradition, seek lost neon memories in this super-city." },
  { id: '7', name: "Paris", englishName: 'Paris', continent: "Europe", x: 50.63, y: 22.83, lat: 48.8566, lng: 2.3522, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/1280px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg', routes: 3, spots: 90, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'bottom', description: "On the side of the Seine of the romantic capital, the starlight of the Eiffel Tower, the art treasure of the Louvre, the grace and eternality of the City of Light." },
  { id: '8', name: "London", englishName: 'London', continent: "Europe", x: 49.3, y: 21.0, lat: 51.5072, lng: -0.1276, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/1280px-London_Skyline_%28125508655%29.jpeg', routes: 3, spots: 140, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'top', description: "The bells of the Thames echo, the dramatic life of the West Side, the mystery of fog and gentlemanry, and the light of the rising empire." },
  { id: '9', name: "New York", englishName: 'New York', continent: "North America", x: 29.44, y: 27.38, lat: 40.7128, lng: -74.006, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1280px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg', routes: 3, spots: 110, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'top', description: "The skyscrapers of Grand Apple, the forest of skyscrapers, the raging city of Times Square, the torch of the Lady of Liberty, and the infinite vitality of the melting furnace of the world." },
  { id: '10', name: "Sydney", englishName: 'Sydney', continent: "Oceania", x: 92.00, y: 68.83, lat: -33.8688, lng: 151.2093, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/1280px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg', routes: 3, spots: 85, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'right', description: "Myon of the Southern Hemisphere, a sail from the Sydney Opera, a Bibipo film from Darwyn Port, sunshine and beaches from Oceania." },
  { id: '11', name: "Rio de Janeiro", englishName: 'Rio', continent: "South America", x: 38.00, y: 62.72, lat: -22.9068, lng: -43.1729, image: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Praia_de_Copacabana_-_Rio_de_Janeiro%2C_Brasil.jpg', routes: 3, spots: 50, completed: 0, status: 'upcoming', completedRouteIndices: [], labelPosition: 'right', description: "Christ is like the super-American bay overlooking, the passion of Copacabana Beach, the samba carnival, the freedom of the tropical rainforest." },
  { id: '12', name: "Cairo", englishName: 'Cairo', continent: "Africa", x: 58.66, y: 33.33, lat: 30.0444, lng: 31.2357, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Cairo_Opera_House%2C_Al_Hurriyah_Park_and_the_Nile_river_%2814797782354%29.jpg/1280px-Cairo_Opera_House%2C_Al_Hurriyah_Park_and_the_Nile_river_%2814797782354%29.jpg', routes: 3, spots: 60, completed: 0, status: 'upcoming', completedRouteIndices: [], labelPosition: 'right', description: "The ancient pyramids on the Nile, the ancient puzzles of the Sphinx, the mystery of the ancient civilization and the faith in the yellow sand." },
  { id: '13', name: "Bangkok", englishName: 'Bangkok', continent: "Other Asia", x: 76.8, y: 45.2, lat: 13.7563, lng: 100.5018, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Wat_Arun_Bangkok_Thailand.jpg/1280px-Wat_Arun_Bangkok_Thailand.jpg', routes: 3, spots: 72, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'bottom', description: "The Golden Temple on the Mekong River, the Night City pyrotechnics and the tropical streets are intertwined and run into Bangkok's waterfront memory and urban pulse." },
  { id: '14', name: "Mumbai", englishName: 'Mumbai', continent: "Other Asia", x: 70.8, y: 41.2, lat: 19.076, lng: 72.8777, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gateway_of_India_%28cropped%29.jpg/1280px-Gateway_of_India_%28cropped%29.jpg', routes: 3, spots: 88, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'left', description: "The Arabian sea wind has swept through the Indian Gate and the Coastal Avenue, and Mumbai has flashed light in colonial buildings, film dreams and urban wells." },
  { id: '15', name: "Singapore", englishName: 'Singapore', continent: "Other Asia", x: 78.4, y: 51.2, lat: 1.3521, lng: 103.8198, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1200', routes: 3, spots: 65, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'right', description: "The skylines of the bay, the greens of the garden city intersect with the rhythms of the seaports, running through a fine and living tropical metropolis." },
  { id: '16', name: "Moscow", englishName: 'Moscow', continent: "Europe", x: 59.5, y: 19.4, lat: 55.7558, lng: 37.6173, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Moscow_July_2011-7a.jpg/1280px-Moscow_July_2011-7a.jpg', routes: 3, spots: 96, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'top', description: "The red field's red echo, the church dome and the cold light of the Moscow River form a thick northern route." },
  { id: '17', name: "Los Angeles", englishName: 'Los Angeles', continent: "North America", x: 18.2, y: 34.8, lat: 34.0522, lng: -118.2437, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Los_Angeles%2C_Winter_2016.jpg/1280px-Los_Angeles%2C_Winter_2016.jpg', routes: 3, spots: 105, completed: 0, status: 'unlit', completedRouteIndices: [], labelPosition: 'bottom', description: "From the Hollywood Hills to the Pacific Coast, Los Angeles wrote film shadows, palm lanes and free running into urban memory." },
];

export const CONTINENTS_ORDER = ["China", "Other Asia", "Europe", "Africa", "North America", "South America", "Oceania"];

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
  const cityName = city?.name || "Unknown City";
  
  const routeConfigs: Record<string, RouteDetailConfig[]> = {
    '1': [ // 杭州
      { title: "West Lake's broken snow.", distance: '3.5', duration: '25:00', calories: '210', rating: '4.9', spots: "Breaking the bridge - White dyke - Lake Ping's autumn moon", intro: "By the west lake in the morning, the breeze willows. This route leads you down the white dyke, feeling the ancient poetry of \"water is fine.\"" },
      { title: "\"The ghost of the shadow of the shadow.\"", distance: '4.2', duration: '40:00', calories: '320', rating: '4.8', spots: "The Temple of Invisibility - Flying Peak - Fah-hye Temple", intro: "Far from the city's noise, deep into the mountains, and breathe fresh air in the ancient trees, so that the footsteps and the hearts can be empty." },
      { title: "Chan Gang's New City Night Light", distance: '5.0', duration: '35:00', calories: '350', rating: '4.7', spots: "Citizen Centers - Urban balcony - The Great Theatre", intro: "At night, the New City of the Money River was a shining light, running along the embankment, and looking at the modern city's luxuries and the enchanting of the river." }
    ],
    '2': [ // 北京
      { title: "So the palace is a shadow.", distance: '4.0', duration: '30:00', calories: '260', rating: '5.0', spots: "Shin Moo-man, corner building, front street of the Mt.", intro: "Run along the red wall of the Forbidden City, traveling through the reflection of the corner building, and feel centuries of historical weight and the collision of modern energy." },
      { title: "Orson has no limit to green.", distance: '10.0', duration: '60:00', calories: '650', rating: '4.9', spots: "South Garden Gate - Mount Zhang - Lake Olympia", intro: "Beijing Runners' Sanctuary, 10,000 acres of forest oxygen. The four seasons of landscapes, flat and professional plastic runways, make you sweat." }
    ],
    '3': [ // 上海
      { title: "It's a city memory.", distance: '5.2', duration: '35:00', calories: '340', rating: '4.9', spots: "Outside beach — Regarding Garden — Field House", intro: "Along the Yellow River, we travel between the old buildings of the sea and the luxuries of the city. We feel the unique years and the city's memories in Shanghai in the sea of the Rocks." }
    ],
    '5': [ // 西安
      { title: "The Wall of the Millennium Wall", distance: '6.0', duration: '40:00', calories: '390', rating: '5.0', spots: "South Gate Yongning Gate - East Gate Chang Men - Goose Tower", intro: "Run on the entire walls of the 13th-Dawd al-Agudu and return to the ancient Angudu, the ancient city, to feel the millennium mark of the beginning of the silk road." }
    ],
    '6': [ // 东京
      { title: "Asakusa, Old Yagura Street.", distance: '3.8', duration: '28:00', calories: '250', rating: '4.8', spots: "Asakusa Temple - Raymond - Sakadagawa Park", intro: "Through the thundergates with huge red lanterns, running in the alleys under the woody old house and the cherry tree, the charisma of the traditional times is felt." }
    ],
    '7': [ // 巴黎
      { title: "The sunset on the Seine.", distance: '6.5', duration: '45:00', calories: '410', rating: '5.0', spots: "Louvre - New Bridge - Osei Museum", intro: "In the breeze of the Seine River, the sun's after-effects were spilling over the bells of the Osei Museum, a romantic run-off unique to Paris." },
      { title: "Iron Tower Star Light", distance: '3.0', duration: '20:00', calories: '180', rating: '4.8', spots: "War God Square - Eiffel Tower - Shiwa Palace", intro: "Run under the twinkled iron tower, through the lawn of the War God Square, and feel the pulse of the heart of the city." }
    ],
    '8': [ // 伦敦
      { title: "We're going to the west side.", distance: '2.0', duration: '15:36', calories: '169', rating: '5.0', spots: "The Royal Opera, Corwint Garden, Shaftsbury Street.", intro: "Seeing a great performance in the West is the most natural way of life for Londoners. Starting from the Lacym Theatre, they set foot in the heart of the musical show, the West Side of London. This route leads you to London's music and love." },
      { title: "The Thames strolls.", distance: '5.5', duration: '38:00', calories: '340', rating: '4.8', spots: "Big Ben -- London Eye -- The Tet Modern Gallery.", intro: "Along the southern bank of the Thames, between classical and modern architecture, the city is feeling its weight and its new life." }
    ],
    '9': [ // 纽约
      { title: "Free Island Memory Line", distance: '4.5', duration: '30:00', calories: '290', rating: '4.8', spots: "Gunfire Park, Ellis Island, Statue of Liberty.", intro: "In the cold wind of the Hudson River, the flames of the goddess of liberty are high. This route records the century of the age of immigration." }
    ],
    '12': [ // 开罗
      { title: "The Nile River Civilization", distance: '5.0', duration: '38:00', calories: '320', rating: '4.9', spots: "Giza Pyramids - Sphinx - Nile Valley", intro: "Run in the old yellow sands of golden light, groaning around the pyramids of vision, and searching for the holy pictural text and pharaoh secrets that lie for three thousand years." }
    ]
  };

  const cityRoutes = routeConfigs[cityId];
  if (cityRoutes && cityRoutes[routeIndex - 1]) {
    return cityRoutes[routeIndex - 1];
  }

  // Generic fallback
  return {
    title: `${cityName}Depth exploration route`,
    distance: (2 + (routeIndex % 5)).toFixed(1),
    duration: `${15 + (routeIndex % 5) * 10}:00`,
    calories: `${150 + (routeIndex % 5) * 60}`,
    rating: '4.5',
    spots: `${cityName}Groundmark A--${cityName}Groundmark B -${cityName}Site C`,
    intro: `Through this route, we'll explore.${cityName}In the corner of the city, it feels a unique geographical and human landscape.`
  };
};
