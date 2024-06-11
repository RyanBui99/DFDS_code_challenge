import axios, { type AxiosInstance } from "axios";
import { useRef } from "react";
// import type { NewVoyage } from "~/components/newVoyageForm";
import type { VesselsUnitType } from "~/pages/api/unitType/getAll";
import type { VesselsType } from "~/pages/api/vessel/getAll";
import type { ReturnType } from "~/pages/api/voyage/getAll";
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

  public async getVoyages() {
    return this.get<ReturnType>("/api/voyage/getAll");
  }

  public async createVoyage(voyage: any) {
    const path = "/api/voyage/create";
    console.log(voyage);
    const { data, status } = await this.instance.post(path, {
      ...voyage,
      unitTypes: ["20FL", "40FL"],
    });

    if (!(status < 300)) {
      throw new Error(`Error connection to ${path}: ${status}`);
    }

    return data;
  }

  public async deleteVoyage(id: string) {
    const path = `/api/voyage/delete/${id}`;
    const { data, status } = await this.instance.delete<undefined>(path);
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
