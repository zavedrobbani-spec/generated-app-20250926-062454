import { ApiResponse } from "@shared/types"
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...init })
  const json = (await res.json()) as ApiResponse<T>
  if (json.success) {
    return json.data;
  } else if (!json.success) {
    throw new Error(json.error || 'Request failed');
  }
  throw new Error('Request failed');
}