// import * as chai from 'chai';

// import { SurfRingClient } from '../../src/client/surfRingClient';
// import { SurfZone } from '../../src/models/surfZone';
// import { addDataToDb, addZoneJsonToDb, loadData } from '../../src/tools/initializeDb/initializeDb';

// describe('initializeDb', () => {
//   const expect = chai.expect;
//   const earthName = 'earth';
//   const surfRingClient = new SurfRingClient('');

//   describe('loadData', () => {
//     it('top zone is earth', () => {
//       const zoneJson = loadData();
//       expect(zoneJson.name).to.eq(earthName);
//       expect(zoneJson.zones.length).to.eq(8);
//     });
//   });

//   describe('addDataToDb', () => {
//     it('earth is added', async () => {
//       const zoneJson = loadData();
//       const zone = await addDataToDb(surfRingClient, zoneJson);
//       const earth = await surfRingClient.getEarth();
//       expect(zone).to.be.deep.eq(earth);
//       expect(zone.name).is.eq(zoneJson.name);
//       expect(earth.name).is.eq(earthName);
//       expect(earth.zones.length).is.eq(zoneJson.zones.length);
//       expect(earth.spots.length).is.eq(zoneJson.spots.length);
//     });

//     it('earth child zones are added to surf zones', async () => {
//       const zoneJson = loadData();
//       const earthZone = await addDataToDb(surfRingClient, zoneJson);

//       const childZones: SurfZone[] = [];
//       for (const childZoneId of earthZone.zones) {
//         const childZone = await surfRingClient.getZone(childZoneId);
//         childZones.push(childZone);
//       }

//       for (const childZoneJson of zoneJson.zones) {
//         expect(childZones.some((value) => value.name === childZoneJson.name));
//       }
//     });
//   });

//   describe('addZoneToDb', () => {
//     it('surf zone is added', async () => {
//       const zoneJson = loadData();
//       const surfZone = await addZoneJsonToDb(surfRingClient, zoneJson);
//       const foundZone = await surfRingClient.getZone(surfZone.id);
//       expect(surfZone).to.be.deep.eq(foundZone);
//       expect(surfZone.zones.length).to.be.eq(zoneJson.zones.length);
//     });

//     it('child zones are added', async () => {
//       const zoneJson = loadData();
//       const surfZone = await addZoneJsonToDb(surfRingClient, zoneJson);
//       const childZones: SurfZone[] = [];
//       for (const childZoneId of surfZone.zones) {
//         const childZone = await surfRingClient.getZone(childZoneId);
//         childZones.push(childZone);
//       }

//       for (const childZoneJson of zoneJson.zones) {
//         expect(childZones.some((value) => value.name === childZoneJson.name));
//       }
//     });
//   });
// });
