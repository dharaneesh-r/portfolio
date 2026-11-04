/**
 * data/skillsGraph.js — Knowledge-graph context for the Skills page
 * ─────────────────────────────────────────────────────────────────
 * Single source of truth for the 3D skill knowledge graph.
 */

import { skillCategories } from "./skills";

// ── Root hub label ───────────────────────────────────────────────────
export const ROOT_NODE = {
  id:    "__root__",
  label: "Full Stack",
  type:  "root",
  color: "#f97316",
};

// ── Short titles for category nodes ──────────────────────────────────
const shortTitle = (title) =>
  title.replace(" Development", "").replace(" & Systems", "").replace(" & Storage", "").replace(" & DevOps", "").replace(" & Tools", "");

// ── Real-world technology relationships (cross-links) ────────────────
export const SKILL_RELATIONSHIPS = [
  // Languages & Core
  ["JavaScript", "TypeScript"],
  ["JavaScript", "React.js"],
  ["TypeScript", "React.js"],
  ["TypeScript", "Node.js"],
  ["Java", "SQL"],
  ["Go", "WebSockets"],
  ["Go", "Docker"],

  // Frontend internal
  ["React.js", "Next.js"],
  ["React.js", "Redux"],
  ["React.js", "TailwindCSS"],
  ["React.js", "GSAP"],

  // Frontend ↔ Backend
  ["JavaScript", "Node.js"],
  ["Next.js", "Node.js"],
  ["React.js", "Express.js"],
  ["React.js", "WebSockets"],

  // Backend internal
  ["Node.js", "Express.js"],
  ["Node.js", "NestJS"],
  ["Node.js", "NATS JetStream"],
  ["Node.js", "MongoDB"],
  ["Express.js", "MongoDB"],
  ["Node.js", "DynamoDB"],
  ["Node.js", "Redis"],
  ["NestJS", "PostgreSQL"],

  // Backend ↔ Cloud / DevOps
  ["Node.js", "Docker"],
  ["Node.js", "AWS"],
  ["AWS", "DynamoDB"],
  ["Docker", "Kubernetes"],
  ["Docker", "AWS"],
  ["AWS", "CI/CD & Actions"],

  // Tooling & Testing
  ["Vitest", "TypeScript"],
  ["Git", "CI/CD & Actions"],
  ["Observability", "AWS"],
  ["Observability", "Docker"]
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
        id:          sk.name,
        label:       sk.name,
        type:        "skill",
        category:    key,
        color:       cat.color,
        level:       sk.level,
        yearsExp:    sk.yearsExp,
        description: sk.description,
        val:         1.0 + (sk.level / 100) * 0.8,
      });
      links.push({ source: catId, target: sk.name, kind: "category" });
    });
  });

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  SKILL_RELATIONSHIPS.forEach(([src, tgt]) => {
    if (nodeMap.has(src) && nodeMap.has(tgt)) {
      links.push({ source: src, target: tgt, kind: "related" });
    }
  });

  return { nodes, links };
}
