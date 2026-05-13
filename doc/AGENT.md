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

Full rules: use `@vi/agent/00-quy-chuan-cho-ai-agent` for Vietnamese documentation work, or `@en/agent/00-standard-for-ai-agent` for English documentation work.

## 2. DIRECTORY MAP

```text
doc/
├── AGENT.md                                  ← entry (this file)
├── context/                                  ← codebase facts, language-agnostic
│   ├── DOMAIN-MAP.md
│   ├── GLOSSARY.md
│   └── PROJECT-STATE.md
├── en/                                       ← English working area
│   ├── agent/                                ← SDLC tailored for AI consumption in English
│   └── SDLC/                                 ← SDLC for English-reading humans
└── vi/                                       ← Vietnamese working area
    ├── agent/                                ← Agent standards in Vietnamese
    └── SDLC/                                 ← Primary Vietnamese SDLC documents
```

## 3. WORKING SURFACE

| Path        | Read | Write | Purpose                                  |
| ----------- | ---- | ----- | ---------------------------------------- |
| `context/`  | YES  | YES   | Codebase facts. Maintained by agent.     |
| `en/agent/` | YES  | YES   | English AI-tailored SDLC.                |
| `en/SDLC/`  | YES  | YES   | Full SDLC for English-reading engineers. |
| `vi/agent/` | YES  | YES   | Vietnamese agent standards.              |
| `vi/SDLC/`  | YES  | YES   | Primary Vietnamese full SDLC.            |

When the user requests Vietnamese SDLC work, edit `vi/SDLC/` directly. Use `en/` only when the user requests English documents, English counterparts, or AI-tailored English material.

If a document exists only in one language, it may be read as context for the other language. Do not create a parallel translation unless explicitly requested.

## 4. FILE RULES

- Max 150 lines per file applies only to agent-context files intended for coding agents. It does not apply to official SDLC documents under `vi/SDLC/` or `en/SDLC/`.
- Cross-reference syntax: `@path/filename` (no `.md` extension).
- Lazy load. Do not enumerate the entire `doc/` tree per task.
- All `en/` content is in English. All `vi/` content is in Vietnamese. Do not mix languages within a file.

## 5. TASK FLOWS

### A. Lookup or business question

1. `@vi/agent/00-quy-chuan-cho-ai-agent` for Vietnamese work, or `@en/agent/00-standard-for-ai-agent` for English work.
2. `@context/GLOSSARY` if available — for consistent terminology.
3. `@context/DOMAIN-MAP` if available — to locate which module / SDLC section is relevant.
4. `@context/PROJECT-STATE` if available — to know the latest decisions and document statuses.
5. Relevant SDLC file under `@vi/SDLC/` unless the user requests English.

### B. Edit an existing SDLC document

1. `@vi/agent/00-quy-chuan-cho-ai-agent` for Vietnamese work, or `@en/agent/00-standard-for-ai-agent` for English work.
2. `@context/PROJECT-STATE` if available.
3. Target file under `@vi/SDLC/`, `@vi/agent/`, `@en/SDLC/`, or `@en/agent/` according to the user request.
4. Edit. Update `@context/PROJECT-STATE` after the edit when that file exists or when the task includes context maintenance.

### C. Author a new design document (HLD, LLD, DB, API, UI, Security)

1. `@vi/agent/00-quy-chuan-cho-ai-agent` for Vietnamese work, or `@en/agent/00-standard-for-ai-agent` for English work (sections B1, B3).
2. `@context/GLOSSARY` if available — for consistent terminology across documents.
3. `@vi/SDLC/01-srs-he-thong-dat-ve-xe-khach` for Vietnamese work, or the English SRS counterpart when requested.
4. `@context/DOMAIN-MAP` if available — for module ↔ folder ↔ SDLC section mapping.
5. `@context/PROJECT-STATE` if available — for recent decisions, blockers and open questions raised during design.
6. Create the new file under the requested SDLC language directory, defaulting to `@vi/SDLC/` for Vietnamese work.
7. Update `@context/PROJECT-STATE` after creating / saving the document if it exists.

### D. Reverse-engineer SRS from source code

1. `@vi/agent/00-quy-chuan-cho-ai-agent` for Vietnamese work, or `@en/agent/00-standard-for-ai-agent` for English work.
2. `@context/GLOSSARY` if available — for consistent terminology when naming entities and actors.
3. `@context/DOMAIN-MAP` for module ↔ folder mapping if available.
4. `@context/PROJECT-STRUCTURE` (or `@context/STRUCTURE-BACKEND` when split).
5. `@context/PROJECT-STATE` if available — to know which modules are in scope, in progress or refactor-pending.
6. Source code in scope (read minimum needed).
7. Write FR/BR into `@vi/SDLC/01-srs-he-thong-dat-ve-xe-khach` unless the user requests English output.
8. Update `@context/PROJECT-STATE` after writing if it exists.

## 6. HARD CONSTRAINTS

- Do not write or modify application source code under `apps/` or `packages/` when working on documentation.
- Do not use diff after write a doc
- Do not change document `status` to `Approved`.
- Do not invent business rules, modules, actors, technologies. Mark gaps with `TBD`, `OPEN QUESTION`, or `ASSUMPTION`.
- On conflict between `vi/` and `en/`, treat as `OPEN QUESTION` and surface to the user.
- On conflict between an assumption and `@context/PROJECT-STATE`, trust the file.
- Update `@context/PROJECT-STATE` after documentation edits when it exists or when context maintenance is part of the task. Do not create context files unless requested or necessary for the task.
