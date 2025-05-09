# 🧠 AI Context

This project is a **Deno REST API template** designed to be:
✅ readable, analyzable, and modifiable by artificial intelligence
✅ organized with clear, typed conventions
✅ accompanied by coherent documentation and modular architecture

---

## 📌 Project Summary

* **Name:** example-deno-server
* **Type:** REST API with Deno + Hono
* **Language:** TypeScript (strict mode)
* **Key Modules:**

  * `@hono/zod-openapi` → generates OpenAPI documentation
  * `Deno KV` → rate limiter, lightweight storage
  * **Domain Driven Routing** → modular, domain-based architecture
  * Custom middlewares → auth, security, environment handling

---

## 📂 Main Structure

| Folder                 | Content                                                                         |
| ---------------------- | ------------------------------------------------------------------------------- |
| `src/app/rest`         | API entry point, route handling, middlewares, automatic domain discovery        |
| `src/app/rest/domains` | Business domains organized using **Domain Driven Routing**                      |
| `src/ext/deno`         | Internal Deno utilities (KV, helpers)                                           |
| `tests/e2e`            | End-to-end tests                                                                |
| `.github/workflows`    | GitHub CI/CD workflows                                                          |
| `doc/features`         | Feature-specific documentation, including `domain-driven-routing.md` (included) |

---

## 🔒 Security

* Authentication: **Bearer token** (`BEARER_TOKEN`)
* Headers: XSS protection, nosniff, frame guard, HSTS
* Rate Limiting: **kvRateLimiter** → 100 req/min per IP
* CORS: environment-restricted

---

## 🔗 Key AI Considerations

✅ The project exposes metadata in `deno.jsonc` (`version`, etc.)
✅ Dynamic configuration is centralized in `env.ts`
✅ Middlewares are typed and cleanly organized
✅ Routes are dynamically injected by discovering **Domains** (Domain Driven Routing)
✅ Each domain returns a unified `Domain` descriptor, ensuring extensibility and modularity

---

## 🛠️ Conventions & Practices

* All new modules must be strictly typed (TypeScript strict)
* Every new feature must be documented separately under `doc/features/`
* Commits follow a simple and clear logic, no unnecessary complexity
* E2E tests are prioritized to ensure stability
* Routes must be added via the **Domain Driven Routing** system to stay aligned with the architecture

---

## 🎯 AI Objective

> **Your mission:**
> Analyze, document, improve, or extend this project without breaking its security guarantees, strict typing conventions, or modular architecture.
> You must also ensure the integrity of the **Domain Driven Routing** model and adhere to the documented conventions.
