(() => {
  const data = globalThis.SITE_MAP_DATA;
  const annotations = globalThis.SITE_MAP_ANNOTATIONS || {};

  if (!data) {
    throw new Error("SITE_MAP_DATA is missing. Open map-data.js before viewer.js.");
  }

  const SVG_NS = "http://www.w3.org/2000/svg";
  const VIEWBOX = { width: 2800, height: 1800 };

  const GROUP_META = {
    public: { label: "Public", center: [360, 320], color: "var(--public)" },
    discovery: { label: "Discovery", center: [1040, 320], color: "var(--discovery)" },
    auth: { label: "Auth", center: [1700, 320], color: "var(--auth)" },
    owner: { label: "Owner", center: [2380, 320], color: "var(--owner)" },
    components: { label: "Components", center: [360, 1020], color: "var(--components)" },
    renter: { label: "Renter", center: [1040, 1020], color: "var(--renter)" },
    support: { label: "Support", center: [1700, 1020], color: "var(--support)" },
    flow: { label: "Logic", center: [2380, 1020], color: "var(--flow)" },
    external: { label: "External", center: [700, 1510], color: "var(--external)" },
    missing: { label: "Missing", center: [1460, 1510], color: "var(--missing)" },
    goal: { label: "Goal", center: [2220, 1510], color: "var(--goal)" }
  };

  const EDGE_META = {
    "internal-link": { label: "Internal Link", color: "var(--accent)", dash: "", opacity: 0.62 },
    redirect: { label: "Redirect", color: "var(--accent-2)", dash: "", opacity: 0.76 },
    conditional: { label: "Conditional", color: "var(--owner)", dash: "8 8", opacity: 0.78 },
    inferred: { label: "Inferred", color: "var(--support)", dash: "6 8", opacity: 0.74 },
    "external-link": { label: "External Link", color: "var(--external)", dash: "4 8", opacity: 0.84 },
    placeholder: { label: "Placeholder", color: "var(--missing)", dash: "2 7", opacity: 0.84 },
    journey: { label: "Journey Flow", color: "var(--goal)", dash: "", opacity: 0.92 }
  };

  const NODE_TYPE_LABELS = {
    page: "Page",
    "shared-component": "Shared Component",
    "external-destination": "External Destination",
    "missing-route": "Missing Route",
    "flow-node": "Flow Node"
  };

  const THEME_STORAGE_KEY = "kisan-kamai-site-map-theme";
  const PERSPECTIVE_STORAGE_KEY = "kisan-kamai-site-map-perspective";
  const LENS_STORAGE_KEY = "kisan-kamai-site-map-lens";
  const BASE_URL_STORAGE_KEY = "kisan-kamai-site-map-base-url";
  const JOURNEY_INCLUDE_EDGE_TYPES = new Set(["internal-link", "redirect", "conditional", "inferred"]);
  const DEFAULT_LENS = Object.keys(annotations.journeyLenses || {})[0] || null;

  const elements = {
    themeSwitcher: document.getElementById("theme-switcher"),
    perspectiveSwitcher: document.getElementById("perspective-switcher"),
    lensStrip: document.getElementById("lens-strip"),
    lensSwitcher: document.getElementById("lens-switcher"),
    lensSummary: document.getElementById("lens-summary"),
    searchInput: document.getElementById("search-input"),
    baseUrlInput: document.getElementById("base-url-input"),
    resetViewButton: document.getElementById("reset-view-button"),
    fitGraphButton: document.getElementById("fit-graph-button"),
    clearSearchButton: document.getElementById("clear-search-button"),
    statCards: document.getElementById("stat-cards"),
    graphModeSummary: document.getElementById("graph-mode-summary"),
    graphMeta: document.getElementById("graph-meta"),
    groupFilters: document.getElementById("group-filters"),
    edgeFilters: document.getElementById("edge-filters"),
    legendList: document.getElementById("legend-list"),
    graphModeBadge: document.getElementById("graph-mode-badge"),
    graphTitle: document.getElementById("graph-title"),
    graphDescription: document.getElementById("graph-description"),
    graphSvg: document.getElementById("graph-svg"),
    graphBackground: document.getElementById("graph-background"),
    graphViewport: document.getElementById("graph-viewport"),
    groupLayer: document.getElementById("group-layer"),
    edgeLayer: document.getElementById("edge-layer"),
    nodeLayer: document.getElementById("node-layer"),
    detailsPanel: document.getElementById("details-panel")
  };

  const state = {
    selectedNodeId: null,
    search: "",
    groupFilters: new Set(),
    edgeFilters: new Set(),
    matchedNodeIds: new Set(),
    visibleNodeIds: new Set(),
    transform: { x: 0, y: 0, scale: 1 },
    dragging: false,
    dragOrigin: null,
    themePreference: localStorage.getItem(THEME_STORAGE_KEY) || "system",
    perspective: localStorage.getItem(PERSPECTIVE_STORAGE_KEY) || "structure",
    lens: localStorage.getItem(LENS_STORAGE_KEY) || DEFAULT_LENS,
    graphKey: "",
    positions: new Map()
  };

  if (!annotations.journeyLenses?.[state.lens]) {
    state.lens = DEFAULT_LENS;
  }

  const themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const structuralGraph = buildStructureGraph();

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createOrigin(file, line, raw, context) {
    return { file, line, raw, context };
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function nodeTypeLabel(type) {
    return NODE_TYPE_LABELS[type] || type;
  }

  function getThemeButtons() {
    return [...elements.themeSwitcher.querySelectorAll("[data-theme-mode]")];
  }

  function getPerspectiveButtons() {
    return [...elements.perspectiveSwitcher.querySelectorAll("[data-perspective]")];
  }

  // BUILDERS

  function buildStructureGraph() {
    const nodes = data.nodes.map(clone);
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    for (const extraNode of annotations.extraNodes || []) {
      if (!nodeMap.has(extraNode.id)) {
        const node = clone(extraNode);
        node.notes = Array.isArray(node.notes) ? node.notes : [];
        nodes.push(node);
        nodeMap.set(node.id, node);
      }
    }

    for (const [nodeId, note] of Object.entries(annotations.nodeNotes || {})) {
      const node = nodeMap.get(nodeId);
      if (!node) {
        continue;
      }
      node.notes = Array.isArray(node.notes) ? node.notes : [];
      if (!node.notes.includes(note)) {
        node.notes.push(note);
      }
    }

    const edges = data.edges.map((edge) => {
      const copy = clone(edge);
      copy.origins = Array.isArray(copy.origins) ? copy.origins : [];
      return copy;
    });

    (annotations.extraEdges || []).forEach((edge, index) => {
      const copy = clone(edge);
      copy.id = copy.id || `annotation-edge-${index + 1}`;
      copy.origins = Array.isArray(copy.origins) && copy.origins.length
        ? copy.origins
        : [createOrigin("docs/site-map/annotations.js", null, copy.label || `${copy.source} -> ${copy.target}`, "annotation")];
      edges.push(copy);
    });

    return {
      key: "structure",
      mode: "structure",
      badge: "Structure Map",
      title: "Site Structure Map",
      description:
        "Full relationship graph of pages, shared navigation surfaces, redirects, external links, and inferred logic.",
      nodes,
      edges
    };
  }

  function mergeEdges(edges) {
    const merged = new Map();

    edges.forEach((edge, index) => {
      const copy = clone(edge);
      copy.id = copy.id || `edge-${index + 1}`;
      copy.origins = Array.isArray(copy.origins) ? copy.origins : [];
      const key = [copy.source, copy.target, copy.type, copy.label || "", copy.description || ""].join("|");

      if (!merged.has(key)) {
        merged.set(key, copy);
        return;
      }

      const current = merged.get(key);
      current.origins.push(...copy.origins);
    });

    return [...merged.values()];
  }

  function buildJourneyGraph(lensKey) {
    const lens = annotations.journeyLenses?.[lensKey];
    if (!lens) {
      return structuralGraph;
    }

    const sourceNodeMap = new Map(structuralGraph.nodes.map((node) => [node.id, node]));
    const nodes = [];
    const added = new Set();
    const stageNodeIds = {};

    lens.stages.forEach((stage, stageIndex) => {
      stageNodeIds[stage.id] = [];

      (stage.nodeIds || []).forEach((nodeId) => {
        const sourceNode = sourceNodeMap.get(nodeId);
        if (!sourceNode) {
          return;
        }
        if (!added.has(nodeId)) {
          const node = clone(sourceNode);
          node.journeyStage = stage.id;
          node.journeyStageIndex = stageIndex;
          nodes.push(node);
          added.add(nodeId);
        }
        stageNodeIds[stage.id].push(nodeId);
      });

      (stage.nodes || []).forEach((inlineNode) => {
        if (added.has(inlineNode.id)) {
          return;
        }
        const node = clone(inlineNode);
        node.notes = Array.isArray(node.notes) ? node.notes : [];
        node.journeyStage = stage.id;
        node.journeyStageIndex = stageIndex;
        nodes.push(node);
        added.add(node.id);
        stageNodeIds[stage.id].push(node.id);
      });
    });

    const included = new Set(nodes.map((node) => node.id));
    const edges = structuralGraph.edges
      .filter((edge) => JOURNEY_INCLUDE_EDGE_TYPES.has(edge.type) && included.has(edge.source) && included.has(edge.target))
      .map(clone);

    (lens.extraEdges || []).forEach((edge, index) => {
      const copy = clone(edge);
      copy.id = copy.id || `${lensKey}-edge-${index + 1}`;
      copy.origins = Array.isArray(copy.origins) && copy.origins.length
        ? copy.origins
        : [createOrigin("docs/site-map/annotations.js", null, copy.label || `${copy.source} -> ${copy.target}`, "journey")];
      edges.push(copy);
    });

    return {
      key: `journey:${lensKey}`,
      mode: "journey",
      badge: "Journey Lens",
      title: lens.label,
      description: lens.description,
      lensKey,
      lens,
      stageNodeIds,
      nodes,
      edges: mergeEdges(edges)
    };
  }

  function getCurrentGraph() {
    if (state.perspective === "journey" && state.lens) {
      return buildJourneyGraph(state.lens);
    }
    return structuralGraph;
  }

  function syncGraphState(graph) {
    if (state.graphKey !== graph.key) {
      state.graphKey = graph.key;
      state.groupFilters = new Set(graph.nodes.map((node) => node.group).filter(Boolean));
      state.edgeFilters = new Set(graph.edges.map((edge) => edge.type).filter(Boolean));
      state.selectedNodeId = null;
    }

    if (!graph.nodes.some((node) => node.id === state.selectedNodeId)) {
      state.selectedNodeId = null;
    }
  }

  // THEME + URL HELPERS

  function resolveActualTheme() {
    if (state.themePreference === "system") {
      return themeMediaQuery.matches ? "dark" : "light";
    }
    return state.themePreference;
  }

  function applyTheme() {
    document.documentElement.dataset.theme = resolveActualTheme();
    getThemeButtons().forEach((button) => {
      button.classList.toggle("is-active", button.dataset.themeMode === state.themePreference);
    });
  }

  function getBaseUrl() {
    const fallback = data.defaultBaseUrl || "http://localhost:3000";
    const raw = (elements.baseUrlInput.value || fallback).trim();
    return raw.replace(/\/+$/, "");
  }

  function getNodeHref(node) {
    if (!node) {
      return null;
    }

    if (node.type === "external-destination" && node.target) {
      return node.target;
    }

    if (node.type === "page" && node.route) {
      const baseUrl = getBaseUrl();
      return node.route === "/" ? baseUrl : `${baseUrl}${node.route}`;
    }

    return null;
  }

  function isNodeOpenable(node) {
    return Boolean(getNodeHref(node));
  }

  function getNodeDimensions(node) {
    const routeLike = node.route || node.target || "";
    const width = Math.max(228, Math.min(350, 188 + node.label.length * 6 + routeLike.length * 2.2));
    const height = node.type === "shared-component" ? 88 : node.type === "external-destination" ? 92 : 104;
    return { width, height };
  }

  function nodeSearchText(node) {
    return [
      node.label,
      node.route,
      node.target,
      node.description,
      ...(node.files || []),
      ...(node.notes || [])
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function edgeSearchText(edge) {
    return [
      edge.label,
      edge.description,
      ...(edge.origins || []).flatMap((origin) => [origin.file, origin.raw, origin.context])
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function getGroupColor(group) {
    return GROUP_META[group]?.color || "var(--accent)";
  }

  function getMatchedNodeIds(graph) {
    const term = state.search.trim().toLowerCase();
    const matches = new Set();

    if (!term) {
      return matches;
    }

    graph.nodes.forEach((node) => {
      if (nodeSearchText(node).includes(term)) {
        matches.add(node.id);
      }
    });

    graph.edges.forEach((edge) => {
      if (edgeSearchText(edge).includes(term)) {
        matches.add(edge.source);
        matches.add(edge.target);
      }
    });

    return matches;
  }

  // FILTERS + LAYOUT

  function getVisibleNodes(graph) {
    const searchActive = Boolean(state.search.trim());
    const directMatches = getMatchedNodeIds(graph);
    const contextualMatches = new Set(directMatches);

    if (searchActive) {
      graph.edges.forEach((edge) => {
        if (directMatches.has(edge.source) || directMatches.has(edge.target)) {
          contextualMatches.add(edge.source);
          contextualMatches.add(edge.target);
        }
      });
    }

    state.matchedNodeIds = directMatches;

    return graph.nodes.filter((node) => {
      if (!state.groupFilters.has(node.group)) {
        return false;
      }

      if (!searchActive) {
        return true;
      }

      return contextualMatches.has(node.id);
    });
  }

  function getVisibleEdges(graph, visibleNodes) {
    const visibleIds = new Set(visibleNodes.map((node) => node.id));
    const searchActive = Boolean(state.search.trim());
    const searchTerm = state.search.trim().toLowerCase();

    return graph.edges.filter((edge) => {
      if (!state.edgeFilters.has(edge.type)) {
        return false;
      }

      if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) {
        return false;
      }

      if (!searchActive) {
        return true;
      }

      return (
        state.matchedNodeIds.has(edge.source) ||
        state.matchedNodeIds.has(edge.target) ||
        edgeSearchText(edge).includes(searchTerm)
      );
    });
  }

  function computeStructurePositions(graph) {
    const positions = new Map();
    const buckets = new Map();

    graph.nodes.forEach((node) => {
      if (!buckets.has(node.group)) {
        buckets.set(node.group, []);
      }
      buckets.get(node.group).push(node);
    });

    buckets.forEach((nodes, group) => {
      const meta = GROUP_META[group] || { center: [VIEWBOX.width / 2, VIEWBOX.height / 2] };
      nodes.sort((left, right) => left.label.localeCompare(right.label));

      const columns = nodes.length > 8 ? 3 : nodes.length > 4 ? 2 : 1;
      const rows = Math.ceil(nodes.length / columns);
      const gapX = 290;
      const gapY = 138;
      const totalWidth = (columns - 1) * gapX;
      const totalHeight = (rows - 1) * gapY;

      nodes.forEach((node, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        positions.set(node.id, {
          x: meta.center[0] - totalWidth / 2 + column * gapX,
          y: meta.center[1] - totalHeight / 2 + row * gapY
        });
      });
    });

    return positions;
  }

  function computeJourneyPositions(graph) {
    const positions = new Map();
    const startX = 120;
    const startY = 182;
    const stageWidth = 500;
    const stageGap = 78;

    (graph.lens?.stages || []).forEach((stage, stageIndex) => {
      const nodeIds = graph.stageNodeIds?.[stage.id] || [];
      const columns = nodeIds.length > 4 ? 2 : 1;
      const gapX = 244;
      const gapY = 136;

      nodeIds.forEach((nodeId, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        positions.set(nodeId, {
          x: startX + stageIndex * (stageWidth + stageGap) + column * gapX + (columns === 1 ? 110 : 0),
          y: startY + row * gapY
        });
      });
    });

    return positions;
  }

  function computePositions(graph) {
    return graph.mode === "journey" ? computeJourneyPositions(graph) : computeStructurePositions(graph);
  }

  function pathForEdge(sourceNode, targetNode) {
    const sourceBox = getNodeDimensions(sourceNode);
    const targetBox = getNodeDimensions(targetNode);
    const direction = targetNode.x >= sourceNode.x ? 1 : -1;
    const startX = sourceNode.x + direction * sourceBox.width * 0.46;
    const endX = targetNode.x - direction * targetBox.width * 0.46;
    const startY = sourceNode.y;
    const endY = targetNode.y;
    const curve = Math.max(84, Math.abs(endX - startX) * 0.35);

    return `M ${startX} ${startY} C ${startX + curve * direction} ${startY}, ${endX - curve * direction} ${endY}, ${endX} ${endY}`;
  }

  // RENDERING

  function renderStats(graph, visibleNodes, visibleEdges) {
    const openTargets = visibleNodes.filter((node) => isNodeOpenable(node)).length;
    const missingTargets = visibleNodes.filter((node) => node.type === "missing-route" || node.status === "placeholder").length;
    const goalNodes = visibleNodes.filter((node) => node.group === "goal").length;
    const stats = [
      ["Visible Nodes", visibleNodes.length],
      ["Visible Edges", visibleEdges.length],
      ["Open Targets", openTargets],
      ["Missing / Placeholder", missingTargets],
      ["Goal Nodes", goalNodes],
      [graph.mode === "journey" ? "Active Lens" : "Perspective", graph.mode === "journey" ? graph.title : "Structure"]
    ];

    elements.statCards.innerHTML = stats
      .map(
        ([label, value]) => `
          <article class="card stat-card">
            <div class="stat-label">${escapeHtml(label)}</div>
            <div class="stat-value">${escapeHtml(value)}</div>
          </article>
        `
      )
      .join("");
  }

  function renderGraphHeader(graph) {
    elements.graphModeBadge.textContent = graph.badge;
    elements.graphTitle.textContent = graph.title;
    elements.graphDescription.textContent = graph.description;
    elements.graphModeSummary.textContent =
      graph.mode === "journey"
        ? `Goal-flow perspective for ${graph.title}.`
        : "Structural relationship network showing implemented, missing, and inferred connections.";

    const pills = [
      `<span class="meta-pill">${escapeHtml(graph.mode === "journey" ? "Journey Lens" : "Structure Map")}</span>`,
      `<span class="meta-pill">${escapeHtml(`${graph.nodes.length} nodes`)}</span>`,
      `<span class="meta-pill">${escapeHtml(`${graph.edges.length} edges`)}</span>`
    ];

    if (graph.mode === "journey") {
      pills.push(`<span class="meta-pill">${escapeHtml(`${graph.lens.stages.length} stages`)}</span>`);
    }

    elements.graphMeta.innerHTML = pills.join("");
  }

  function renderPerspectiveControls(graph) {
    getPerspectiveButtons().forEach((button) => {
      button.classList.toggle("is-active", button.dataset.perspective === state.perspective);
    });

    elements.lensStrip.hidden = graph.mode !== "journey";
    elements.lensSwitcher.innerHTML = "";

    if (graph.mode !== "journey") {
      elements.lensSummary.textContent = "";
      return;
    }

    Object.entries(annotations.journeyLenses || {}).forEach(([lensKey, lens]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.lens = lensKey;
      button.textContent = lens.label;
      button.classList.toggle("is-active", lensKey === state.lens);
      button.addEventListener("click", () => {
        if (state.lens === lensKey) {
          return;
        }
        state.lens = lensKey;
        localStorage.setItem(LENS_STORAGE_KEY, lensKey);
        state.selectedNodeId = null;
        renderAll();
        fitGraph();
      });
      elements.lensSwitcher.appendChild(button);
    });

    elements.lensSummary.textContent = graph.lens.description;
  }

  function buildFilterChip(label, color, checked, onChange) {
    const chip = document.createElement("label");
    chip.className = "filter-chip";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checked;
    input.addEventListener("change", onChange);

    const swatch = document.createElement("span");
    swatch.className = "chip-swatch";
    swatch.style.background = color;

    const text = document.createElement("span");
    text.textContent = label;

    chip.append(input, swatch, text);
    return chip;
  }

  function renderFilters(graph) {
    const groups = [...new Set(graph.nodes.map((node) => node.group).filter(Boolean))].sort((left, right) => {
      return (Object.keys(GROUP_META).indexOf(left) + 1 || 999) - (Object.keys(GROUP_META).indexOf(right) + 1 || 999);
    });
    const edgeTypes = [...new Set(graph.edges.map((edge) => edge.type).filter(Boolean))];

    elements.groupFilters.innerHTML = "";
    groups.forEach((group) => {
      elements.groupFilters.appendChild(
        buildFilterChip(GROUP_META[group]?.label || group, getGroupColor(group), state.groupFilters.has(group), () => {
          if (state.groupFilters.has(group)) {
            state.groupFilters.delete(group);
          } else {
            state.groupFilters.add(group);
          }
          renderAll();
        })
      );
    });

    elements.edgeFilters.innerHTML = "";
    edgeTypes.forEach((type) => {
      const meta = EDGE_META[type] || { label: type, color: "var(--muted)" };
      elements.edgeFilters.appendChild(
        buildFilterChip(meta.label, meta.color, state.edgeFilters.has(type), () => {
          if (state.edgeFilters.has(type)) {
            state.edgeFilters.delete(type);
          } else {
            state.edgeFilters.add(type);
          }
          renderAll();
        })
      );
    });

    const legendItems = [
      ...groups.map((group) => ({ label: GROUP_META[group]?.label || group, color: getGroupColor(group), isEdge: false })),
      ...edgeTypes.map((type) => ({ label: EDGE_META[type]?.label || type, color: EDGE_META[type]?.color || "var(--muted)", dash: EDGE_META[type]?.dash || "", isEdge: true }))
    ];

    elements.legendList.innerHTML = legendItems
      .map((item) =>
        item.isEdge
          ? `<li class="legend-item"><span>${escapeHtml(item.label)}</span><span class="legend-line" style="border-top-color:${item.color};border-top-style:${item.dash ? "dashed" : "solid"};"></span></li>`
          : `<li class="legend-item"><span>${escapeHtml(item.label)}</span><span class="chip-swatch" style="background:${item.color};"></span></li>`
      )
      .join("");
  }

  function renderStructureZones(visibleNodes, positions) {
    elements.groupLayer.innerHTML = "";
    const buckets = new Map();

    visibleNodes.forEach((node) => {
      if (!buckets.has(node.group)) {
        buckets.set(node.group, []);
      }
      buckets.get(node.group).push(node);
    });

    buckets.forEach((nodes, group) => {
      const items = nodes.map((node) => {
        const position = positions.get(node.id);
        const size = getNodeDimensions(node);
        return {
          left: position.x - size.width / 2,
          right: position.x + size.width / 2,
          top: position.y - size.height / 2,
          bottom: position.y + size.height / 2
        };
      });

      const bounds = items.reduce(
        (acc, item) => ({
          left: Math.min(acc.left, item.left),
          right: Math.max(acc.right, item.right),
          top: Math.min(acc.top, item.top),
          bottom: Math.max(acc.bottom, item.bottom)
        }),
        { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity }
      );

      const color = getGroupColor(group);
      const rect = document.createElementNS(SVG_NS, "rect");
      rect.setAttribute("class", "group-zone");
      rect.setAttribute("x", String(bounds.left - 54));
      rect.setAttribute("y", String(bounds.top - 78));
      rect.setAttribute("width", String(bounds.right - bounds.left + 108));
      rect.setAttribute("height", String(bounds.bottom - bounds.top + 126));
      rect.setAttribute("rx", "34");
      rect.style.fill = `color-mix(in srgb, ${color} 8%, transparent)`;
      rect.style.stroke = `color-mix(in srgb, ${color} 24%, transparent)`;
      elements.groupLayer.appendChild(rect);

      const label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("class", "zone-label");
      label.setAttribute("x", String(bounds.left - 22));
      label.setAttribute("y", String(bounds.top - 34));
      label.textContent = GROUP_META[group]?.label || group;
      elements.groupLayer.appendChild(label);
    });
  }

  function renderJourneyStages(graph, visibleNodes, positions) {
    elements.groupLayer.innerHTML = "";

    (graph.lens?.stages || []).forEach((stage, index) => {
      const visibleStageNodes = (graph.stageNodeIds?.[stage.id] || []).filter((nodeId) =>
        visibleNodes.some((node) => node.id === nodeId)
      );

      if (!visibleStageNodes.length) {
        return;
      }

      const x = 70 + index * 578;
      const rect = document.createElementNS(SVG_NS, "rect");
      rect.setAttribute("class", "stage-zone");
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", "66");
      rect.setAttribute("width", "500");
      rect.setAttribute("height", "1600");
      rect.setAttribute("rx", "34");
      rect.style.fill = `color-mix(in srgb, ${index % 2 === 0 ? "var(--accent)" : "var(--accent-2)"} 8%, transparent)`;
      rect.style.stroke = `color-mix(in srgb, ${index % 2 === 0 ? "var(--accent)" : "var(--accent-2)"} 22%, transparent)`;
      elements.groupLayer.appendChild(rect);

      const label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("class", "zone-label");
      label.setAttribute("x", String(x + 28));
      label.setAttribute("y", "114");
      label.textContent = stage.label;
      elements.groupLayer.appendChild(label);

      const subtitle = document.createElementNS(SVG_NS, "text");
      subtitle.setAttribute("class", "zone-subtitle");
      subtitle.setAttribute("x", String(x + 30));
      subtitle.setAttribute("y", "142");
      subtitle.textContent = `${visibleStageNodes.length} nodes in this stage`;
      elements.groupLayer.appendChild(subtitle);
    });
  }

  function renderEdges(graph, visibleNodes, visibleEdges, positions) {
    const nodeMap = new Map(visibleNodes.map((node) => [node.id, node]));
    elements.edgeLayer.innerHTML = "";

    visibleEdges.forEach((edge) => {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);
      if (!source || !target) {
        return;
      }

      const sourcePosition = positions.get(source.id);
      const targetPosition = positions.get(target.id);
      const meta = EDGE_META[edge.type] || EDGE_META["internal-link"];
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("class", `edge-path${state.selectedNodeId && (edge.source === state.selectedNodeId || edge.target === state.selectedNodeId) ? " edge-highlighted" : ""}`);
      path.setAttribute("d", pathForEdge({ ...sourcePosition, ...source }, { ...targetPosition, ...target }));
      path.style.stroke = meta.color;
      path.style.opacity = String(meta.opacity ?? 0.62);
      if (meta.dash) {
        path.setAttribute("stroke-dasharray", meta.dash);
      }

      const title = document.createElementNS(SVG_NS, "title");
      title.textContent = `${meta.label}: ${edge.label || `${source.label} -> ${target.label}`}`;
      path.appendChild(title);
      elements.edgeLayer.appendChild(path);
    });
  }

  function createSvgLink(href, x, y) {
    const link = document.createElementNS(SVG_NS, "a");
    link.setAttribute("href", href);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", String(x));
    circle.setAttribute("cy", String(y));
    circle.setAttribute("r", "14");
    circle.style.fill = "color-mix(in srgb, var(--accent) 84%, white)";
    circle.style.stroke = "color-mix(in srgb, var(--accent-strong) 74%, transparent)";
    circle.style.strokeWidth = "1.5";
    link.appendChild(circle);

    const text = document.createElementNS(SVG_NS, "text");
    text.setAttribute("x", String(x));
    text.setAttribute("y", String(y + 5));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "14");
    text.setAttribute("font-weight", "800");
    text.style.fill = "#081513";
    text.textContent = "↗";
    link.appendChild(text);

    return link;
  }

  function renderNodes(graph, visibleNodes, positions) {
    elements.nodeLayer.innerHTML = "";

    visibleNodes
      .slice()
      .sort((left, right) => Number(left.id === state.selectedNodeId) - Number(right.id === state.selectedNodeId))
      .forEach((node) => {
        const position = positions.get(node.id);
        const size = getNodeDimensions(node);
        const nodeGroup = document.createElementNS(SVG_NS, "g");
        const classNames = ["node"];
        if (node.id === state.selectedNodeId) {
          classNames.push("is-selected");
        }
        if (state.matchedNodeIds.has(node.id)) {
          classNames.push("is-matched");
        }
        nodeGroup.setAttribute("class", classNames.join(" "));
        nodeGroup.setAttribute("transform", `translate(${position.x} ${position.y})`);
        nodeGroup.dataset.nodeId = node.id;
        nodeGroup.addEventListener("click", (event) => {
          if (event.target.closest("a")) {
            return;
          }
          state.selectedNodeId = node.id;
          renderAll();
        });

        const box = document.createElementNS(SVG_NS, "rect");
        box.setAttribute("class", "node-box");
        box.setAttribute("x", String(-size.width / 2));
        box.setAttribute("y", String(-size.height / 2));
        box.setAttribute("width", String(size.width));
        box.setAttribute("height", String(size.height));
        box.style.fill = `color-mix(in srgb, ${getGroupColor(node.group)} 14%, var(--surface-3))`;
        box.style.stroke = `color-mix(in srgb, ${getGroupColor(node.group)} 54%, transparent)`;
        nodeGroup.appendChild(box);

        const kicker = document.createElementNS(SVG_NS, "text");
        kicker.setAttribute("class", "node-kicker");
        kicker.setAttribute("x", String(-size.width / 2 + 18));
        kicker.setAttribute("y", String(-size.height / 2 + 22));
        kicker.textContent = graph.mode === "journey" && node.journeyStage
          ? `${nodeTypeLabel(node.type)} • ${node.journeyStage}`
          : nodeTypeLabel(node.type);
        nodeGroup.appendChild(kicker);

        const label = document.createElementNS(SVG_NS, "text");
        label.setAttribute("class", "node-label");
        label.setAttribute("x", String(-size.width / 2 + 18));
        label.setAttribute("y", String(-size.height / 2 + 48));
        label.textContent = node.label;
        nodeGroup.appendChild(label);

        const route = document.createElementNS(SVG_NS, "text");
        route.setAttribute("class", "node-route");
        route.setAttribute("x", String(-size.width / 2 + 18));
        route.setAttribute("y", String(-size.height / 2 + 72));
        route.textContent = node.route || node.target || (node.files && node.files[0]) || node.status || "";
        nodeGroup.appendChild(route);

        const title = document.createElementNS(SVG_NS, "title");
        title.textContent = `${node.label}${node.route ? ` (${node.route})` : ""}`;
        nodeGroup.appendChild(title);

        const href = getNodeHref(node);
        if (href) {
          nodeGroup.appendChild(createSvgLink(href, size.width / 2 - 20, -size.height / 2 + 20));
        }

        elements.nodeLayer.appendChild(nodeGroup);
      });
  }

  function relationCards(graph, nodeMap, edges, direction) {
    if (!edges.length) {
      return `<div class="empty-state">No ${direction} relationships in the current view.</div>`;
    }

    return edges
      .map((edge) => {
        const relatedNode = nodeMap.get(direction === "outgoing" ? edge.target : edge.source);
        const href = getNodeHref(relatedNode);
        const origins = (edge.origins || [])
          .slice(0, 4)
          .map(
            (origin) => `
              <div class="edge-origin">
                <code>${escapeHtml(origin.file || "annotation")}</code>
                ${origin.context ? ` • ${escapeHtml(origin.context)}` : ""}
              </div>
            `
          )
          .join("");

        return `
          <article class="relation-card">
            <div class="relation-top">
              <div>
                <div class="detail-pill">${escapeHtml(EDGE_META[edge.type]?.label || edge.type)}</div>
                <div class="relation-target">${escapeHtml(relatedNode?.label || "Unknown target")}</div>
              </div>
              <div class="details-actions">
                <button type="button" class="details-action secondary" data-focus-node="${escapeHtml(relatedNode?.id || "")}">Inspect</button>
                ${href ? `<a class="edge-open-button" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">Open</a>` : ""}
              </div>
            </div>
            <p>${escapeHtml(edge.description || edge.label || "Relationship discovered in source analysis.")}</p>
            ${origins ? `<div class="relation-origin-list">${origins}</div>` : ""}
          </article>
        `;
      })
      .join("");
  }

  function renderDetails(graph, visibleNodes, visibleEdges) {
    const selectedNode = visibleNodes.find((node) => node.id === state.selectedNodeId);
    if (!selectedNode) {
      elements.detailsPanel.innerHTML = `
        <div class="details-empty">
          <span class="eyebrow eyebrow-inline">Inspector</span>
          <h2>Select a node</h2>
          <p>Inspect routes, components, external destinations, missing targets, inferred logic nodes, and journey milestones from here.</p>
        </div>
      `;
      return;
    }

    const nodeMap = new Map(visibleNodes.map((node) => [node.id, node]));
    const outgoing = visibleEdges.filter((edge) => edge.source === selectedNode.id);
    const incoming = visibleEdges.filter((edge) => edge.target === selectedNode.id);
    const href = getNodeHref(selectedNode);

    elements.detailsPanel.innerHTML = `
      <div class="details-header">
        <span class="eyebrow eyebrow-inline">Inspector</span>
        <h2>${escapeHtml(selectedNode.label)}</h2>
        <div class="details-actions">
          <span class="node-badge">${escapeHtml(nodeTypeLabel(selectedNode.type))}</span>
          <span class="node-badge">${escapeHtml(GROUP_META[selectedNode.group]?.label || selectedNode.group || "Ungrouped")}</span>
          <span class="node-badge">${escapeHtml(selectedNode.status || "mapped")}</span>
          ${href ? `<a class="details-action" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">Open In Browser</a>` : ""}
        </div>
        <p>${escapeHtml(selectedNode.description || (selectedNode.notes && selectedNode.notes[0]) || "No extra description attached to this node.")}</p>
      </div>

      <section class="detail-block">
        <h3>Identity</h3>
        <div class="detail-list">
          ${selectedNode.route ? `<div class="file-chip"><span class="route-code">${escapeHtml(selectedNode.route)}</span></div>` : ""}
          ${selectedNode.target ? `<div class="file-chip"><span class="route-code">${escapeHtml(selectedNode.target)}</span></div>` : ""}
          ${(selectedNode.files || []).map((file) => `<div class="file-chip"><code>${escapeHtml(file)}</code></div>`).join("")}
        </div>
      </section>

      ${(selectedNode.notes || []).length
        ? `<section class="detail-block"><h3>Notes</h3><div class="detail-list">${selectedNode.notes
            .map((note) => `<div class="detail-note">${escapeHtml(note)}</div>`)
            .join("")}</div></section>`
        : ""}

      <section class="detail-block">
        <h3>Outgoing</h3>
        <div class="relation-list">${relationCards(graph, nodeMap, outgoing, "outgoing")}</div>
      </section>

      <section class="detail-block">
        <h3>Incoming</h3>
        <div class="relation-list">${relationCards(graph, nodeMap, incoming, "incoming")}</div>
      </section>
    `;

    elements.detailsPanel.querySelectorAll("[data-focus-node]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedNodeId = button.dataset.focusNode;
        renderAll();
      });
    });
  }

  function applyTransform() {
    elements.graphViewport.setAttribute(
      "transform",
      `translate(${state.transform.x} ${state.transform.y}) scale(${state.transform.scale})`
    );
  }

  function fitGraph() {
    const visibleNodes = [...state.visibleNodeIds].map((nodeId) => ({ nodeId, position: state.positions.get(nodeId) }));
    if (!visibleNodes.length) {
      return;
    }

    const bounds = visibleNodes.reduce(
      (acc, entry) => {
        const node = getCurrentGraph().nodes.find((item) => item.id === entry.nodeId);
        const size = getNodeDimensions(node);
        return {
          left: Math.min(acc.left, entry.position.x - size.width / 2),
          right: Math.max(acc.right, entry.position.x + size.width / 2),
          top: Math.min(acc.top, entry.position.y - size.height / 2),
          bottom: Math.max(acc.bottom, entry.position.y + size.height / 2)
        };
      },
      { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity }
    );

    const padding = 120;
    const width = Math.max(bounds.right - bounds.left, 1);
    const height = Math.max(bounds.bottom - bounds.top, 1);
    const scale = Math.min((VIEWBOX.width - padding * 2) / width, (VIEWBOX.height - padding * 2) / height, 1.14);

    state.transform.scale = scale;
    state.transform.x = (VIEWBOX.width - width * scale) / 2 - bounds.left * scale;
    state.transform.y = (VIEWBOX.height - height * scale) / 2 - bounds.top * scale;
    applyTransform();
  }

  function renderAll() {
    const graph = getCurrentGraph();
    syncGraphState(graph);
    renderPerspectiveControls(graph);

    const positions = computePositions(graph);
    const visibleNodes = getVisibleNodes(graph);
    const visibleEdges = getVisibleEdges(graph, visibleNodes);
    const visibleIds = new Set(visibleNodes.map((node) => node.id));

    state.positions = positions;
    state.visibleNodeIds = visibleIds;
    if (state.selectedNodeId && !visibleIds.has(state.selectedNodeId)) {
      state.selectedNodeId = null;
    }

    renderGraphHeader(graph);
    renderStats(graph, visibleNodes, visibleEdges);
    renderFilters(graph);
    if (graph.mode === "journey") {
      renderJourneyStages(graph, visibleNodes, positions);
    } else {
      renderStructureZones(visibleNodes, positions);
    }
    renderEdges(graph, visibleNodes, visibleEdges, positions);
    renderNodes(graph, visibleNodes, positions);
    renderDetails(graph, visibleNodes, visibleEdges);
    applyTransform();
  }

  // INTERACTION

  function attachStaticHandlers() {
    elements.searchInput.value = state.search;
    elements.searchInput.addEventListener("input", (event) => {
      state.search = event.target.value;
      renderAll();
    });

    elements.baseUrlInput.value =
      localStorage.getItem(BASE_URL_STORAGE_KEY) || data.defaultBaseUrl || "http://localhost:3000";
    elements.baseUrlInput.addEventListener("change", () => {
      localStorage.setItem(BASE_URL_STORAGE_KEY, elements.baseUrlInput.value.trim());
      renderAll();
    });

    getThemeButtons().forEach((button) => {
      button.addEventListener("click", () => {
        state.themePreference = button.dataset.themeMode;
        localStorage.setItem(THEME_STORAGE_KEY, state.themePreference);
        applyTheme();
      });
    });

    getPerspectiveButtons().forEach((button) => {
      button.addEventListener("click", () => {
        const next = button.dataset.perspective;
        if (state.perspective === next) {
          return;
        }
        state.perspective = next;
        localStorage.setItem(PERSPECTIVE_STORAGE_KEY, next);
        state.selectedNodeId = null;
        renderAll();
        fitGraph();
      });
    });

    themeMediaQuery.addEventListener("change", () => {
      if (state.themePreference === "system") {
        applyTheme();
      }
    });

    elements.clearSearchButton.addEventListener("click", () => {
      state.search = "";
      elements.searchInput.value = "";
      renderAll();
    });

    elements.resetViewButton.addEventListener("click", () => {
      state.transform = { x: 0, y: 0, scale: 1 };
      applyTransform();
    });

    elements.fitGraphButton.addEventListener("click", () => {
      fitGraph();
    });

    elements.graphSvg.addEventListener("mousedown", (event) => {
      if (event.target.closest("a")) {
        return;
      }
      state.dragging = true;
      state.dragOrigin = {
        x: event.clientX,
        y: event.clientY,
        startX: state.transform.x,
        startY: state.transform.y
      };
      elements.graphSvg.classList.add("is-dragging");
    });

    window.addEventListener("mousemove", (event) => {
      if (!state.dragging || !state.dragOrigin) {
        return;
      }

      const rect = elements.graphSvg.getBoundingClientRect();
      const scaleX = VIEWBOX.width / rect.width;
      const scaleY = VIEWBOX.height / rect.height;
      state.transform.x = state.dragOrigin.startX + (event.clientX - state.dragOrigin.x) * scaleX;
      state.transform.y = state.dragOrigin.startY + (event.clientY - state.dragOrigin.y) * scaleY;
      applyTransform();
    });

    window.addEventListener("mouseup", () => {
      state.dragging = false;
      state.dragOrigin = null;
      elements.graphSvg.classList.remove("is-dragging");
    });

    elements.graphSvg.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const rect = elements.graphSvg.getBoundingClientRect();
        const pointX = ((event.clientX - rect.left) / rect.width) * VIEWBOX.width;
        const pointY = ((event.clientY - rect.top) / rect.height) * VIEWBOX.height;
        const nextScale = Math.min(2.8, Math.max(0.42, state.transform.scale * (event.deltaY < 0 ? 1.08 : 0.92)));

        state.transform.x = pointX - (nextScale / state.transform.scale) * (pointX - state.transform.x);
        state.transform.y = pointY - (nextScale / state.transform.scale) * (pointY - state.transform.y);
        state.transform.scale = nextScale;
        applyTransform();
      },
      { passive: false }
    );
  }

  // BOOT

  applyTheme();
  attachStaticHandlers();
  renderAll();
  fitGraph();
})();
