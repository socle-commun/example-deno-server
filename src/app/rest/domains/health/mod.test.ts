import { startTestServer } from '../../../../../tests/e2e/helper.ts'

Deno.test('GET /health returns status ok and valid payload', async () => {
    const server = await startTestServer()
    try {
        const response = await fetch(`${server.url}/health`)
        if (response.status !== 200) {
            throw new Error(`Expected 200 OK, got ${response.status}`)
        }

        const body = await response.json()

        // Vérifie les champs principaux
        if (body.status !== 'ok' && body.status !== 'degraded') {
            throw new Error(`Invalid status value: ${body.status}`)
        }
        if (typeof body.uptime !== 'number' || body.uptime < 0) {
            throw new Error(`Invalid uptime value: ${body.uptime}`)
        }
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(body.timestamp)) {
            throw new Error(`Invalid timestamp format: ${body.timestamp}`)
        }
    } finally {
        await server.stop()
    }
})
