# 🧠 ai.md — Contexte IA

Ce projet est un **template Deno REST API** conçu pour être :
✅ lisible, analysable et modifiable par une intelligence artificielle
✅ organisé avec des conventions claires et typées
✅ accompagné d’une documentation cohérente et d’une architecture modulaire

---

## 📌 Résumé du projet

* **Nom :** example-deno-server
* **Type :** REST API avec Deno + Hono
* **Langage :** TypeScript (strict)
* **Modules clés :**

  * `@hono/zod-openapi` → génération doc OpenAPI
  * `Deno KV` → rate limiter, stockage léger
  * Middlewares maison → auth, sécurité, gestion d’environnement

---

## 📂 Structure principale

| Dossier                    | Contenu                                 |
| -------------------------- | --------------------------------------- |
| `src/app/rest`             | Entrée API, gestion routes, middlewares |
| `src/ext/deno`             | Outils internes Deno (KV, utilitaires)  |
| `tests/e2e`                | Tests end-to-end                        |
| `.github/workflows`        | Workflows CI/CD GitHub                  |
| `doc/features` *(à créer)* | Documentation détaillée par feature     |

---

## 🔒 Sécurité

* Authentification : **Bearer token** (`BEARER_TOKEN`)
* Headers : protection XSS, nosniff, frame, HSTS
* Limitation : **kvRateLimiter** → 100 req/min par IP
* CORS : restreint selon environnement

---

## 🔗 Points importants IA

✅ Le projet expose les métadonnées dans `deno.jsonc` (`version`, etc.)
✅ La configuration dynamique est centralisée dans `env.ts`
✅ Les middlewares sont typés et organisés proprement
✅ Les routes sont prévues pour être injectées dynamiquement (tag TODO)

---

## 🛠️ Conventions et pratiques

* Tous les nouveaux modules doivent être typés (TypeScript strict)
* Toute feature nouvelle doit être documentée séparément sous `doc/features/`
* Les commits suivent une logique simple et claire, sans surcharge
* Les tests E2E sont prioritaires pour garantir la stabilité

---

## 🎯 Objectif IA

> **Ta mission :**
> Analyser, documenter, améliorer, ou étendre ce projet sans casser ses garanties de sécurité, ses conventions typées, et son architecture modulaire.
