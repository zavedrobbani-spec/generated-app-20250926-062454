import { Hono } from "hono";
import type { Env } from './core-utils';
import { ConnectorEntity, JasminUserEntity, GroupEntity, RouteEntity, FilterEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { DashboardStats, Connector, ConnectorStatus, JasminUser, Group, Route, MessageFilter } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // New Jasmin Pulse Dashboard Route
  app.get('/api/dashboard-stats', (c) => {
    const now = new Date();
    const throughputHistory = Array.from({ length: 24 }, (_, i) => {
      const hour = (now.getHours() - 23 + i + 24) % 24;
      return {
        time: `${hour.toString().padStart(2, '0')}:00`,
        mps: Math.floor(Math.random() * (80 - 20 + 1) + 20) + Math.sin(i / 5) * 15,
      };
    });
    const mockData: DashboardStats = {
      system: {
        uptime: '12d 4h 32m',
        totalMps: 78.5,
        smscQueue: 12,
        userQueue: 4,
      },
      connectorStatus: {
        active: 8,
        inactive: 2,
        pending: 1,
        total: 11,
      },
      throughputHistory: throughputHistory,
    };
    return ok(c, mockData);
  });
  // CONNECTORS API
  app.get('/api/connectors', async (c) => {
    await ConnectorEntity.ensureSeed(c.env);
    const page = await ConnectorEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/connectors', async (c) => {
    const body = await c.req.json<Partial<Connector>>();
    if (!body.cid || !body.type || !body.host || body.port === undefined) {
      return bad(c, 'Missing required connector fields');
    }
    const newConnector: Connector = {
      id: crypto.randomUUID(),
      cid: body.cid,
      type: body.type,
      host: body.host,
      port: body.port,
      username: body.username,
      status: ConnectorStatus.DOWN,
      starts: 0,
      stops: 0,
      submit_sm_throughput: 0,
    };
    const created = await ConnectorEntity.create(c.env, newConnector);
    return ok(c, created);
  });
  app.put('/api/connectors/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<Connector>>();
    const connector = new ConnectorEntity(c.env, id);
    if (!(await connector.exists())) return notFound(c);
    const currentState = await connector.getState();
    const updatedState = { ...currentState, ...body, id: currentState.id, cid: currentState.cid };
    await connector.save(updatedState);
    return ok(c, updatedState);
  });
  app.delete('/api/connectors/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await ConnectorEntity.delete(c.env, id);
    if (!deleted) return notFound(c);
    return ok(c, { id, deleted });
  });
  // JASMIN USERS API
  app.get('/api/jasmin-users', async (c) => {
    await JasminUserEntity.ensureSeed(c.env);
    const page = await JasminUserEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/jasmin-users', async (c) => {
    const body = await c.req.json<Omit<JasminUser, 'uid' | 'id'>>();
    const uid = crypto.randomUUID();
    const newUser: JasminUser = { ...body, uid, id: uid };
    const created = await JasminUserEntity.create(c.env, newUser);
    return ok(c, created);
  });
  app.put('/api/jasmin-users/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<JasminUser>>();
    const user = new JasminUserEntity(c.env, id);
    if (!(await user.exists())) return notFound(c);
    await user.patch(body);
    return ok(c, await user.getState());
  });
  app.delete('/api/jasmin-users/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await JasminUserEntity.delete(c.env, id);
    if (!deleted) return notFound(c);
    return ok(c, { id, deleted });
  });
  // GROUPS API
  app.get('/api/groups', async (c) => {
    await GroupEntity.ensureSeed(c.env);
    const page = await GroupEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/groups', async (c) => {
    const body = await c.req.json<Omit<Group, 'id'>>();
    const newGroup: Group = { ...body, id: body.gid };
    const created = await GroupEntity.create(c.env, newGroup);
    return ok(c, created);
  });
  app.put('/api/groups/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<Group>>();
    const group = new GroupEntity(c.env, id);
    if (!(await group.exists())) return notFound(c);
    await group.patch(body);
    return ok(c, await group.getState());
  });
  app.delete('/api/groups/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await GroupEntity.delete(c.env, id);
    if (!deleted) return notFound(c);
    return ok(c, { id, deleted });
  });
  // ROUTES API
  app.get('/api/routes', async (c) => {
    await RouteEntity.ensureSeed(c.env);
    const page = await RouteEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/routes', async (c) => {
    const body = await c.req.json<Omit<Route, 'id'>>();
    const newRoute: Route = { ...body, id: crypto.randomUUID() };
    const created = await RouteEntity.create(c.env, newRoute);
    return ok(c, created);
  });
  app.put('/api/routes/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<Route>>();
    const route = new RouteEntity(c.env, id);
    if (!(await route.exists())) return notFound(c);
    await route.patch(body);
    return ok(c, await route.getState());
  });
  app.delete('/api/routes/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await RouteEntity.delete(c.env, id);
    if (!deleted) return notFound(c);
    return ok(c, { id, deleted });
  });
  // FILTERS API
  app.get('/api/filters', async (c) => {
    await FilterEntity.ensureSeed(c.env);
    const page = await FilterEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/filters', async (c) => {
    const body = await c.req.json<Omit<MessageFilter, 'id'>>();
    const newFilter: MessageFilter = { ...body, id: crypto.randomUUID() };
    const created = await FilterEntity.create(c.env, newFilter);
    return ok(c, created);
  });
  app.put('/api/filters/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<MessageFilter>>();
    const filter = new FilterEntity(c.env, id);
    if (!(await filter.exists())) return notFound(c);
    await filter.patch(body);
    return ok(c, await filter.getState());
  });
  app.delete('/api/filters/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await FilterEntity.delete(c.env, id);
    if (!deleted) return notFound(c);
    return ok(c, { id, deleted });
  });
}