import test from "node:test";
import assert from "node:assert/strict";

import {
  DETAIL_ROUTE_TEMPLATE,
  FOOTER_COPY,
  getRentEquipmentView,
} from "../lib/discovery-routes.js";

test("getRentEquipmentView returns available for the base discovery page", () => {
  assert.equal(getRentEquipmentView({ query: "", hasMatches: true }), "available");
  assert.equal(getRentEquipmentView({ query: undefined, hasMatches: true }), "available");
});

test("getRentEquipmentView returns query-category for successful query searches", () => {
  assert.equal(getRentEquipmentView({ query: "tractors", hasMatches: true }), "query-category");
  assert.equal(getRentEquipmentView({ query: "harvesters", hasMatches: true }), "query-category");
});

test("getRentEquipmentView returns empty for no-result query searches", () => {
  assert.equal(getRentEquipmentView({ query: "trolleys", hasMatches: false }), "empty");
  assert.equal(getRentEquipmentView({ query: "anything", hasMatches: false }), "empty");
});

test("discovery route constants match the approved shared routes", () => {
  assert.equal(DETAIL_ROUTE_TEMPLATE("4"), "/equipment/4");
  assert.deepEqual(FOOTER_COPY, {
    left: "© 2026 Kisan Kamai. All rights reserved.",
    right: "Built with ❤️ for Bharat.",
  });
});
