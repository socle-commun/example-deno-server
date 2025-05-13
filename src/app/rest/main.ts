import $AppRest from 'https://deno.land/x/sloth@1.0.0/src/deno/apps/rest/mod.ts'

const { app } = await $AppRest(import.meta.url, {
    importCallback: (path: string) => {
        return import(`../../../${path}`)
    }
})

export default app;