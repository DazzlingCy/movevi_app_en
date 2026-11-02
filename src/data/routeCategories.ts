export type RouteCategory = 'Nature' | 'History' | 'Culture' | 'Local Life';

const ROUTE_CATEGORIES: Record<string, readonly RouteCategory[]> = {
  Hangzhou: ['Nature', 'Nature', 'Nature', 'History', 'Local Life', 'Local Life', 'Local Life', 'History', 'Nature', 'Nature'],
  Beijing: ['History', 'History', 'History', 'Nature', 'Nature', 'History', 'Nature', 'History', 'Local Life', 'History'],
  Shanghai: ['History', 'Local Life', 'Nature', 'Nature', 'History', 'History', 'Culture', 'Local Life', 'Local Life', 'Nature'],
  "Xi'an": ['History', 'History', 'History', 'Nature', 'Culture', 'Local Life', 'History', 'History', 'Nature', 'History'],
  Tokyo: ['History', 'Nature', 'History', 'Nature', 'Culture', 'Local Life', 'Culture', 'Local Life', 'Nature', 'Local Life'],
  Paris: ['Culture', 'Nature', 'History', 'Nature', 'Culture', 'Local Life', 'Culture', 'History', 'Local Life', 'Nature'],
  London: ['History', 'Nature', 'History', 'Nature', 'Culture', 'Local Life', 'Culture', 'Local Life', 'Nature', 'Nature'],
  'New York': ['History', 'Nature', 'Nature', 'Nature', 'Local Life', 'Local Life', 'Culture', 'History', 'Local Life', 'Local Life'],
  Sydney: ['Culture', 'Local Life', 'History', 'Nature', 'History', 'Nature', 'Culture', 'Local Life', 'Nature', 'Nature'],
  'Rio de Janeiro': ['Nature', 'Nature', 'Nature', 'Nature', 'Culture', 'Local Life', 'Culture', 'Culture', 'Nature', 'Nature'],
  Cairo: ['History', 'Nature', 'History', 'Nature', 'History', 'Local Life', 'Culture', 'Local Life', 'History', 'Nature'],
  Bangkok: ['History', 'Nature', 'History', 'Nature', 'Local Life', 'Local Life', 'Culture', 'Local Life', 'History', 'Nature'],
  Mumbai: ['History', 'Nature', 'History', 'Nature', 'Local Life', 'Local Life', 'Culture', 'Local Life', 'Nature', 'Nature'],
  Singapore: ['Culture', 'Nature', 'Nature', 'Nature', 'Culture', 'Culture', 'Culture', 'Local Life', 'Nature', 'Nature'],
  Moscow: ['History', 'Nature', 'History', 'Nature', 'Local Life', 'Nature', 'Culture', 'Local Life', 'Nature', 'Local Life'],
  'Los Angeles': ['Culture', 'Nature', 'Culture', 'Nature', 'Local Life', 'Culture', 'Culture', 'Local Life', 'Nature', 'Nature'],
  Rome: ['History', 'Nature', 'History', 'Nature', 'Local Life', 'History', 'Culture', 'History', 'History', 'History'],
  Dubai: ['Local Life', 'Nature', 'Culture', 'Nature', 'History', 'Local Life', 'Culture', 'Local Life', 'Local Life', 'Nature'],
  Berlin: ['History', 'Nature', 'Culture', 'Nature', 'Local Life', 'Culture', 'Culture', 'Local Life', 'History', 'Local Life'],
  Toronto: ['Local Life', 'Nature', 'History', 'Nature', 'Local Life', 'Local Life', 'Culture', 'Local Life', 'Nature', 'Nature'],
};

export function getRouteCategory(cityName: string, routeOrder: number): RouteCategory {
  return ROUTE_CATEGORIES[cityName]?.[routeOrder - 1] ?? 'Local Life';
}

export { ROUTE_CATEGORIES };
