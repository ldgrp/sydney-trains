import type { AsyncDuckDB } from '@duckdb/duckdb-wasm'
import { useDuckDB, useDuckDBResolver } from '@duckdb/react-duckdb'
import { createContext, useContext, useEffect, useState } from 'react'
import { loadFiles } from './queries'

export const dbContext = createContext<{
  db: AsyncDuckDB | null
  loading: boolean
}>({
  db: null,
  loading: false,
})

export default function DBProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const db = useDuckDB()
  const resolver = useDuckDBResolver()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDb() {
      if (!db.resolving()) {
        const resolvedDb = await resolver()
        if (resolvedDb) {
          await loadFiles(resolvedDb)
          console.log('Files loaded')
          setLoading(false)
        }
      }
    }

    loadDb()
  }, [db, resolver])

  return (
    <dbContext.Provider value={{ db: db.value, loading }}>
      {children}
    </dbContext.Provider>
  )
}

export function useDB() {
  const db = useContext(dbContext)
  return db
}
