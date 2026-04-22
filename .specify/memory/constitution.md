<!--
SYNC IMPACT REPORT
==================
Version change: [unversioned template] → 1.0.0
Modified principles: N/A (initial ratification)
Added sections:
  - Core Principles (5 principles)
  - Tech Stack Constraints
  - Development Workflow
  - Governance
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ aligned (Constitution Check section present)
  - .specify/templates/spec-template.md ✅ aligned (no conflicts)
  - .specify/templates/tasks-template.md ✅ aligned (no conflicts)
Deferred TODOs: none
-->

# Custos Mensais Constitution

## Core Principles

### I. API-First Design

The backend REST API is the single source of truth for all business logic and data.
The frontend MUST NOT contain business rules — it is a pure consumer of the API.
All new features MUST be designed starting from the API contract (endpoint, request/response DTOs)
before any UI work begins.

### II. Simplicity First (YAGNI)

This is a personal single-user application. Complexity MUST be justified by a concrete
present need, not a hypothetical future requirement.
Abstractions, patterns (Repository, Mediator, etc.), and extra layers MUST NOT be introduced
unless a plain implementation demonstrably fails to meet a requirement.
Three similar lines are preferable to a premature abstraction.

### III. Frontend/Backend Separation

The frontend (`frontend/`) and backend (`backend/`) are independently deployable units.
They MUST communicate exclusively through the REST API — no shared code, no direct DB access
from the frontend, no tight coupling.
Environment-specific URLs and configuration MUST live in environment variables (`.env` files),
never hardcoded.

### IV. Data Integrity

Every `Expense` record MUST have all mandatory fields populated and validated before
being persisted: `Description`, `Amount`, `Category`, `DueDate`, `ReferenceMonth`, `Status`.
Monetary values MUST use `decimal` type — never `float` or `double`.
Optional fields (`PaymentMethod`, `Notes`) MUST be stored as `null` when blank, never as
empty strings.

### V. Deployment Parity

Code MUST behave identically in local development and production.
All environment differences MUST be expressed through environment variables.
Database initialization (`EnsureCreated` + seeding) MUST be idempotent and safe to run
on every startup in all environments.

## Tech Stack Constraints

The following stack is established and MUST NOT be changed without an explicit amendment
to this constitution:

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Backend | ASP.NET Core Web API (.NET 10) |
| Database | SQLite via Entity Framework Core |
| API Docs | Swagger / OpenAPI |

New dependencies MUST serve a clearly defined need. Adding a library to solve a problem
that existing stack primitives can handle reasonably is not permitted.

## Development Workflow

- All new work MUST start from a specification (`/speckit-specify`) before planning or coding.
- Breaking API changes (endpoint renames, removed fields, changed types) MUST be treated
  as MAJOR changes and require explicit review.
- CORS origins MUST be updated in `Program.cs` when new deployment URLs are introduced.
- Migrations are not used; `EnsureCreated` manages schema. Adding a migration strategy
  requires a constitution amendment.

## Governance

This constitution supersedes all other informal practices and conventions.
Amendments require: (1) a documented rationale, (2) version bump following semver rules,
and (3) propagation to all dependent templates and documentation.

All implementation plans MUST include a Constitution Check gate before Phase 0.
Complexity violations (deviations from Simplicity First) MUST be documented in the
plan's Complexity Tracking table with explicit justification.

**Version**: 1.0.0 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-04-20
