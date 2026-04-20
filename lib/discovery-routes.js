/**
 * @typedef {"available" | "query-category" | "empty"} RentEquipmentView
 */

export const FOOTER_COPY = {
  left: "© 2026 Kisan Kamai. All rights reserved.",
  right: "Built with ❤️ for Bharat.",
};

/**
 * @param {string} equipmentId
 */
export function DETAIL_ROUTE_TEMPLATE(equipmentId) {
  return `/equipment/${equipmentId}`;
}

/**
 * @param {{ query?: string | null; hasMatches: boolean }} options
 * @returns {RentEquipmentView}
 */
export function getRentEquipmentView({ query, hasMatches }) {
  const normalizedQuery = query?.trim() || "";

  if (!normalizedQuery) {
    return "available";
  }

  return hasMatches ? "query-category" : "empty";
}
