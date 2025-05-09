# 🧠 AI Context

This project is a **Deno REST API template** designed to be:
✅ Readable, analyzable, and modifiable by artificial intelligence
✅ Structured with strict TypeScript conventions
✅ Coherently documented and modularly organized

---

## 📌 Project summary

* **Name:** example-deno-server
* **Type:** REST API Deno + Hono
* **Language:** Strict TypeScript

### Main modules

* `@hono/zod-openapi` → Generates OpenAPI documentation and Swagger UI
* **Deno KV** → Lightweight storage, used for the rate limiter
* **Domain Driven Routing** → Extensible architecture, dynamically detects business domains
* **Custom middlewares** → Bearer authentication, security headers, rate limiting, CORS

---

## 📂 Key structure

| Folder                 | Description                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| `src/app/rest`         | API entry point, routing, middlewares, automatic domain discovery |
| `src/app/rest/domains` | Business domains (routes, handlers, schemas, grouped by logic)    |
| `src/ext/deno`         | Internal helpers and utilities for Deno (notably KV)              |
| `tests/e2e`            | Priority end-to-end tests                                         |
| `.github/workflows`    | CI/CD workflows for testing and deployment                        |
| `doc/features`         | Separate documentation for each middleware and feature            |

---

## 🔒 Security

✅ **Bearer authentication** (`BEARER_TOKEN` from `.env`)
✅ Security headers: XSS, nosniff, HSTS, frame guard
✅ Rate limiter: 100 requests per minute per IP via Deno KV
✅ CORS: Dynamically configured based on environment

> 📌 Recommended middleware order: auth → headers → CORS → rate limit

---

## 🎯 AI goals

✅ Help analyze, document, improve, and extend the project **without ever breaking**:

* The integrated security guarantees
* The strict TypeScript typing
* The modular, scalable architecture

✅ Preserve the integrity of the **Domain Driven Routing** model.

✅ Follow all defined conventions:

* Mandatory documentation under `doc/features/` for every new feature
* Priority on e2e tests to ensure stability and quality
* Rigorous typing and full TypeScript coverage

---

## ☄️ AI suggestions

* Generate automatic coverage reports (types, security, schemas)
* Automate verification of Zod schemas used in domains
* Check consistency of exposed OpenAPI metadata
* Monitor Deno and Hono dependency updates to prevent breaking changes
* Assist in generating typed, convention-compliant code snippets

✅ This document is ready to be integrated into the project and can serve as the **official AI guide** for all future analyses.

If you want, I can also generate a **`plan-ai.md`** file to lay out more advanced AI strategies 🚀

