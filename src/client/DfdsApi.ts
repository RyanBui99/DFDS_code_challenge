import axios, { type AxiosInstance } from "axios";
import { useRef } from "react";
import type { VesselsUnitType } from "~/pages/api/unitType/getAll";
import type { VesselsType } from "~/pages/api/vessel/getAll";
export class DfdsApi {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create();
  }

  public async get<T = unknown>(path: string): Promise<T> {
    const { data, status } = await this.instance.get<T>(path);

    if (!(status < 300)) {
      throw new Error(`Error connection to ${path}: ${status}`);
    }
    return data;
  }

  public async getUnitTypes() {
    return this.get<VesselsUnitType>("/api/unitType/getAll");
  }

  public async getVessels() {
    return this.get<VesselsType>("/api/vessel/getAll");
  }

  public async createVoyage(voyage: object) {
    const path = "/api/voyage/create";
    const { data, status } = await this.instance.post(path, voyage);

    if (!(status < 300)) {
      throw new Error(`Error connection to ${path}: ${status}`);
    }

    return data;
  }
}

export default function useDfdsApi() {
  const ref = useRef<DfdsApi>(new DfdsApi());

  return ref.current;
}
