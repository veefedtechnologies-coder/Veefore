You are my Principal Security + Reliability Engineer. The repository is a full‑stack social media management & automation app with workspaces/teams and integrations to social platforms. It likely contains incorrect coding methods, unused/leftover code, logic breaks, data‑leak risks, weak auth, performance issues, and poor SEO/accessibility because much of it was generated rapidly.

Your job: plan → scan → fix → prove. Do not skip anything. Prefer secure, stable, standards‑based solutions. Replace hacky code with proven patterns. Make the codebase consistently TypeScript‑strict, lint‑clean, tested, observable, GDPR‑ready, and production‑deployable.

0) Repo‑wide Working Rules

Work across entire monorepo (backend, frontend, workers, scripts, infra, CI). Do not limit to open files.

When multiple techniques exist, choose the most secure & production‑tested; implement, don’t leave TODOs.

Maintain backwards compatibility of public APIs when possible; if breaking, add a migration and update callers.

Keep a running CHANGELOG.md and a SECURITY_FIXES.md summarizing each change and reason.

Use conventional commits in PRs you create.

1) Discovery & Inventory (produce a plan first)

List stacks and entry points (e.g., Node/Express/TypeScript, React/Next.js/Vite, Tailwind, Drizzle ORM, MongoDB/Postgres).

Create an Architecture.md diagram: services, data flows, webhook paths, queues, caches, and external APIs.

Generate a Data Map: PII, tokens, secrets, where stored, retention, and which features access them.

Run and save results:

npm audit --json, pnpm audit, or equivalent

depcheck + ts-prune (dead/unused exports)

eslint (strict) + typescript --noEmit

gitleaks (or truffleHog) for secret leakage history

license-checker for dependency licenses

Propose the Fix Plan (Security → Reliability → Performance → SEO/Accessibility → DX/CI) and then execute it.

2) Replace Incorrect Coding Methods (Top 20 Code‑Smell Fixes)

For each pattern, search → list occurrences → refactor. Explain changes in SECURITY_FIXES.md.

