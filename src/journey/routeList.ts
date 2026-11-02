import type { RouteCategory } from '../data/routeCategories';

const CATEGORY_ORDER: RouteCategory[] = ["Nature", "History", "Culture", "Local Life"];

export function groupCityRoutes<T extends {category:RouteCategory}>(routes:readonly T[]) {
  return CATEGORY_ORDER.map(category=>({category,routes:routes.filter(route=>route.category===category)}))
    .filter(group=>group.routes.length>0);
}

export function findVisibleRouteGroup<T extends string>(groups:readonly {category:T;top:number}[],readingLine:number,atBottom=false):T|null {
  if(!groups.length)return null;
  if(atBottom)return groups[groups.length-1].category;
  let current=groups[0].category;
  for(const group of groups){if(group.top>readingLine+4)break;current=group.category;}
  return current;
}
