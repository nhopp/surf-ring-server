import Axios from 'axios';

import { SurfSpot } from '../models/surfSpot';
import { SurfSpotProperties } from '../models/surfSpotProperties';
import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';

export class SurfRingClient {
  private baseUrl: string;
  private headers = { 'content-type': 'application/json' };
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async addEarth(props: SurfZoneProperties): Promise<SurfZone> {
    const res = await Axios.post(`${this.baseUrl}/earth`, props, {
      headers: this.headers
    });

    return res.data;
  }

  public async getEarth(): Promise<SurfZone> {
    const res = await Axios.get(`${this.baseUrl}/earth`);
    return res.data;
  }

  public async addZone(props: SurfZoneProperties): Promise<SurfZone> {
    const res = await Axios.post(`${this.baseUrl}/surf-zones`, props, {
      headers: this.headers
    });

    return res.data;
  }

  public async getZone(id: string): Promise<SurfZone> {
    const res = await Axios.get(`${this.baseUrl}/surf-zones/${id}`);
    return res.data;
  }

  public async addSpot(props: SurfSpotProperties): Promise<SurfSpot> {
    const res = await Axios.post(`${this.baseUrl}/surf-spots`, props, {
      headers: this.headers
    });

    return res.data;
  }

  public async getSpot(id: string): Promise<SurfSpot> {
    const res = await Axios.get(`${this.baseUrl}/surf-spots/${id}`);
    return res.data;
  }
}