Auth tokens in localStorage/****sessionStorage → Use HTTP‑only, Secure, SameSite=strict cookies or server‑side token store.

dangerouslySetInnerHTML** or unsanitized HTML** → Remove; if unavoidable, sanitize with DOMPurify on the server side and apply strict CSP.

Direct string concatenation in SQL/queries → Replace with prepared statements / parameterized queries.

Missing input validation → Add zod/yup validators at all API boundaries (req body/query/params) + type‑safe DTOs.

Weak/hand‑rolled crypto → Use libsodium/crypto with modern algorithms; never store raw tokens; encrypt at rest.

Long async chains without timeouts → Add axios/fetch timeouts, circuit breakers, retries with jitter, and idempotency keys for external calls.

Non‑idempotent webhooks → Implement idempotency storage keyed by event id + signature.

Secrets in code → Move to env; add checks that fail startup if required env vars are missing (zod‑based env.ts).

Leaky logs (PII/tokens) → Centralize logging via pino; redact sensitive fields; disable stack traces in prod responses.

Unscoped multi‑tenant queries → Enforce tenant_id/workspace_id scoping in all reads/writes; add tests that prevent cross‑tenant access.

Improper CORS → Restrict to explicit origins; disallow * with credentials; preflight caching.

**eval****, new Function, dynamic **require → Remove/replace with safe alternatives.

Mutable shared state/singletons causing race conditions → Use stateless functions or guarded caches/queues.

Unbounded file uploads → Enforce size/type checks, virus scan hooks, store via pre‑signed URLs, never disk temp in prod.

Missing cleanup in React effects → Fix memory leaks; convert legacy class components to function + hooks.

Over‑fetching and duplicated requests → Use TanStack Query (React Query) with caching, dedup, and suspense where supported.

Blocking CPU on Node → Offload to workers/queue (BullMQ/Redis or Cloud Tasks), or native modules if needed.

Deprecated/legacy APIs → Replace with maintained libraries; pin versions; regenerate types.

Hand‑rolled password auth (if any) → Use battle‑tested libs with argon2id/bcrypt, per‑user salt, throttling.

Insufficient error boundaries → Add React Error Boundaries and server error middleware that returns sanitized errors.

3) Security Hardening (OWASP ASVS / Top 10 aligned)

Backend (Express/Node)

Add helmet with strict CSP (nonce/hash), HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

Rate limit + slow‑down (
e.g., express-rate-limit + express-slow-down), per IP + per token.

Request size limits; reject large JSON/multipart bodies.

CSRF protection for cookie‑based sessions; exempt safe endpoints only.

CORS least‑privilege; disable X-Powered-By.

Validate all inputs (zod schemas) and centralize sanitization.

Add RBAC/ABAC middleware: roles (owner/admin/member), resource‑scoped checks, and permission maps.

Audit log for privileged/admin actions (who, when, what; immutable append).

Secrets: use process env only at boot; never log; support KMS/secret manager when available.

Dependency security: add npm‑audit‑fix PRs, enable GitHub Dependabot, CodeQL, and Dependency Review in CI.

OAuth & Social Integrations

Use OAuth 2.0 PKCE where available; always use state and verify issuer.

Encrypt access/refresh tokens at rest; store minimal scopes; rotate and revoke properly.

Webhooks: verify signatures/HMAC per provider. For Meta/Instagram Graph, validate X-Hub-Signature-256 with the App Secret; reject mismatches; log but do not expose reasons.

Implement idempotency and replay protection (timestamp window + nonce).

Build a Token Hygiene job: detect near‑expiry tokens, refresh with backoff, revoke on anomalies.

Multi‑Tenancy & Data Isolation

All queries must include tenant/workspace scoping; add unit tests that attempt cross‑tenant access and must fail.

Ensure signed URLs and resources are namespaced per tenant.

Transport & Storage

Enforce HTTPS only; HSTS.

At rest: encrypt sensitive columns/fields (PII, tokens) using libsodium/NaCl; store KMS key refs.

Backups: encrypted; test restore; define retention and deletion policies.

4) GDPR & Global Privacy (DSAR‑ready)

Implement:

Consent tracking (cookies, marketing, analytics) with a banner; store consent per user/device.

Privacy endpoints:

GET /privacy/export → user‑level export (JSON + CSV where relevant)

POST /privacy/delete → erasure workflow with soft‑delete window + hard delete job

PATCH /privacy/rectify → update inaccurate data

Data Inventory document (systems, categories, retention, purposes, processors).

Data Minimization: remove fields not needed; truncate logs; pseudonymize if possible.

Records of Processing: docs/ropas.md with purposes/legal bases.

Processor DPAs: store placeholders/links under docs/compliance/.

5) Reliability & Observability

Structured logging (pino) with request correlation IDs (header x-request-id); propagate through services.

Health (/healthz) and readiness (/readyz) endpoints.

Metrics via prom-client (Node): latency, throughput, error rate, external API durations, queue depth.

Sentry (or equivalent) for exceptions + performance traces; scrub PII.

Feature flags for risky changes; default safe.

6) Performance & Scalability

Introduce HTTP caching (ETag/Last‑Modified) and server‑side caching (Redis) for frequent external API responses.

Batch external calls; use concurrency control; avoid thundering herds.

Optimize DB: indexes, N+1 fixes, transactional integrity; write migrations (Drizzle) with safe rollbacks.

Move long tasks to workers/queues (BullMQ); make API endpoints fast.

Image optimization: preprocessing, responsive sizes, CDN cache headers.

7) Frontend: SEO, Accessibility, UX, Correctness

Ensure SSR or SSG (Next.js) where possible; otherwise add runtime SEO via react-helmet-async.

Add meta tags: title/description, OpenGraph, Twitter, canonical, locale, favicon; generate sitemap.xml + robots.txt.

Add JSON‑LD for key pages (Organization, Product, FAQ).

Core Web Vitals: lazy‑load heavy modules, code‑split routes, prefetch critical assets.

Accessibility: semantic roles, keyboard focus, ARIA labels, color contrast, skip‑to‑content, form labels, reduced motion.

State management: adopt TanStack Query (server sync) + Zustand or similar for UI state. Remove prop drilling/anti‑patterns.

Remove unused components/assets; convert legacy components to modern patterns.

8) Testing: Prevent Regressions & Leaks

Unit (Jest/Vitest) for utils, validators, auth flows.

Integration tests for API routes with mocked providers; verify RBAC per role.

E2E (Playwright) for critical journeys (auth, workspace switch, connect account, schedule post, webhook receipt).

Security tests: run OWASP ZAP baseline in CI; forbid high/medium alerts.

Contract tests for webhooks (signature verification, idempotency, replay rejection).

9) CI/CD & Supply‑Chain Security

Add GitHub Actions (or Replit equivalents):

lint + typecheck + test on PRs

build + dockerize (non‑root user, minimal base, no dev deps)

CodeQL SAST, Dependency Review, Secret Scanning, Trivy image scan

Lighthouse CI (threshold ≥ 90 Perf/SEO/Best Practices/Accessibility)

ZAP baseline

Require status checks to pass before merge; protect main.

10) Deployment Hardening

Container best practices (detailed)

Drop Linux capabilities: run containers with minimal capabilities (no CAP_SYS_ADMIN, etc.).

Read-only filesystem: mount app filesystem read-only and only open specific writable volumes (logs, uploads) as needed.

No root: create and use a non-root user inside container; set USER in Dockerfile.

Healthchecks: include HEALTHCHECK in Dockerfile and configure k8s liveness/readiness probes.

Pinned base image SHA: never use floating tags (node:18); use node:18@sha256:<digest> to ensure reproducible builds.

Small minimal base: prefer slim/distroless images to reduce attack surface.

Image scanning: run Trivy/Clair in CI; fail on critical/high vulnerabilities per policy.

Immutable images: image must be immutable and immutable tags in deploys (no latest in prod).

ENV schema with fail-fast + example env.ts

Why: catching missing/misconfigured secrets at boot avoids insecure defaults in prod.

Use zod to validate env at startup; crash if required keys are missing.

Add a small shell check in CI to prevent deploying images that don’t pass env validation (e.g., node -e "require('./dist/env').env").

Secrets & Key Management

Never commit secrets to repo. Enforce gitleaks in CI.

Use a secret manager (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault). Map secrets to env at deploy-time.

Encrypt any persisted secrets (tokens) using a KMS key; store only ciphertext in DB.

Implement automatic rotation for credentials where the provider supports it. Document rotation procedures.

Runtime security & platform hardening

Pod security: use Kubernetes PodSecurity admission (restrict privileged, disallow hostPath mounts).

Network policies: use CNI network policies to restrict cross-namespace traffic (deny-by-default).

Resource limits: set CPU/memory requests & limits to avoid noisy neighbor problems.

Service mesh (optional): mTLS for inter-service traffic (e.g., Istio, Linkerd) for zero-trust internal comms.

Read-only root filesystem: ensure securityContext.readOnlyRootFilesystem: true on pods except for mounted volumes.

Seccomp & AppArmor: enable seccomp profile (e.g., runtime/default) and AppArmor where supported.

Healthchecks, probes, and graceful shutdown

Liveness: detects deadlocked app — short probe hitting /healthz/live.

Readiness: only mark ready after warmups (DB connected, caches primed) via /healthz/ready.

Startup probe: for slow booting apps.

Graceful shutdown: handle SIGTERM/SIGINT, stop accepting new requests, drain queues, finish inflight requests (grace period), flush logs, close DB connections.

Image supply chain & CI scans

Build-time SBOM generation (Syft) and store with release artifacts.

Trivy/Clair scan in CI; block on critical/high vulnerabilities.

CodeQL + SAST in PRs.

Provenance: sign images (cosign) and verify signatures at deploy-time.

Deployment strategies & rollback

Prefer blue/green or canary deployments with traffic shifting and metrics/alerts gating promotion.

Automate rollbacks when error rates or latency exceed thresholds.

Maintain tagged releases and immutable artifacts (images, DB migration versions).

Backups, DR, and restore testing

Backups: regular encrypted backups of DB, storage buckets, and critical config.

Restore tests: quarterly restore drills to a staging account with documented RTO/RPO targets.

Offsite copies: store backups in another region/account.

Retention & deletion policy: align with GDPR/data retention requirements.

Monitoring, alerts, and SLOs

Define SLOs (e.g., 99.9% uptime monthly for API).

Monitor key signals: error rate, p95/p99 latency, event queue depth, token refresh failures, webhook processing errors.

Alerting: PagerDuty/Slack for P1; aggregated daily digests for P2. Ensure on-call runbook links in alerts.

Canary & chaos testing

Run small canaries to validate infra changes.

Introduce periodic chaos experiments (e.g., terminate a pod) in staging to validate resilience.

Secrets scanning + pre-deploy checks (CI)

CI must run:

gitleaks to prevent accidental commits

npm audit / pnpm audit or dependency checks

trivy on built image

lighthouse-ci for frontend snapshots

zap-baseline for basic security scans

Incident runbook (starter)

Detect: alert received (error rate spike / outage).

Triage: Slack/PagerDuty — declare incident and assign owner.

Contain: rollback or isolate faulty service, scale up healthy workers, disable risky feature flag.

Mitigate: apply hotfix or redirect traffic to previous stable release.

Restore: fully recover services; verify health and SLOs.

Investigate: generate timeline, root cause, and affected customers.

Remediate: code/infra fixes + tests.

Postmortem: publish within 72 hours, include action items and deadlines.

Include runbook files under docs/runbooks/incidents.md and link to playbooks for common failure modes (DB failover, token leak, webhook storm).

11) Test & Dev Artifact Cleanup

Identify and delete leftover test/demo files (e.g., *.test.js, *.spec.js, old mocks, playground scripts) that should not ship to production.

Ensure only necessary seed/migration/test fixtures remain under test/ or __tests__/ and are excluded from production builds (via .dockerignore, .npmignore, build scripts).

Run a scan to confirm no unused scripts/components/assets are bundled.

✅ Acceptance Criteria

At the end of this refactor, the repo must:

Pass strict type‑checking and linting with zero errors.

Contain no known security vulnerabilities (npm audit clean, CodeQL/Trivy clean).

Achieve ≥90 Lighthouse score across categories (Perf, SEO, Best Practices, A11y).

Pass E2E security & regression tests.

Have clear Architecture.md, Data Map, CHANGELOG.md, and SECURITY_FIXES.md docs.

Be fully GDPR‑compliant with working privacy endpoints.

Be production‑ready: secure, fast, observable, and deployable with minimal risk.

