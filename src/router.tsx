import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'
import { DuckDBProvider } from '@duckdb/react-duckdb'
import { DuckDBPlatform } from '@duckdb/react-duckdb'
import * as duckdb from '@duckdb/duckdb-wasm'
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import DBProvider from './integrations/duckdb/db-resolver'

// Create a new router instance
export const createRouter = () => {
  const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    mvp: {
      mainModule: duckdb_wasm,
      mainWorker: mvp_worker,
    },
    eh: {
      mainModule: duckdb_wasm_eh,
      mainWorker: eh_worker,
    },
  }

  const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING)

  const router = routerWithQueryClient(
    createTanstackRouter({
      routeTree,
      context: {
        ...TanstackQuery.getContext(),
      },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,

      Wrap: (props: { children: React.ReactNode }) => {
        return (
          <DuckDBPlatform bundles={MANUAL_BUNDLES} logger={logger}>
            <DuckDBProvider>
              <DBProvider>
                <TanstackQuery.Provider>
                  {props.children}
                </TanstackQuery.Provider>
              </DBProvider>
            </DuckDBProvider>
          </DuckDBPlatform>
        )
      },
    }),
    TanstackQuery.getContext().queryClient,
  )

  return router
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
