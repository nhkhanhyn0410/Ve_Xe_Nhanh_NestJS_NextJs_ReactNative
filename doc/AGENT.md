# AGENT.md

Entry point for AI agents working in `doc/`. Read this first, then `@`-load only what each task requires.

## 1. ROLE

Project: managed marketplace for bus ticket booking (`Ve_Xe_Nhanh_NestJS_NextJs_ReactNative`). Three-sided marketplace: Passengers ↔ Platform ↔ Operators. Platform delivers three service layers: Marketplace layer (passenger-facing), Operator OS layer (operator and employee tools) and Platform admin layer (platform governance). Platform does not own vehicles, employ drivers or operate trips directly.

Allowed:

- Understand system context from docs and source code.
- Edit and standardize SDLC documents per ISO/IEC/IEEE 15289 and 29148.
- Author design documents: SRS, HLD, LLD, API spec, DB design, UI/UX flow, security design.

Forbidden:

- Writing or modifying application source code under `apps/` or `packages/`.
- Promoting any document `status` to `Approved`.
- Expanding scope (new module, actor, technology, business rule) without explicit human review.

Full rules: use `@agent/00-quy-chuan-cho-ai-agent`.

## 2. DIRECTORY MAP

```text
doc/
├── AGENT.md                                  ← entry (this file)
├── agent/                                    ← AI-tailored SDLC standards and guides
├── context/                                  ← codebase facts, language-agnostic
└── SDLC/                                     ← Primary SDLC documents (SRS, HLD, LLD, etc.)
```

## 3. WORKING SURFACE

| Path       | Read | Write | Purpose                                  |
| ---------- | ---- | ----- | ---------------------------------------- |
| `agent/`   | YES  | YES   | AI-tailored SDLC and standards.          |
| `context/` | YES  | YES   | Codebase facts. Maintained by agent.     |
| `SDLC/`    | YES  | YES   | Full SDLC for human and AI consumption.  |

When the user requests documentation work, edit files in `SDLC/` or `agent/` directly.

## 4. FILE RULES

- Max 150 lines per file applies only to agent-context files intended for coding agents. It does not apply to official SDLC documents under `SDLC/`.
- Cross-reference syntax: `@path/filename` (no `.md` extension).
- Lazy load. Do not enumerate the entire `doc/` tree per task.
- Documents are primarily in Vietnamese. Use English only if explicitly requested.

## 5. TASK FLOWS

### A. Lookup or business question

1. `@agent/00-quy-chuan-cho-ai-agent`.
2. `@context/GLOSSARY` if available — for consistent terminology.
3. `@context/DOMAIN-MAP` if available — to locate which module / SDLC section is relevant.
4. `@context/PROJECT-STATE` if available — to know the latest decisions and document statuses.
5. Relevant SDLC file under `@SDLC/`.

### B. Edit an existing SDLC document

1. `@agent/00-quy-chuan-cho-ai-agent`.
2. `@context/PROJECT-STATE` if available.
3. Target file under `@SDLC/` or `@agent/` according to the user request.
4. Edit. Update `@context/PROJECT-STATE` after the edit when that file exists or when the task includes context maintenance.

### C. Author a new design document (HLD, LLD, DB, API, UI, Security)

1. `@agent/00-quy-chuan-cho-ai-agent` (sections B1, B3).
2. `@context/GLOSSARY` if available — for consistent terminology across documents.
3. `@SDLC/01-srs-he-thong-dat-ve-xe-khach`.
4. `@context/DOMAIN-MAP` if available — for module ↔ folder ↔ SDLC section mapping.
5. `@context/PROJECT-STATE` if available — for recent decisions, blockers and open questions raised during design.
6. Create the new file under `@SDLC/`.
7. Update `@context/PROJECT-STATE` after creating / saving the document if it exists.

### D. Reverse-engineer SRS from source code

1. `@agent/00-quy-chuan-cho-ai-agent`.
2. `@context/GLOSSARY` if available — for consistent terminology when naming entities and actors.
3. `@context/DOMAIN-MAP` for module ↔ folder mapping if available.
4. `@context/PROJECT-STRUCTURE` (or `@context/STRUCTURE-BACKEND` when split).
5. `@context/PROJECT-STATE` if available — to know which modules are in scope, in progress or refactor-pending.
6. Source code in scope (read minimum needed).
7. Write FR/BR into `@SDLC/01-srs-he-thong-dat-ve-xe-khach`.
8. Update `@context/PROJECT-STATE` after writing if it exists.

## 6. HARD CONSTRAINTS

- Do not write or modify application source code under `apps/` or `packages/` when working on documentation.
- Do not use diff after write a doc
- Do not change document `status` to `Approved`.
- Do not invent business rules, modules, actors, technologies. Mark gaps with `TBD`, `OPEN QUESTION`, or `ASSUMPTION`.
- On conflict between `vi/` and `en/`, treat as `OPEN QUESTION` and surface to the user.
- On conflict between an assumption and `@context/PROJECT-STATE`, trust the file.
- Update `@context/PROJECT-STATE` after documentation edits when it exists or when context maintenance is part of the task. Do not create context files unless requested or necessary for the task.
