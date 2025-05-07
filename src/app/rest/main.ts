import $AppRest from '@/ext/sloth/apps/rest/mod.ts'

const entryDir = new URL('.', import.meta.url).pathname

const { app } = await $AppRest(entryDir)

export default app;