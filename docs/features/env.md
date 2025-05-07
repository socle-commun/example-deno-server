# Environnement et Version

Cette page présente la **gestion des variables d’environnement** et de la version du projet.

Vous y trouverez :
✅ Les priorités de chargement (`.env`, système, par défaut)  
✅ Un tableau des variables principales utilisées  
✅ La méthode pour lire dynamiquement la version dans la documentation  
✅ La méthode pour rajouter des variables d'environnement

Indispensable pour configurer vos environnements (dev, prod) et garder un projet bien aligné.

---

## Priorité des valeurs

1️⃣ `.env` local (en dev)  
2️⃣ `Deno.env` système (en prod)  
3️⃣ Valeurs par défaut dans le code

---

## Variables principales

| Variable        | Description                                |
| --------------- | ------------------------------------------ |
| `APP_NAME`      | Nom affiché dans les logs                 |
| `APP_ENV`       | Environnement (`production`, `development`) |
| `APP_PORT`      | Port d’écoute                             |
| `APP_URL`       | URL publique                              |
| `BEARER_TOKEN`  | Token pour l’auth Bearer                  |
| `DOC_PATH`      | Endpoint OpenAPI (par défaut `/doc`)      |
| `UI_PATH`       | Endpoint Swagger UI (par défaut `/ui`)    |

---

## Version projet

Le fichier `deno.jsonc` contient le champ `version`, lu automatiquement pour l’afficher dans la documentation.

> **Astuce** : Voir la fonction `getProjectVersion()` pour comprendre le chargement dynamique.

---

## ⚙️ Implémentation détaillée

Le chargement des variables d’environnement est centralisé dans `src/app/rest/env.ts`.

### Points clés :

```ts
// ... du code sans intérêt ...

// Enum strict des clés supportées.
export enum $ENV {
    APP_NAME = "APP_NAME",
    APP_ENV = "ENV",
    // etc...
}
````

✅ **À retenir :**

* On utilise `std/dotenv` pour charger les variables locales.
* On sécurise l’absence du fichier `.env` avec un `try/catch`.
* L’enum `$ENV` force l’utilisation de clés connues.
* La fonction `getEnv()` applique toujours la priorité :
  `.env local` → `Deno.env système` → `valeur par défaut`

---

## 🛠️ Ajouter de nouvelles variables d’environnement

1️⃣ **Ajoutez une nouvelle clé dans l’enum `$ENV`**
Exemple :

```ts
export enum $ENV {
    NEW_FEATURE_FLAG = "NEW_FEATURE_FLAG",
    // ...
}
```

2️⃣ **Utilisez `getEnv()` pour lire la valeur**

```ts
// La valeur par défaut est optionelle
const newFeature = getEnv($ENV.NEW_FEATURE_FLAG, "false");
```

3️⃣ **Ajoutez la clé dans `.env.example`**
Pour aider les autres devs :

```
# NEW_FEATURE_FLAG=truc  # Active la nouvelle fonctionnalité expérimentale
```

✅ **Bonnes pratiques :**

* Toujours utiliser l’enum `$ENV` pour référencer vos clés.
* Documenter toute nouvelle variable ajoutée.
* Éviter d’utiliser directement `Deno.env.get()` ailleurs.