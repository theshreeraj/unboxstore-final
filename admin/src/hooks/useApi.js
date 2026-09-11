import { useCallback, useEffect, useState } from 'react'
import { apiErrorMessage } from '../lib/api'

// Runs `fetcher` on mount (and whenever `deps` change), tracking loading/error
// state the same way across every admin page.
export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    return fetcher()
      .then((res) => setData(res))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refetch: load, setData }
}
