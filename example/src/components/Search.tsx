import { useSearch } from "@snek-at/jaen"
import { Spinner } from "@chakra-ui/react"
import React from "react"

export const Search: React.FC = () => {
  const search = useSearch()

  if (search.isLoading) {
    return <Spinner />
  }

  return <pre>{JSON.stringify(search.searchIndex, null, 2)}</pre>
}
