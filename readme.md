# 🌐 example-deno-server

A **minimalist Deno REST API template** designed to quickly start a modern, strictly typed, secure, and extensible project.

Want [More documentation](https://socle-commun.github.io/example-deno-server) ?

---

## 🤖 AI Contact

To interact directly with Denono (AI assistant):
[https://chatgpt.com/share/681dff9a-5b9c-800d-8c0b-9c96a3d0c968](https://chatgpt.com/g/g-681df8c2c6fc819196c8c7b692c62663-denono)

---

## 🚀 Why use this project?

✅ Ready-to-use Deno REST server  
✅ Modular architecture (Domain Driven Routing)  
✅ Integrated security: Bearer auth, rate limiter, security headers, CORS  
✅ Automated OpenAPI/Swagger documentation  
✅ Clean, strictly typed TypeScript code  
✅ Automatic deployment via Deno Deploy (GitHub Actions)  
✅ Simple environment management with `.env`  

---

## 🏗️ Project structure

```
.
├── .github/workflows/         # CI/CD workflows
├── deno.jsonc                 # Deno config (tasks, lint, etc.)
├── import-map.json            # Import mappings
├── tsconfig.json              # TypeScript config
├── readme.md                  # Main documentation
├── .env.example               # Example local environment
├── src/
│   ├── app/
│   │   └── rest/
│   │       ├── main.ts        # Main REST API entry point
│   │       ├── domains/       # Business domains (routes organized by logic)
│   │       └── middlewares/   # Middlewares: auth, security, rate limit
│   └── ext/
│       └── deno/              # KV utilities, internal tools
└── tests/
    └── e2e/                   # End-to-end tests
```

---

## ⚙️ Prerequisites

* **Deno ≥ 2.2.8** → [Install Deno](https://deno.land/manual/getting_started/installation)  
* Git  
* **VS Code** recommended with the official Deno extension  

---

## 🔨 Getting started

```bash
git clone git@github.com:socle-commun/example-deno-server.git
cd example-deno-server
cp .env.example .env
deno task dev
```

Local access → [http://localhost:8000](http://localhost:8000)  
Swagger UI → [http://localhost:8000/ui](http://localhost:8000/ui)  
OpenAPI JSON → [http://localhost:8000/doc](http://localhost:8000/doc)  

---

## 🛠️ Available commands

| Command                       | Description                    |
| ----------------------------- | ------------------------------ |
| `deno task dev`               | Run the REST API locally       |
| `deno task serve`             | Quick start via `deno serve`   |
| `deno task test:dev`          | Run tests in watch mode        |
| `deno task test:dev:coverage` | Generate coverage report       |
| `deno task test:ci`           | Run CI tests with JUnit report |
| `deno fmt`                    | Format the code                |
| `deno lint`                   | Check for lint issues          |
| `deno check`                  | Verify TypeScript types        |

---

## 🌱 Environment management

| Variable      | Description                   |
| ------------- | ----------------------------- |
| APP\_NAME     | Application name              |
| APP\_ENV      | `development` or `production` |
| APP\_PORT     | Listening port                |
| APP\_URL      | Full URL for CORS             |
| DOC\_PATH     | OpenAPI doc path (`/doc`)     |
| UI\_PATH      | Swagger UI path (`/ui`)       |
| BEARER\_TOKEN | Global authentication token   |

➡ See `.env.example` for a ready-to-use template.

Variables load in order: `.env` → `Deno.env` → hardcoded defaults.

---

## 🔒 Integrated security

✅ **Bearer** authentication (middleware `bearer-auth`)  
✅ Security headers (XSS, nosniff, HSTS, etc.) via `security-headers`  
✅ Rate limiter (100 req/min per IP) via `kv-rate-limiter`  
✅ Dynamic CORS (middleware `cors`)  

> Recommended middleware order: auth → headers → CORS → rate limit

📖 See details: [`docs/features/`](docs/features/)

---

## 🏷️ Domain Driven Routing

Each business domain is isolated in `src/app/rest/domains`:

* Routes, schemas, and handlers encapsulated in a `Domain` instance  
* Auto-discovery and dynamic injection via `$AppRest`  
* OpenAPI metadata automatically extracted  

![Domain Driven Routing diagram](docs/features/domain-driven-routing.md)

📖 Detailed docs: [`docs/features/domain-driven-routing.md`](docs/features/domain-driven-routing.md)

---

## 📚 Documentation and Swagger UI

* Raw JSON → `/doc`  
* Swagger UI → `/ui`  

Automatically generated with **@hono/zod-openapi**.

---

## 🧪 Tests

* End-to-end tests (`tests/e2e/`) to verify:
  ✅ Response codes  
  ✅ Server behavior (start/stop)  

Example:

```bash
deno task test:dev
```

> 📂 Place fixtures and test data under `tests/e2e/fixtures/` (create if needed).

---

## 📝 Conventions to follow

✅ Strict TypeScript typing  
✅ Mandatory documentation for new features under `docs/features/`  
✅ Priority to e2e tests for stability assurance  
✅ Follow security best practices (auth, headers, rate limit, CORS)  

---

## 🌟 Contributions

✅ Fork the project  
✅ Create a branch for your changes  
✅ Respect conventions (typing, architecture, security) before any PR  
✅ Open a detailed **pull request**

---

## 🏷️ License

MIT © Socle-Commun
