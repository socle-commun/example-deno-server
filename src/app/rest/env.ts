import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts"
import { join } from "https://deno.land/std@0.224.0/path/mod.ts"

// Le fichier .env est utilisé uniquement en dev.
// Le block try/catch évite ici l'erreur MissingEnvVarsError qui est jetée quand aucun fichier .env n'est présent.
// En prod, on utilise les variables d'environnement du système (Deno.env.get())
let env: { [key: string]: string } = {};
try {
    env = await load({ 
        envPath: join(Deno.cwd(), ".env"), 
        allowEmptyValues: true
    })    
} catch (error) {
    if((error as Error).name !== "MissingEnvVarsError") {
        console.warn((error as Error).stack)
    }
}

/**
 * Récupère une variable d'environnement.
 * Priorité : .env local > Deno.env > valeur par défaut.
 *
 * @param key Nom de la variable
 * @param defaultValue Valeur par défaut (optionnelle)
 * @returns La valeur trouvée ou defaultValue
 */
export default function getEnv(key: $ENV, defaultValue?: string): string | undefined {
	return env[key] || Deno.env.get(key) || defaultValue
}

export enum $ENV {
    APP_NAME = "APP_NAME",
    APP_ENV = "ENV",
    APP_PORT = "APP_PORT",
    DOC_PATH = "DOC_PATH",
    UI_PATH = "UI_PATH",
    BEARER_TOKEN = "BEARER_TOKEN",
    APP_URL= "APP_URL",
}