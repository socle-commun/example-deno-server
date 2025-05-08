import { z, ZodType } from 'npm:zod';
import { RouteConfig } from 'npm:@hono/zod-openapi'
import createRoute from './create-route.ts'
import { Context } from 'https://deno.land/x/hono@v4.3.7/context.ts'

export class Domain {
    name: string;
    routes: Route[] = [];

    constructor(name: string) {
        this.name = name;
    }

    addRoute(method: 'get' | 'post' | 'put' | 'delete', path: string, handler: (c: Context) => unknown) {
        const route = new Route(method, path, handler, [{name: this.name}]);
        this.routes.push(route);
        return route;
    }
}

export class Route {
    method: 'get' | 'post' | 'put' | 'delete';
    path: string;
    handler: (c: Context) => unknown;
    tags: {name: string, description?: string}[];
    // deno-lint-ignore no-explicit-any
    responses: Record<number, any> = {};

    constructor(method: 'get' | 'post' | 'put' | 'delete', path: string, handler: (c: Context) => unknown, tags: {name: string, description?: string}[]) {
        this.method = method;
        this.path = path;
        this.handler = handler;
        this.tags = tags;
    }

    get schema(): RouteConfig {
        return createRoute({
            method: this.method,
            path: this.path,
            tags: this.tags.map((t) => t.name),
            responses: this.responses,
        });
    }

    addResponse(status: number, schema: ZodType, description = `Response ${status}`) {
        this.responses[status] = {
            description,
            content: {
                'application/json': { schema }
            }
        };
        return this;
    }
}