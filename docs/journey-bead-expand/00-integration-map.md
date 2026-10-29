# Integration map: current AwardCluster (node-diagram round) -> bead-expand rewrite

Read-only audit, 2026-10-29. The spiral node cluster will be REPLACED by a
bead-expand-inline component. Nothing here is modified.

## Files involved

- `src/sections/Manifesto.tsx` (1386 lines) - wiring
- `src/sections/journey/AwardCluster.tsx` (319 lines) - component (delete after swap)
- `src/sections/journey/AwardCluster.css` (235 lines) - styles (delete after swap)
- `docs/journey-node-panel/01-spec.md` - spec (obsolete after swap)
- `docs/journey-node-panel/data.json` - design data (partially reusable)

No other file in `src/` references `AwardCluster`, `journey-cluster`, or
`CLUSTER_` (verified by repo-wide grep). The bead on the timeline itself
(`journey-node` / `journey-bead` classes) is separate, pre-existing Journey
machinery and must NOT be touched.

## Touch points in Manifesto.tsx (exact)

1. **Header comment, line 18** - mentions "2025 award lists render as
   AwardCluster node clouds". Rewrite to describe the new component.

2. **Import, line 61:**
   `import { AwardCluster, type ClusterItem } from "./journey/AwardCluster";`
   Replace with the new component's import (e.g. `./journey/BeadExpand`).

3. **Scope gate, line 356** (+ comment block lines 353-355):
   `const CLUSTER_YEARS = new Set(["2024", "2025"]);`
   Keep the gate (rename suggested: `BEAD_EXPAND_YEARS` or reuse), since the
   rewrite targets the same two stations.

4. **CLUSTER_SHORT_LABELS, lines 361-~374** - trimmed chip labels used only by
   the spiral clouds (`shortLabel: CLUSTER_SHORT_LABELS[dot] ?? dot` at line
   1184). Bead-expand shows full dot text inline, so this map becomes DEAD -
   delete it. (Source of trims: `docs/journey-node-panel/data.json`, also
   dead after swap.)

5. **openNode state + toggleClusterNode, lines 922-929:**
   ```tsx
   const [openNode, setOpenNode] = useState<{ clusterId: string; nodeId: string } | null>(null);
   const toggleClusterNode = (year: string, id: string) => {
     setOpenNode((prev) => prev && prev.nodeId === id ? null : { clusterId: year, nodeId: id });
   };
   ```
   The new component owns its own open/close state (expand inline per bead,
   only one open at a time). Delete this state and the helper. Note the subtle
   bug to not replicate: `toggleClusterNode` compares `nodeId` only; ids are
   year-prefixed so it works, but a fresh implementation should key on the
   station year directly.

6. **clusterItems derivation, lines 1182-1187** (inside `STATIONS.map`):
   ```tsx
   const clusterItems: ClusterItem[] = station.dots.map((dot, k) => ({
     id: `${station.year}-${k}`,
     shortLabel: CLUSTER_SHORT_LABELS[dot] ?? dot,
     title: dot,
     body: dot,
   }));
   ```
   Delete. The new component reads `station.dots` directly (verbatim strings,
   byte-identical - hard gate).

7. **JSX ternary, lines 1298-1307:**
   ```tsx
   {station.dots.length > 0 &&
     (CLUSTER_YEARS.has(station.year) ? (
       <AwardCluster
         items={clusterItems}
         year={station.year}
         dotCount={station.dotCount}
         onTop={onTop}
         openId={openNode?.nodeId ?? null}
         onToggle={(id) => toggleClusterNode(station.year, id)}
       />
     ) : ( ...old dot-list div, byte-identical... ))}
   ```
   Replace the `<AwardCluster .../>` branch with the new component, e.g.
   `<BeadExpand dots={station.dots} dotCount={station.dotCount} />`.
   The else branch (old dot list for 2022/2023/2026) is the pre-existing
   markup - keep byte-identical.

8. **dotCount placement, lines ~1344-1355** - `{station.dotCount && (<p ...>)}`
   renders AFTER the cluster, before `<JourneyInstrument>`. The new design
   mockup shows the count as the collapsed badge ("11 awards in 2025"), so the
   integrator must decide: keep the mono line as-is, or fold the count into
   the new component's collapsed state. Do NOT duplicate it in both places.

9. **CSS import** - `import "./AwardCluster.css"` lives at
   `src/sections/journey/AwardCluster.tsx:4` (NOT in Manifesto.tsx). Deleting
   the component file removes the CSS automatically.

## AwardCluster.tsx exports (all deleted with the file)

- `export type ClusterItem = { id, shortLabel, title, body }`
- `export type AwardClusterProps = { items, year, dotCount, onTop, openId, onToggle }`
- `export function AwardCluster({...})` + `export default AwardCluster`
- Internal only: `nodePosition()` golden-angle spiral, `ClusterPanel` (portal),
  two-pass placement, 6 dismiss paths, focus management.

## AwardCluster.css classes (all deleted with the file)

`.journey-cluster`, `.journey-cluster-node`, `.journey-cluster-node-active`,
`.journey-cluster-node-dot`, `.journey-cluster-node-label`,
`.journey-cluster-panel`, `.journey-cluster-panel-entered`,
`.journey-cluster-panel-kicker`, `.journey-cluster-panel-title`,
`.journey-cluster-panel-body`, `.journey-cluster-panel-footer`,
`.journey-cluster-panel-close`, `.journey-cluster-backdrop`.
All unique site-wide (no collisions with Manifesto/global CSS) - safe to delete.

## docs/journey-node-panel/ contents

- `01-spec.md` - spiral + floating-panel spec. OBSOLETE for the rewrite.
- `data.json` - `title` fields are byte-identical to `STATIONS.dots` and remain
  a valid reference. `shortLabel` trims and `body` suffixes
  ("One of the 4/11 award items in ...") are invented design-reference text,
  NOT imported by src/, and must NOT be used in production. Keep as reference
  only, or archive.

## Hidden coupling / warnings

- The old dot-list div (else branch) carries `marginTop: 16` inline; the
  cluster CSS moved that into `.journey-cluster`. The new component must
  provide its own top spacing so vertical rhythm does not change.
- `onTop={onTop}` (station index parity) only existed for panel flip
  direction; irrelevant to bead-expand - drop it.
- `station.dotCount` is `string | null`; the new component should accept the
  same nullable shape.
- Do NOT confuse the timeline beads (`journey-node`, `journey-bead`,
  `journey-bead-ring`) with the cluster - they are older Journey machinery
  (route draw, seals) and stay untouched.
