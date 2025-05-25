import { DuckDBDataProtocol, type AsyncDuckDB } from '@duckdb/duckdb-wasm'

const bucket = 'sydney-pt-production-sydneyptbucketbucket-ocrsmbua'
const files = {
  'trips.parquet': `s3://${bucket}/processed/latest/trips.parquet`,
  'stop_times.parquet': `s3://${bucket}/processed/latest/stop_times.parquet`,
  'stops.parquet': `s3://${bucket}/processed/latest/stops.parquet`,
}

export async function loadFiles(db: AsyncDuckDB) {
  for (const [name, url] of Object.entries(files)) {
    await db.registerFileURL(name, url, DuckDBDataProtocol.S3, false)
  }
}

export async function getStopsForTrip(
  db: AsyncDuckDB,
  tripId: string,
  stopId: string,
) {
  const query = `
    WITH trip_stops AS (
      SELECT 
        stop_id,
        stop_sequence
      FROM stop_times.parquet
      WHERE trip_id = '${tripId}'
    )
    SELECT
      t.stop_id as id,
      REGEXP_REPLACE(s.stop_name, ' Station.*', '') as name
    FROM trip_stops t
    INNER JOIN stops.parquet s ON t.stop_id = s.stop_id
    WHERE t.stop_sequence > (
      SELECT stop_sequence 
      FROM trip_stops 
      WHERE stop_id = '${stopId}'
    )
    ORDER BY t.stop_sequence
  `
  const conn = await db.connect()
  const start = performance.now()
  const result = await conn.query(query)
  const end = performance.now()
  console.log(`Time taken: ${end - start} ms`)
  return result.toArray().map((row) => row.toJSON())
}

export async function getTripName(db: AsyncDuckDB, tripId: string) {
  const query = `
    SELECT
      trip_headsign
    FROM trips
    WHERE trip_id = '${tripId}';
  `
  const conn = await db.connect()
  const start = performance.now()
  const result = await conn.query(query)
  const end = performance.now()
  console.log(`Time taken: ${end - start} ms`)
  return result.toArray()[0].toJSON()['trip_headsign']
}
