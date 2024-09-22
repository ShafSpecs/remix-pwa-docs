import type { EnhancedCache, Logger, WorkerLoadContext } from '@remix-pwa/sw'

export type ServiceWorkerContext = WorkerLoadContext & {
  cache: EnhancedCache
  logger: Logger
}