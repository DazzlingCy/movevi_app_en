import test from 'node:test';
import assert from 'node:assert/strict';
import { findVisibleRouteGroup, groupCityRoutes, isSequentialRouteUnlocked } from './routeList';
import type { RouteCategory } from '../data/routeCategories';

test('category groups show every route once and preserve original route order and identity',()=>{
  const types:RouteCategory[]=["Local Life","Nature","History","Nature","Culture","History"];
  const routes=types.map((category,index)=>({category,routeId:index+1}));
  const original=JSON.stringify(routes),groups=groupCityRoutes(routes);
  assert.deepEqual(groups.map(group=>group.category),["Nature","History","Culture","Local Life"]);
  assert.deepEqual(groups.map(group=>group.routes.map(route=>route.routeId)),[[2,4],[3,6],[5],[1]]);
  assert.equal(new Set(groups.flatMap(group=>group.routes)).size,routes.length);
  assert.equal(JSON.stringify(routes),original);
});

test('empty categories do not create tabs or empty route sections',()=>{
  assert.deepEqual(groupCityRoutes([]),[]);
  const route={category:"Culture" as const,routeId:9};
  assert.deepEqual(groupCityRoutes([route]),[{category:"Culture",routes:[route]}]);
});

test('route cards unlock only after every earlier route is complete',()=>{
  assert.equal(isSequentialRouteUnlocked(1, []), true);
  assert.equal(isSequentialRouteUnlocked(2, []), false);
  assert.equal(isSequentialRouteUnlocked(2, [1]), true);
  assert.equal(isSequentialRouteUnlocked(4, [1, 3], true), false);
  assert.equal(isSequentialRouteUnlocked(4, [1, 2, 3], true), true);
  assert.equal(isSequentialRouteUnlocked(4, [1, 2, 3], false), false);
  assert.equal(isSequentialRouteUnlocked(4, [1, 2, 3, 4], false), true);
  assert.equal(isSequentialRouteUnlocked(5, [1, 2, 3, 4], true, 4), false);
});

test('scroll highlight tracks the section below navigation and reaches the last short group',()=>{
  const sections=[{category:"Nature",top:100},{category:"History",top:500},{category:"Culture",top:900},{category:"Local Life",top:1300}];
  assert.equal(findVisibleRouteGroup(sections,0),"Nature");
  assert.equal(findVisibleRouteGroup(sections,132),"Nature");
  assert.equal(findVisibleRouteGroup(sections,498),"History");
  assert.equal(findVisibleRouteGroup(sections,750),"History");
  assert.equal(findVisibleRouteGroup(sections,905),"Culture");
  assert.equal(findVisibleRouteGroup(sections,1100,true),"Local Life");
  assert.equal(findVisibleRouteGroup([],132),null);
});
