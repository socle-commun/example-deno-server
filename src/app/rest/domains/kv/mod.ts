import { Domain } from 'https://deno.land/x/sloth@1.0.0/src/deno/apps/rest/domain.class.ts'
import deleteRoute from './routes/delete.ts'
import getRoute from './routes/get.ts'
import setRoute from './routes/set.ts'

export default () => {
    const domain = new Domain('📦 KV Store', import.meta.url)

    getRoute(domain);
    setRoute(domain);
    deleteRoute(domain);

    return domain
}
