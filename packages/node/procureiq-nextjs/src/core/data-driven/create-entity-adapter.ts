import { HttpClient } from "@lib/http-client";
import { mapJson } from "./json-map";
import type { EntitySchema } from "./entity-schema.types";

export interface CrudPort<T> {
  list(): Promise<T[]>;
  get(id: string): Promise<T>;
  create(payload: Partial<T>): Promise<T>;
  update(id: string, payload: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
}

export function createEntityAdapter<T extends Record<string, unknown>>(schema: EntitySchema<T>): CrudPort<T> {
  const fromApi = (raw: unknown): T =>
    schema.validate.parse(schema.fromApi ? mapJson(raw as Record<string, unknown>, schema.fromApi) : raw);
  const toApi = (entity: Partial<T>) =>
    schema.toApi ? mapJson(entity as Record<string, unknown>, schema.toApi) : entity;

  return {
    async list() {
      const data = await HttpClient.get<any>(schema.endpoint);
      return (data as unknown[]).map(fromApi);
    },
    async get(id) {
      const data = await HttpClient.get<any>(`${schema.endpoint}/${id}`);
      return fromApi(data);
    },
    async create(payload) {
      const data = await HttpClient.post<any, any>(schema.endpoint, toApi(payload));
      return fromApi(data);
    },
    async update(id, payload) {
      const data = await HttpClient.patch<any, any>(`${schema.endpoint}/${id}`, toApi(payload));
      return fromApi(data);
    },
    async remove(id) {
      await HttpClient.delete<any>(`${schema.endpoint}/${id}`);
    },
  };
}
