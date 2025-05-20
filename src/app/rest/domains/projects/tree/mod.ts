
import { Domain, Context, z } from '../../../../../ext/deps.ts'

export const GetTreeQuerySchema = z.object({
    list: z.string().optional().describe('If set to true, lists all keys under the keypath prefix')
})

export const GetTreeResponseSchema = z.object({
    list: z.string().optional().describe('If set to true, lists all keys under the keypath prefix')
})

export default () => {
    const domain = new Domain('🛠️ Project tree', import.meta.url)

    domain
        .addRoute('get', '/tree', async (c) => {
            // const listMode = c.req.query('list') === 'true'
            
        })
        .addQuery(GetTreeResponseSchema)
        .addResponse(200, z.unknown())
        .addResponse(404, z.object({ error: z.literal('Key not found') }))


    return domain
}
