
import { Domain, kv, z } from '../../../../../ext/imports.ts'
import { KeyPathParamsSchema } from '../schemas.ts'

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
