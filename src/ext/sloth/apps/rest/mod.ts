import { OpenAPIHono } from 'npm:@hono/zod-openapi';
import { SwaggerTheme, SwaggerThemeNameEnum } from "npm:swagger-themes";
import getEnv from '@/ext/deno/env/mod.ts';
import { bearerAuthMiddleware } from '@/app/rest/middlewares/bearer-auth.ts';
import { cors } from 'npm:hono/cors';
import { getProjectVersion } from '@/ext/deno/util/get-project-version.ts'
import { kvRateLimiter } from '@/app/rest/middlewares/kv-rate-limiter.ts';
import { defaultOptions } from './default-options.ts'
import { $AppRestOptions } from './types.ts'
import { join } from 'https://deno.land/std@0.224.0/path/join.ts'

export type $ENV  =
    "APP_NAME" |
    "ENV" |
    "APP_PORT"|
    "DOC_PATH" |
    "UI_PATH" |
    "BEARER_TOKEN" |
    "APP_URL" 

export default async function $AppRest(__entryDir: string = join(Deno.cwd(), "src/app/rest"), options: Partial<$AppRestOptions> = defaultOptions) {
    //📌 Merge des options par défaut si seulement une partie des options est définie
    const opts: $AppRestOptions = { ...options, ...defaultOptions }

    //📌 Chargement des variables d'environnement
    const docPath = getEnv<$ENV>("DOC_PATH", opts.docPath) as string;
    const uiPath = getEnv<$ENV>("UI_PATH", opts.uiPath) as string;
    const appName = getEnv<$ENV>("APP_NAME", opts.appName) as string;
    const isProd = getEnv<$ENV>("ENV", opts.defaultEnv) === 'production'
    const appUrl = getEnv<$ENV>("APP_URL") as string;
    const version = await getProjectVersion()

    //📌 Afficher un message d'initialisation
    console.log(`🚀 [${appName}] REST API is starting...`);

    //📌 Créer l'application Hono avec la prise en charge d'OpenAPI
    //☄️todo: Lancement de l'application Hono sans la prise en charge d'openApi pour économiser les ressources au maximum
    const app = new OpenAPIHono();
    if (isProd) {
        app.use('*', cors({
            origin: [appUrl],
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
        }))

        app.use('*', kvRateLimiter({
            max: 100, // Limite de 100 requêtes par minute
            windowMs: 60 * 1000, // Fenêtre de temps de 1 minute
        }) as any)

        app.use("*", (await import('./middlewares/security-headers.ts')).default as any)
    }

    app.use('*', bearerAuthMiddleware)

    app.onError((err, c) => {
        console.error(err)

        return c.json(
            { error: isProd ? 'Internal Server Error' : err.stack },
            500
        )
    })

    //☄️todo: Intégrer les routes
    //   Pour chaque dossier dans le dossier "domains"
    //   Rajoute un tag représentant le domaine / Nom de dossier
    //   Lance la fonction par défaut du mod pour chargement des routes.


    // ajout du swagger-ui
    const theme = new SwaggerTheme();
    const themeContent = theme.getBuffer(SwaggerThemeNameEnum.DARK);

    // Documentation OpenAPI disponible à /doc
    app.doc(docPath, {
        openapi: '3.0.0',
        info: {
            version,
            title: `${appName} API Docs`,
        },
        tags: [
            //☄️todo: Gestion des tags
        ],
    });
    app.get(uiPath, (c) => {
        return c.html(opts.uiHtmlFactory(themeContent, docPath, appName, version))
    })
    return {
        app,
        meta: { appName, docPath, uiPath, version: await getProjectVersion() }
    }
}
