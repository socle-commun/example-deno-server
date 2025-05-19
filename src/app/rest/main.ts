import { getProjectVersion } from '@/lib/utils/get-project-version.ts'
import kvRateLimiter from '@/lib/utils/middlewares/kv-rate-limiter.ts'
import { bearerAuthMiddleware } from '@/lib/utils/middlewares/bearer-auth.ts'
import securityHeadersMiddleware from '@/lib/utils/middlewares/security-headers.ts'
import { SwaggerUI, SwaggerTheme, SwaggerThemeNameEnum, cors, OpenAPIHono, getEnv } from '@/ext/deps.ts'
import kvDomain from './domains/kv/mod.ts';
import systemDomain from './domains/system/mod.ts';

export type ENV =
    "APP_NAME" |
    "ENV" |
    "APP_PORT" |
    "DOC_PATH" |
    "UI_PATH" |
    "BEARER_TOKEN" |
    "APP_URL" |
    "BASE_URL";

//📌 Chargement des variables d'environnement
const docPath = getEnv<ENV>("DOC_PATH", '/doc') as string;
const uiPath = getEnv<ENV>("UI_PATH", '/ui') as string;
const appName = getEnv<ENV>("APP_NAME", 'Unknown App') as string;
const isProd = getEnv<ENV>("ENV", 'dev') === 'production'
const appUrl = getEnv<ENV>("APP_URL") as string;
const baseUrl = getEnv<ENV>("BASE_URL", "/app") as string;
const version = await getProjectVersion();

console.log(`🚀 [${appName}] REST API is starting...`);

//📌 Créer l'application Hono avec la prise en charge d'OpenAPI
//☄️todo: Lancement de l'application Hono sans la prise en charge d'openApi pour économiser les ressources au maximum
const app = new OpenAPIHono();
if (isProd) {
    //📌 Add production mandatory headers
    app.use('*', cors({
        origin: [appUrl],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    }))

    app.use('*', kvRateLimiter({
        max: 100, // Limite de 100 requêtes par minute
        windowMs: 60 * 1000, // Fenêtre de temps de 1 minute
    }) as (c: unknown, next: unknown) => Promise<void>)

    app.use("*", securityHeadersMiddleware as (c: unknown, next: unknown) => Promise<void>)
}

app.use(baseUrl, bearerAuthMiddleware as (c: unknown, next: unknown) => Promise<void>)

app.onError((err, c) => {
    console.error(err.stack)
    //📌 On app error, display only standard error message
    return c.json(
        { error: isProd ? 'Internal Server Error' : err.stack },
        500
    )
})

const domains = [
    kvDomain(),
    systemDomain(),
]

