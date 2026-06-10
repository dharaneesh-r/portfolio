/**
 * data/skillsGraph.js — Knowledge-graph context for the Skills page
 * ─────────────────────────────────────────────────────────────────
 * Single source of truth for the 3D skill knowledge graph.
 *
 * The graph is built from `skillCategories` (src/data/skills.js) so we
 * never duplicate skill names, levels, or colours. This file only adds
 * the *relationships* between technologies — the edges that turn a flat
 * skill list into a connected knowledge graph.
 *
 * Node types:
 *   root      → the developer (single hub node)
 *   category  → Frontend / Backend / DevOps / Tools
 *   skill     → individual technology (sized by proficiency)
 *
 * Link kinds:
 *   root      → root → category        (skeleton, strong springs)
 *   category  → category → skill        (skeleton, strong springs)
 *   related   → skill ↔ skill           (real-world affinity, soft springs)
 *
 * Consumed by: Components/ui/SkillsGraph.jsx
 */

import { skillCategories } from "./skills";

// ── Root hub label ───────────────────────────────────────────────────
export const ROOT_NODE = {
  id:    "__root__",
  label: "Full Stack",
  type:  "root",
  color: "#f97316",
};

// ── Short titles for category nodes (strip "Development" / "& Cloud") ─
const shortTitle = (title) =>
  title.replace(" Development", "").replace(" & Cloud", "");

// ── Real-world technology relationships (cross-links) ────────────────
// Each pair references skill `name`s exactly as they appear in skills.js.
// Pairs whose endpoints don't both exist are silently skipped at build
// time, so this list is safe to extend without breaking the graph.
export const SKILL_RELATIONSHIPS = [
  // Frontend internal
  ["HTML", "CSS"],
  ["CSS", "TailwindCSS"],
  ["JavaScript", "React.js"],
  ["React.js", "Next.js"],
  ["React.js", "TailwindCSS"],
  ["React.js", "GSAP"],

  // Frontend ↔ Backend (the MERN spine)
  ["JavaScript", "Node.js"],
  ["Next.js", "Node.js"],
  ["React.js", "Firebase"],

  // Backend internal
  ["Node.js", "Express.js"],
  ["Express.js", "MongoDB"],
  ["Node.js", "MongoDB"],

  // Backend ↔ DevOps
  ["Node.js", "Docker"],
  ["Node.js", "AWS"],

  // DevOps internal
  ["Docker", "Kubernetes"],
  ["AWS", "Docker"],

  // Tooling reach
  ["Git/GitHub", "Docker"],
  ["Postman", "Express.js"],
  ["Git/GitHub", "React.js"],
];

/**
 * Build the node + link graph from skillCategories.
 * @returns {{ nodes: Array, links: Array }}
 */
export function buildSkillGraph() {
  const nodes = [];
  const links = [];

  // Root hub
  nodes.push({ ...ROOT_NODE, val: 3.0 });

  Object.entries(skillCategories).forEach(([key, cat]) => {
    const catId = `cat:${key}`;

    nodes.push({
      id:       catId,
      label:    shortTitle(cat.title),
      type:     "category",
      category: key,
      color:    cat.color,
      val:      2.0,
    });
    links.push({ source: ROOT_NODE.id, target: catId, kind: "root" });

    cat.skills.forEach((sk) => {
      nodes.push({
        id:       sk.name,
        label:    sk.name,
        type:     "skill",
        category: key,
        color:    cat.color,
        level:    sk.level,
        // Size skills by proficiency so stronger skills read as larger hubs
        val:      0.85 + (sk.level / 100) * 0.85,
      });
      links.push({ source: catId, target: sk.name, kind: "category" });
    });
  });

  // Cross-links — only keep pairs where both endpoints exist
  const ids = new Set(nodes.map((n) => n.id));
  SKILL_RELATIONSHIPS.forEach(([a, b]) => {
    if (ids.has(a) && ids.has(b)) {
      links.push({ source: a, target: b, kind: "related" });
    }
  });

  return { nodes, links };
}

export default buildSkillGraph;
