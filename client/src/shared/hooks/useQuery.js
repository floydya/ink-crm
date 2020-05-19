import { useEffect, useMemo, useState } from "react"
import { useLocation, useHistory } from "react-router-dom"

const useQuery = (name, defaultValue = null) => {
  const { search, pathname } = useLocation()
  const history = useHistory()
  const searchParams = useMemo(() => new URLSearchParams(search), [search])
  const [value, setValue] = useState(searchParams.get(name) ?? defaultValue)
  useEffect(() => {
    if (value) searchParams.set(name, value)
    else searchParams.delete(name)
    history.push({
      pathname, search: `?${searchParams.toString()}`
    })
  }, [history, name, pathname, searchParams, value])
  return [value, setValue]
}

export default useQuery
