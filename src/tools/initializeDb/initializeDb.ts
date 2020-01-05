import * as config from 'config';

import { SurfRingClient } from '../../client/surfRingClient';
import { SurfSpot } from '../../models/surfSpot';
import { SurfZone } from '../../models/surfZone';
import { SurfZoneProperties } from '../../models/surfZoneProperties';
import { SurfSpotJson } from './surfSpotJson';
import { SurfZoneJson } from './surfZoneJson';
import * as data from '/Users/nhopper/Documents/GitHub/nhopp/wannasurf-scraper/allZones.json';

main();

function main() {
  const zoneJson = loadData();
  const surfRingUrl = config.get<string>('surfRingUrl');
  console.log(`using surfRing.url: ${surfRingUrl}`);
  const client = new SurfRingClient(surfRingUrl);

  addDataToDb(client, zoneJson);
}

export function loadData(): SurfZoneJson {
  const zoneJson = data as SurfZoneJson;
  return zoneJson;
}

export async function addDataToDb(
  client: SurfRingClient,
  zoneJson: SurfZoneJson
): Promise<SurfZone> {
  const childZones: SurfZone[] = [];
  for (const childZoneJson of zoneJson.zones) {
    const childZone = await addZoneJsonToDb(client, childZoneJson);
    childZones.push(childZone);
  }
  const earthZone = await client.addEarth(
    new SurfZoneProperties(
      zoneJson.name,
      childZones.map((zone) => zone.id),
      []
    )
  );
  return earthZone;
}

export async function addZoneJsonToDb(
  client: SurfRingClient,
  zoneJson: SurfZoneJson
): Promise<SurfZone> {
  const childZones: SurfZone[] = [];
  for (const childZoneJson of zoneJson.zones) {
    if (childZoneJson === null) {
      console.error(`zone named ${zoneJson.name} contains a null child zone`);
    } else {
      const childZone = await addZoneJsonToDb(client, childZoneJson);
      childZones.push(childZone);
    }
  }

  const childSpots: SurfSpot[] = [];
  for (const childSpotJson of zoneJson.spots) {
    childSpots.push(await addSpotJsonToDb(client, childSpotJson));
  }

  return await client.addZone(
    new SurfZoneProperties(
      zoneJson.name,
      childZones.map((zone) => zone.id),
      childSpots.map((spot) => spot.id)
    )
  );
}

function addSpotJsonToDb(
  client: SurfRingClient,
  spotJson: SurfSpotJson
): Promise<SurfSpot> {
  return client.addSpot(spotJson);
}
