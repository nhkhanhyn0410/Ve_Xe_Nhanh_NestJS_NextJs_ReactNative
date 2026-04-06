/* eslint-disable */
// Chạy: npx ts-node src/database/seeds/debug-routes.ts
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

async function debug(): Promise<void> {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/vexenhanh';
  await mongoose.connect(uri);
  const db = mongoose.connection.db!;

  console.log('\n=== STOP POINTS ===');
  const stops = await db.collection('stoppoints').find({}).project({ name: 1, type: 1 }).toArray();
  for (const s of stops) {
    console.log(`  ${s._id} | ${s.type} | ${s.name}`);
  }

  console.log('\n=== ROUTES ===');
  const routes = await db.collection('routes').find({}).toArray();
  for (const r of routes) {
    console.log(`\n  Route: ${r.routeCode} - ${r.routeName}`);
    if (r.stops && Array.isArray(r.stops)) {
      for (const s of r.stops) {
        console.log(`    [order=${s.order}] role=${s.role ?? 'N/A'} stopPointId=${s.stopPointId ?? 'N/A'} arrMin=${s.estimatedArrivalMinutes}`);
      }
    }
    // Check old format
    if (r.originId) console.log(`    OLD FORMAT -> originId=${r.originId}, destinationId=${r.destinationId}`);
  }

  console.log('\n=== TRIPS (date >= today) ===');
  const trips = await db.collection('trips').find({ departureTime: { $gte: new Date() } }).project({ routeId: 1, departureTime: 1, arrivalTime: 1, status: 1, finalPrice: 1 }).sort({ departureTime: 1 }).toArray();
  for (const t of trips) {
    const route = routes.find((r: any) => String(r._id) === String(t.routeId));
    console.log(`  ${route?.routeCode ?? '???'} | ${t.departureTime?.toISOString()} -> ${t.arrivalTime?.toISOString()} | ${t.finalPrice} VND | ${t.status}`);
  }

  await mongoose.disconnect();
}
debug().catch(console.error);
