# AGENT.md

Entry point for AI agents working in `doc/`. Read this first, then `@`-load only what each task requires.

## 1. ROLE

Project: bus ticket booking system (`Ve_Xe_Nhanh_NestJS_NextJs_ReactNative`).

Allowed:

- Understand system context from docs and source code.
- Edit and standardize SDLC documents per ISO/IEC/IEEE 15289 and 29148.
- Author design documents: SRS, HLD, LLD, API spec, DB design, UI/UX flow, security design.

Forbidden:

- Writing or modifying application source code under `apps/` or `packages/`.
- Promoting any document `status` to `Approved`.
- Expanding scope (new module, actor, technology, business rule) without explicit human review.

Full rules: `@en/agent/00-standard-for-ai-agent`.

## 2. DIRECTORY MAP

```text
doc/
├── AGENT.md                                  ← entry (this file)
├── context/                                  ← codebase facts, language-agnostic
│   ├── PROJECT-STRUCTURE.md
│   ├── TECH-STACK.md
│   ├── DOMAIN-MAP.md         (TBD)
│   ├── GLOSSARY.md           (TBD)
│   └── PROJECT-STATE.md      (TBD)
├── en/                                       ← AGENT working area
│   ├── agent/                                ← SDLC tailored for AI consumption
│   └── SDLC/                                 ← SDLC for English-reading humans
└── vi/                                       ← HUMAN reference only, do NOT edit
    ├── agent/
    └── SDLC/
```

## 3. WORKING SURFACE

| Path        | Read | Write | Purpose                                       |
| ----------- | ---- | ----- | --------------------------------------------- |
| `context/`  | YES  | YES   | Codebase facts. Maintained by agent.          |
| `en/agent/` | YES  | YES   | Primary working area. AI-tailored SDLC.       |
| `en/SDLC/`  | YES  | YES   | Full SDLC for English-reading engineers.      |
| `vi/agent/` | YES  | NO    | Vietnamese mirror. Read for context only.     |
| `vi/SDLC/`  | YES  | NO    | Vietnamese full SDLC. Read for context only.  |

If `en/` is empty for a file, read the `vi/` counterpart for context, then write the new content into `en/`. Never mutate `vi/`.

## 4. FILE RULES

- Max 150 lines per file. Split if exceeded.
- Cross-reference syntax: `@path/filename` (no `.md` extension).
- Lazy load. Do not enumerate the entire `doc/` tree per task.
- All `en/` content is in English. All `vi/` content is in Vietnamese. Do not mix languages within a file.

## 5. TASK FLOWS

### A. Lookup or business question

1. `@en/agent/00-standard-for-ai-agent`
2. `@context/GLOSSARY`
3. `@context/DOMAIN-MAP`
4. Relevant SDLC file under `@en/agent/`

### B. Edit an existing SDLC document

1. `@en/agent/00-standard-for-ai-agent`
2. `@context/PROJECT-STATE`
3. Target file under `@en/agent/`
4. Edit. Update `@context/PROJECT-STATE` after the edit.

### C. Author a new design document (HLD, LLD, DB, API, UI, Security)

1. `@en/agent/00-standard-for-ai-agent` (sections B1, B3)
2. `@en/agent/01-srs-bus-ticket-system` (or `@vi/SDLC/01-...` if `en/` not yet populated)
3. `@context/DOMAIN-MAP`
4. `@context/PROJECT-STRUCTURE` and relevant `@context/STRUCTURE-*`
5. `@context/TECH-STACK` for technical constraints
6. Create the new file under `@en/agent/` following the SDLC catalog.

### D. Reverse-engineer SRS from source code

1. `@en/agent/00-standard-for-ai-agent`
2. `@context/DOMAIN-MAP` for module ↔ folder mapping
3. `@context/PROJECT-STRUCTURE` (or `@context/STRUCTURE-BACKEND` when split)
4. Source code in scope (read minimum needed)
5. Write FR/BR into `@en/agent/01-srs-bus-ticket-system`

## 6. HARD CONSTRAINTS

- Do not write source code under `apps/` or `packages/`.
- Do not edit `vi/` files under any condition.
- Do not change document `status` to `Approved`.
- Do not invent business rules, modules, actors, technologies. Mark gaps with `TBD`, `OPEN QUESTION`, or `ASSUMPTION`.
- On conflict between `vi/` and `en/`, treat as `OPEN QUESTION` and surface to the user.
- On conflict between an assumption and `@context/PROJECT-STATE`, trust the file.
- After any write, update `@context/PROJECT-STATE` with what changed.
