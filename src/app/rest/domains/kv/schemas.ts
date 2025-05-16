
import { z } from '../../../../ext/imports.ts'

export const KeyPathParamsSchema = z.object({
    keypath: z.string().describe('Key path, e.g., "path.of.resource"')
})
