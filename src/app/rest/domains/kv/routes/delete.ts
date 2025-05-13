import { Domain } from 'https://deno.land/x/sloth@1.0.0/src/deno/apps/rest/domain.class.ts'
import { z } from 'npm:zod'
import { KeyPathParamsSchema } from '../schemas.ts'
import { kv } from 'https://deno.land/x/sloth@1.0.0/src/deno/utils/kv/instance.ts'

export default (domain: Domain) => {
    domain
        .addRoute('delete', '/kv/{keypath}', async (c) => {
            const keypath = c.req.param('keypath').split('.')
            await kv.delete(keypath)

            return c.json({ key: keypath.join('.') })
        })
        .addParams(KeyPathParamsSchema)
        .addResponse(200, z.object({
            key: z.string()
        }))
}
