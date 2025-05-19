
import { z } from '@/ext/deps.ts'

export const KeyPathParamsSchema = z.object({
    keypath: z.string().describe('Key path, e.g., "path.of.resource"')
})
