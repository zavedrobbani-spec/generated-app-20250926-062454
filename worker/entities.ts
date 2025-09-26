/**
 * Entities for Jasmin Pulse.
 */
import { IndexedEntity } from "./core-utils";
import type { Connector, JasminUser, Group, Route, MessageFilter } from "@shared/types";
import { ConnectorStatus, RouteType, FilterType } from "@shared/types";
import { MOCK_CONNECTORS, MOCK_JASMIN_USERS, MOCK_GROUPS, MOCK_ROUTES, MOCK_FILTERS } from "@shared/mock-data";
// CONNECTOR ENTITY
export class ConnectorEntity extends IndexedEntity<Connector> {
  static readonly entityName = "connector";
  static readonly indexName = "connectors";
  static readonly initialState: Connector = {
    id: "",
    cid: "",
    type: "smppc",
    status: ConnectorStatus.DOWN,
    host: "",
    port: 0,
    starts: 0,
    stops: 0,
    submit_sm_throughput: 0,
  };
  static seedData = MOCK_CONNECTORS;
  static keyOf(state: { id: string }): string { return state.id; }
}
// JASMIN USER ENTITY
export class JasminUserEntity extends IndexedEntity<JasminUser> {
  static readonly entityName = "jasmin-user";
  static readonly indexName = "jasmin-users";
  static readonly initialState: JasminUser = {
    id: "",
    uid: "",
    username: "",
    gid: "",
    balance: 0,
    throughput: 0,
    enabled: false,
  };
  static seedData = MOCK_JASMIN_USERS;
  static keyOf(state: { id: string }): string { return state.id; }
}
// GROUP ENTITY
export class GroupEntity extends IndexedEntity<Group> {
  static readonly entityName = "group";
  static readonly indexName = "groups";
  static readonly initialState: Group = {
    id: "",
    gid: "",
    enabled: false,
  };
  static seedData = MOCK_GROUPS;
  static keyOf(state: { id: string }): string { return state.id; }
}
// ROUTE ENTITY
export class RouteEntity extends IndexedEntity<Route> {
  static readonly entityName = "route";
  static readonly indexName = "routes";
  static readonly initialState: Route = {
    id: "",
    type: RouteType.STATIC,
    order: 0,
    connectorId: "",
    filters: [],
  };
  static seedData = MOCK_ROUTES;
  static keyOf(state: { id: string }): string { return state.id; }
}
// FILTER ENTITY
export class FilterEntity extends IndexedEntity<MessageFilter> {
  static readonly entityName = "filter";
  static readonly indexName = "filters";
  static readonly initialState: MessageFilter = {
    id: "",
    fid: "",
    type: FilterType.TRANSPARENT_FILTER,
    description: "",
    routes: [],
  };
  static seedData = MOCK_FILTERS;
  static keyOf(state: { id: string }): string { return state.id; }
}