domains.forEach((domain) => {
    domain.routes.forEach((route) => {
        console.log(`📜 [${route.domain.name}] ${route.method.toUpperCase()} (${route.path})`)
        route.path = baseUrl + route.path;
        // deno-lint-ignore no-explicit-any
        app.openapi(route.schema, route.handler as any)
    })
})

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
    tags: domains.map((domain) => ({ name: domain.name })),
});
app.get(uiPath, (c) => {
    return c.html(`
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="description" content="${appName} API Doc" />
            <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBhcmlhLWhpZGRlbj0idHJ1ZSIgcm9sZT0iaW1nIgoJcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmlld0JveD0iMCAwIDIwMCAyMDAiPgoJPGRlZnM+CgkJPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB4Mj0iNzUlIiB5MT0iMCUiIHkyPSI3NSUiPgoJCQk8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkYwMDY2Ij48L3N0b3A+CgkJCTxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0JEMzRGRSI+PC9zdG9wPgoJCTwvbGluZWFyR3JhZGllbnQ+Cgk8L2RlZnM+Cgk8cGF0aCBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAwIDEwMCkiPgoJCTxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImQiCgkJCXZhbHVlcz0iTTYwLjEsLTUwLjZDNzIuNywtMzIuMSw3NC4yLC03LjQsNjYsOS43QzU3LjksMjYuOCw0MCwzNi4zLDIzLDQyLjVDNiw0OC43LC0xMC4xLDUxLjUsLTI2LjEsNDYuNkMtNDIuMiw0MS44LC01OC4yLDI5LjQsLTYxLjUsMTQuMkMtNjQuOCwtMC45LC01NS40LC0xOC44LC00MywtMzcuM0MtMzAuNiwtNTUuOCwtMTUuMywtNzQuOSw0LjIsLTc4LjJDMjMuNywtODEuNiw0Ny40LC02OS4yLDYwLjEsLTUwLjZaOwogICAgICAgICAgICBNNTAuMiwtMzguN0M2My4xLC0yNCw3MCwtMy4yLDY3LjksMTkuMkM2NS43LDQxLjYsNTQuNCw2NS42LDM2LjMsNzMuOEMxOC4xLDgxLjksLTYuOSw3NC4yLC0yNyw2Mi4yQy00Ny4xLDUwLjIsLTYyLjIsMzMuOSwtNjUuNSwxNkMtNjguNywtMiwtNjAuMiwtMjEuNiwtNDcuNCwtMzYuNEMtMzQuNSwtNTEuMiwtMTcuMiwtNjEuMSwwLjcsLTYxLjdDMTguNywtNjIuMywzNy40LC01My41LDUwLjIsLTM4LjdaOwogICAgICAgICAgICBNNjUuOSwtNTAuNUM4MC43LC0zNC4xLDg0LjYsLTcsNzUuNSwxMUM2Ni40LDI5LDQ0LjQsMzcuNywyMyw0OC4yQzEuNiw1OC42LC0xOS4xLDcwLjcsLTMxLjIsNjQuOUMtNDMuNCw1OSwtNDYuOSwzNS4zLC00OSwxNC41Qy01MS4yLC02LjMsLTUxLjksLTI0LjIsLTQzLjUsLTM5LjFDLTM1LjEsLTU0LjEsLTE3LjYsLTY2LjEsNCwtNjkuM0MyNS42LC03Mi42LDUxLjIsLTY2LjksNjUuOSwtNTAuNVo7CiAgICAgICAgICAgIE01Mi4zLC00Mi4zQzYyLjEsLTI5LjQsNjAuNiwtOCw1Ni4xLDEzLjNDNTEuNywzNC42LDQ0LjQsNTUuOCwzMCw2Mi45QzE1LjcsNzAsLTUuNiw2MywtMjIuMSw1Mi41Qy0zOC42LDQyLC01MC4zLDI4LjEsLTU2LDEwLjZDLTYxLjgsLTYuOCwtNjEuNSwtMjcuOCwtNTEuMSwtNDAuOUMtNDAuOCwtNTQsLTIwLjQsLTU5LjEsMC40LC01OS41QzIxLjIsLTU5LjgsNDIuNSwtNTUuMyw1Mi4zLC00Mi4zWjsKICAgICAgICAgICAgTTYwLjEsLTUwLjZDNzIuNywtMzIuMSw3NC4yLC03LjQsNjYsOS43QzU3LjksMjYuOCw0MCwzNi4zLDIzLDQyLjVDNiw0OC43LC0xMC4xLDUxLjUsLTI2LjEsNDYuNkMtNDIuMiw0MS44LC01OC4yLDI5LjQsLTYxLjUsMTQuMkMtNjQuOCwtMC45LC01NS40LC0xOC44LC00MywtMzcuM0MtMzAuNiwtNTUuOCwtMTUuMywtNzQuOSw0LjIsLTc4LjJDMjMuNywtODEuNiw0Ny40LC02OS4yLDYwLjEsLTUwLjZaIgoJCQlkdXI9IjEwcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+Cgk8L3BhdGg+Cjwvc3ZnPg==" />
            <title>🚀 ${appName} [${version}] API Docs</title>
            <script>
            </script>
            <style>
              ${themeContent}
              .scheme-container {
                background: #1c1c21 !important;
              }
              .opblock-tag small div.renderedMarkdown > p {
                  color: whitesmoke;
                  text-align: end;
                  font-weight: bold;
                  margin-right: 1%;
              }
              .opblock-tag small div.renderedMarkdown > p > em {
                  border-bottom: 1px solid white;
                  padding-bottom: 3px;
              }
              .swagger-ui .opblock .opblock-summary-path-description-wrapper {
                  justify-content: space-between;
              }
              span, .parameter__name, .response-col_status, .title
              {
                  color:rgb(191, 195, 202) !important;
              }
    
            </style>
          </head>
          <body>
            <div style="text-align:center; margin-top:20px;">
                <img width="200px" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBhcmlhLWhpZGRlbj0idHJ1ZSIgcm9sZT0iaW1nIgoJcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmlld0JveD0iMCAwIDIwMCAyMDAiPgoJPGRlZnM+CgkJPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB4Mj0iNzUlIiB5MT0iMCUiIHkyPSI3NSUiPgoJCQk8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkYwMDY2Ij48L3N0b3A+CgkJCTxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0JEMzRGRSI+PC9zdG9wPgoJCTwvbGluZWFyR3JhZGllbnQ+Cgk8L2RlZnM+Cgk8cGF0aCBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAwIDEwMCkiPgoJCTxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImQiCgkJCXZhbHVlcz0iTTYwLjEsLTUwLjZDNzIuNywtMzIuMSw3NC4yLC03LjQsNjYsOS43QzU3LjksMjYuOCw0MCwzNi4zLDIzLDQyLjVDNiw0OC43LC0xMC4xLDUxLjUsLTI2LjEsNDYuNkMtNDIuMiw0MS44LC01OC4yLDI5LjQsLTYxLjUsMTQuMkMtNjQuOCwtMC45LC01NS40LC0xOC44LC00MywtMzcuM0MtMzAuNiwtNTUuOCwtMTUuMywtNzQuOSw0LjIsLTc4LjJDMjMuNywtODEuNiw0Ny40LC02OS4yLDYwLjEsLTUwLjZaOwogICAgICAgICAgICBNNTAuMiwtMzguN0M2My4xLC0yNCw3MCwtMy4yLDY3LjksMTkuMkM2NS43LDQxLjYsNTQuNCw2NS42LDM2LjMsNzMuOEMxOC4xLDgxLjksLTYuOSw3NC4yLC0yNyw2Mi4yQy00Ny4xLDUwLjIsLTYyLjIsMzMuOSwtNjUuNSwxNkMtNjguNywtMiwtNjAuMiwtMjEuNiwtNDcuNCwtMzYuNEMtMzQuNSwtNTEuMiwtMTcuMiwtNjEuMSwwLjcsLTYxLjdDMTguNywtNjIuMywzNy40LC01My41LDUwLjIsLTM4LjdaOwogICAgICAgICAgICBNNjUuOSwtNTAuNUM4MC43LC0zNC4xLDg0LjYsLTcsNzUuNSwxMUM2Ni40LDI5LDQ0LjQsMzcuNywyMyw0OC4yQzEuNiw1OC42LC0xOS4xLDcwLjcsLTMxLjIsNjQuOUMtNDMuNCw1OSwtNDYuOSwzNS4zLC00OSwxNC41Qy01MS4yLC02LjMsLTUxLjksLTI0LjIsLTQzLjUsLTM5LjFDLTM1LjEsLTU0LjEsLTE3LjYsLTY2LjEsNCwtNjkuM0MyNS42LC03Mi42LDUxLjIsLTY2LjksNjUuOSwtNTAuNVo7CiAgICAgICAgICAgIE01Mi4zLC00Mi4zQzYyLjEsLTI5LjQsNjAuNiwtOCw1Ni4xLDEzLjNDNTEuNywzNC42LDQ0LjQsNTUuOCwzMCw2Mi45QzE1LjcsNzAsLTUuNiw2MywtMjIuMSw1Mi41Qy0zOC42LDQyLC01MC4zLDI4LjEsLTU2LDEwLjZDLTYxLjgsLTYuOCwtNjEuNSwtMjcuOCwtNTEuMSwtNDAuOUMtNDAuOCwtNTQsLTIwLjQsLTU5LjEsMC40LC01OS41QzIxLjIsLTU5LjgsNDIuNSwtNTUuMyw1Mi4zLC00Mi4zWjsKICAgICAgICAgICAgTTYwLjEsLTUwLjZDNzIuNywtMzIuMSw3NC4yLC03LjQsNjYsOS43QzU3LjksMjYuOCw0MCwzNi4zLDIzLDQyLjVDNiw0OC43LC0xMC4xLDUxLjUsLTI2LjEsNDYuNkMtNDIuMiw0MS44LC01OC4yLDI5LjQsLTYxLjUsMTQuMkMtNjQuOCwtMC45LC01NS40LC0xOC44LC00MywtMzcuM0MtMzAuNiwtNTUuOCwtMTUuMywtNzQuOSw0LjIsLTc4LjJDMjMuNywtODEuNiw0Ny40LC02OS4yLDYwLjEsLTUwLjZaIgoJCQlkdXI9IjEwcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+Cgk8L3BhdGg+Cjwvc3ZnPg==" />
            </div>
            ${SwaggerUI({ url: docPath })}
        </body>
        </html>
      `)
})

export default app;
