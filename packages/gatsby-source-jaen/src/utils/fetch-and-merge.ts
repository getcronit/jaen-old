import deepmerge from 'deepmerge'

interface DataItem {
  url: string
}

async function fetchData(url: string): Promise<any | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching data from ${url}: ${error.message}`)
    return null
  }
}

export async function fetchMergeData<T extends {}>(
  dataArray: DataItem[]
): Promise<T> {
  let mergedData = {} as T

  for (const item of dataArray) {
    const nestedData: T = await fetchData(item.url)
    if (nestedData) {
      mergedData = deepmerge(mergedData, nestedData)
    }
  }

  return mergedData
}
