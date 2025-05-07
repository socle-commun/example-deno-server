# 🌐 example-deno-server

Un **template minimaliste** pour démarrer un projet **Deno REST API** moderne.
Forkez ce dépôt pour créer rapidement votre propre serveur Deno extensible, typé, et prêt pour le déploiement.

---

## 🚀 Pourquoi utiliser ce projet ?

✅ Serveur REST Deno prêt à l’emploi
✅ Architecture simple et modulaire (extensible)
✅ Commandes dev, tests, formatage, CI intégrées
✅ Workflow GitHub Actions pour déploiement automatique sur Deno Deploy
✅ Code typé TypeScript, avec import maps propres

---

## 🏗️ Structure du projet

```
.
├── .github/workflows/deploy.yml  # Workflow GitHub Actions pour déploiement sur release
├── .gitignore                    # Exclusions Git
├── ai.md                         # Notes IA (optionnel, exemple Comet)
├── deno.jsonc                    # Config Deno : tasks, lint, fmt, tests
├── import-map.json               # Mapping des imports
├── readme.md                     # Documentation principale
├── tsconfig.json                 # Options TypeScript
└── src/
    └── app/
        └── rest/
            └── main.ts           # Point d’entrée du serveur REST
```

---

## ⚙️ Prérequis

* **Deno ≥ 2.2.8** → [Installer Deno](https://deno.land/manual/getting_started/installation)
* Git → pour cloner et gérer votre fork
* Un éditeur recommandé : VS Code + extension officielle Deno

---

## 🔨 Cloner et démarrer un nouveau projet

1️⃣ **Forker ce dépôt**
Cliquez sur **Fork** sur GitHub pour créer votre copie.

2️⃣ **Cloner votre fork localement**

```bash
git clone git@github.com:<votre-utilisateur>/<votre-repo>.git
cd <votre-repo>
```

3️⃣ **Lancer le serveur**

```bash
deno task dev
```

Accédez à votre API sur [http://localhost:8000](http://localhost:8000).

---

## 🛠️ Commandes disponibles

| Commande                      | Description                              |
| ----------------------------- | ---------------------------------------- |
| `deno task dev`               | Lancer l’API REST en local               |
| `deno task serve`             | Utiliser `deno serve` pour démarrer      |
| `deno task test:dev`          | Lancer les tests en mode watch           |
| `deno task test:dev:coverage` | Générer un rapport de couverture         |
| `deno task test:ci`           | Lancer les tests + rapport JUnit pour CI |
| `deno fmt`                    | Formater le code                         |
| `deno lint`                   | Vérifier les problèmes de lint           |
| `deno check`                  | Vérifier les types TypeScript            |

---

## 🚀 Déploiement automatique (Deno Deploy)

✅ Le projet inclut un workflow GitHub Actions (`.github/workflows/deploy.yml`)
✅ Déclenchement automatique **uniquement** lors d’une publication de release (`published`)
✅ Nécessite d’avoir configuré un projet Deno Deploy avec le bon `project` name

Pour déployer :

* Publiez une nouvelle release sur GitHub → le code sera automatiquement uploadé vers Deno Deploy.

---

## 🌱 Personnalisation rapide

Pour adapter ce template à votre projet :
1️⃣ Changez le nom du projet dans `deno.jsonc` et `deploy.yml` (`project: "<votre_nom_de_projet>"`).
2️⃣ Ajoutez vos propres routes sous `src/app/rest/`.
3️⃣ Ajoutez vos dépendances dans `import-map.json`.
4️⃣ Activez la CI selon vos besoins (tests, lint, etc.).

---

## 📚 Ressources utiles

* 📖 [Documentation Deno](https://deno.land/manual)
* 🔗 [Modules tiers Deno (x)](https://deno.land/x)
* 🛠️ [Deno Deploy](https://deno.com/deploy)

---

## 👤 Auteur original

* **Nom** : Mistifiou
* **Email** : [mistifiou@yahoo.fr](mailto:mistifiou@yahoo.fr)
* **Repo source** : [socle-commun/example-deno-server](https://github.com/socle-commun/example-deno-server)

---

## 🏷️ Licence

MIT © Mistifiou
