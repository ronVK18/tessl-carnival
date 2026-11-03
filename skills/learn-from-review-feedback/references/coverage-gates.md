# Coverage records and gates

Create `coverage/area-1.json`, `coverage/area-2.json` and `coverage/area-3.json` before investigating. Keep them separate from candidate notes. Each record contains `area`, `question`, `paths`, `evidenceRevision`, `checks` and `decision`. Initialize every required check as `pending`; do not fill the records from memory at the end.

Required keys under `checks` are `pathHistory`, `relatedDiscussions`, `fileInventories`, `selectedThreads`, `correctionHunks`, `currentImplementation`, `applicableGuidance`, `applicableVerifiers` and `candidateDecision`. Each check has this shape:

```json
{ "status": "pending", "evidence": [], "conclusion": "", "blocker": null }
```

Update the relevant check immediately after examining evidence. Change its status to `complete` only when `evidence` names saved raw files and exact PR/thread IDs, source ranges or guidance sections actually read, and `conclusion` states what those reads establish. A downloaded response, title, search hit, truncated excerpt or assertion that something is covered cannot pass a check. Follow the investigation steps in [Investigating one area](area-investigation.md) to decide what evidence is sufficient; these gates do not require exhaustive repository history or multiple independent cases.

A supported negative result can pass: for example, related history examined but irrelevant, advice refuted with no correction to recommend, or existing context and verifiers already covering the relevant decision and property. Record the examined evidence and reason. Missing evidence cannot pass by calling the hypothesis weak or recording a zero-finding outcome. Candidate decisions are `retain`, `reject` or `no-supported-candidate`, with an evidence-backed reason in `decision`; a retained candidate remains in notes until the delivery gate passes.

Use `blocked` only for an external failure that prevents the required read after reasonable recovery attempts. Its `blocker` must contain the affected operation, observed error, attempted alternatives and why no available alternative can complete the check. A malformed query, recoverable truncation, missing local dependency, unavailable publication endpoint or successful lookup on another branch does not by itself establish an unrecoverable blocker. Preserve the evidence revision when recovering reads.

**Area gate:** reread the area's coverage record and inspect its referenced evidence before moving to the next area. Every required key must be present and `complete`. If any check remains pending, perform its next missing read rather than drafting a report. If one hypothesis is unusable, pursue another in that area or replace the area and reset its record. Keep rejected evidence in notes. An unrecoverable external blocker permits a failed ending, with the operation and recovery evidence reported; it never makes the area complete.

**Delivery gate:** leave `proposals/` empty and make no Findings writes until all three distinct areas pass their area gates. Reread all three records, verify the referenced evidence and resolve contradictions between their statuses and notes. Perform missing checks before deduplication and payload creation. An incomplete candidate belongs only in notes, not a proposal marked "not ready to publish". Rehearsals use exactly the same gates.

**Finalization gate:** a successful result requires all three records to pass and every retained candidate to have a recorded deduplication and delivery outcome. If a check remains doable, take that action instead of writing the final report or launch result. Reporting incomplete work honestly does not pass a gate. If an external blocker prevents completion, report failure and link its coverage record and observed recovery evidence. Never invent an execution limit or blocker to justify ending.
