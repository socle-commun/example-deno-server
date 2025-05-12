import $AppRest from 'https://deno.land/x/sloth@0.2.0/src/deno/apps/rest/mod.ts'

const { app } = await $AppRest(import.meta.url)

export default app;