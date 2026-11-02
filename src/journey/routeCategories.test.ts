import test from 'node:test';
import assert from 'node:assert/strict';
import { JOURNEY_CITIES } from './data';
import { getRouteCategory, ROUTE_CATEGORIES } from '../data/routeCategories';

test('every city route has an explicitly configured category', () => {
  const validCategories = new Set(["Nature", "History", "Culture", "Local Life"]);
  for (const city of JOURNEY_CITIES) {
    assert.equal(ROUTE_CATEGORIES[city.name]?.length, city.routes.length, city.name);
    for (const route of city.routes) {
      assert.ok(validCategories.has(getRouteCategory(city.name, route.order)), route.name);
    }
  }
});

test('categories reflect landmarks rather than a repeated route-number pattern', () => {
  assert.equal(getRouteCategory("Tokyo", 1), "History");
  assert.equal(getRouteCategory("Tokyo", 2), "Nature");
  assert.equal(getRouteCategory("Tokyo", 6), "Local Life");
  assert.equal(getRouteCategory("Tokyo", 7), "Culture");
  assert.equal(getRouteCategory('Sydney', 6), 'Nature');
  assert.equal(getRouteCategory("Paris", 1), "Culture");
});
