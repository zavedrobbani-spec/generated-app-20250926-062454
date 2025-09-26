// Generic API response wrapper
export type ApiResponse<T = unknown> = { success: true; data: T } | { success: false; error: string };
// DEMO TYPES - Can be removed or replaced
export type User = { id: string; name: string };
export type Chat = { id: string; title: string };
export type ChatMessage = { id: string; chatId: string; userId: string; text: string; ts: number };
// JASMIN PULSE TYPES
// From Blueprint: SystemStats
export interface SystemStats {
  uptime: string;
  totalMps: number;
  smscQueue: number;
  userQueue: number;
}
// From Blueprint: ConnectorStatusCounts (Renamed from ConnectorStatus to avoid conflict with enum)
export interface ConnectorStatusCounts {
  active: number;
  inactive: number;
  pending: number;
  total: number;
}
// From Blueprint: ThroughputSample
export interface ThroughputSample {
  time: string; // e.g., "14:00"
  mps: number;
}
// Main type for the dashboard endpoint
export interface DashboardStats {
  system: SystemStats;
  connectorStatus: ConnectorStatusCounts;
  throughputHistory: ThroughputSample[];
}
// Connector Management Types
export enum ConnectorStatus {
  UP = 'up',
  DOWN = 'down',
  RECONNECTING = 'reconnecting',
}
export type ConnectorType = 'smppc' | 'httpc';
export interface Connector {
  id: string;
  cid: string;
  type: ConnectorType;
  status: ConnectorStatus;
  host: string;
  port: number;
  username?: string;
  starts: number;
  stops: number;
  submit_sm_throughput: number;
}
// From Blueprint: JasminUser (to avoid conflict with demo User)
export interface JasminUser {
  id: string; // Required for IndexedEntity
  uid: string;
  username: string;
  gid: string;
  balance: number;
  throughput: number;
  enabled: boolean;
}
// From Blueprint: Group
export interface Group {
  id: string; // Required for IndexedEntity
  gid: string;
  enabled: boolean;
}
// Routing and Filter Types
export enum RouteType {
  STATIC = 'StaticMORoute',
  STANDARD = 'DefaultRoute',
  FAILOVER = 'FailoverMORoute',
  RANDOM = 'RandomRoundrobinMORoute',
}
export interface Route {
  id: string;
  type: RouteType;
  order: number;
  connectorId: string;
  filters: string[];
}
// New Filter Types for Phase 6
export enum FilterType {
  USER_FILTER = 'UserFilter',
  GROUP_FILTER = 'GroupFilter',
  SOURCE_ADDR_FILTER = 'SourceAddrFilter',
  DESTINATION_ADDR_FILTER = 'DestinationAddrFilter',
  SHORT_MESSAGE_FILTER = 'ShortMessageFilter',
  TRANSPARENT_FILTER = 'TransparentFilter',
}
export interface MessageFilter {
  id: string;
  fid: string;
  type: FilterType;
  description: string;
  routes: string[]; // Array of route orders
}