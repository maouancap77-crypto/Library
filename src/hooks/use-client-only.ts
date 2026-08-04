'use client'

import { useSyncExternalStore } from 'react'

/**
 * Gera dados aleatórios apenas no cliente (evita mismatch de hidratação
 * quando se usa Math.random() em componentes que também são SSR-rendered).
 *
 * No servidor retorna `null` (ou o valor passado em `serverValue`);
 * no cliente retorna o resultado de `generator`, com cache por `cacheKey`
 * para evitar regenerar a cada render.
 */
export function useClientOnly<T>(
  cacheKey: string,
  generator: () => T,
  serverValue: T,
): T {
  const cache = getCache<T>(cacheKey)
  return useSyncExternalStore(
    emptySubscribe,
    () => {
      if (!cache.has(cacheKey)) {
        cache.set(cacheKey, generator())
      }
      return cache.get(cacheKey) as T
    },
    () => serverValue,
  )
}

const emptySubscribe = () => () => {}

const cacheStore = new Map<string, unknown>()

function getCache<T>(key: string): Map<string, T> {
  return cacheStore as unknown as Map<string, T>
}
