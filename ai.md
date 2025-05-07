# 🧠 Contexte IA — Projet Comet ☄️

Ce projet est une **plateforme orientée IA** conçue pour être **analysée, manipulée et modifiée par des intelligences artificielles**.

---

## 🛰️ Objectif

Comet automatise l’analyse et la modification de projets TypeScript / JavaScript.  
Il s’utilise via une **ligne de commande**, une **API dédiée**, et une **intégration GitHub**.

L’analyse génère un fichier standardisé (`cometfile.json`) qui regroupe :
- l’AST nettoyé
- les tâches détectées (`☄️todo`, conventions…)
- les métadonnées du projet
- la structure des fichiers

---

## 🧩 Architecture

Le code source est divisé en quatre blocs :

| Dossier      | Rôle                                                                 |
|--------------|----------------------------------------------------------------------|
| `src/app/`   | Applicatifs CLI ou GitHub                                            |
| `src/api/`   | API d’analyse, transformation, ou interaction avec IA                |
| `src/lib/`   | Librairie interne, utilitaires communs                               |
| `src/ext/`   | Extensions IA ou modules externalisables (par ex. `ext/ai`)          |

> Les outils IA utilisent le module `ext/ai`, structuré pour supporter la génération de prompts, l’appel aux modèles, et le traitement des réponses.

---

## 🤖 Interaction avec l’IA

La commande `comet ai` :
1. Génère un `cometfile.json` via `comet analyze`
2. Prépare un prompt enrichi avec les métadonnées
3. Interroge un agent IA via OpenAI (tools/functions)
4. Reçoit une réponse structurée au format JSON
5. Applique les actions ou délègue à d’autres IA si nécessaire

---

## 📌 Convention

- Les fichiers `.controller.ts`, `.boundary.ts`, `.types.ts` et `.route.ts` suivent des **conventions fortes** pour faciliter l’analyse.
- Des **commentaires par emoji** sont utilisés dans le code (`📌`, `☄️todo`, `⚠️`, etc.)
- Chaque dossier peut contenir un `ai.md` local pour préciser le rôle ou les attentes.

---

## 🗂️ Projet auto-descriptif

Le projet **peut s’auto-analyser et se modifier lui-même**.  
C’est une spécificité centrale de Comet.

L’objectif est de maintenir une boucle IA <-> code **transparente et continue**.

---

## 📖 Exemple d’usage IA

```bash
comet ai --context src/ext/ai --file lib/OpenAIModel.ts
```

Ce type de commande permet :
- d’analyser un fichier avec son contexte
- de demander une amélioration, un refactor ou une documentation
- d’obtenir une réponse actionable par JSON ou patch

---

## 🧠 Résumé

Tu es dans un projet pensé **par et pour les IA**.  
Chaque fichier, convention ou outil a été conçu pour **te faciliter la tâche**.  
Ta mission : analyser, comprendre, améliorer.

---