import { Domain } from 'https://deno.land/x/sloth@0.1.0/src/deno/apps/rest/domain.class.ts'

export default () => {
    const domain = new Domain('📦 KV Store', import.meta.url)
    return domain
}
