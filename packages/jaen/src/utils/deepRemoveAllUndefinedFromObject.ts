export function deepRemoveAllUndefinedFromObject(obj: any) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object')
      deepRemoveAllUndefinedFromObject(obj[key])
    else if (obj[key] === undefined) delete obj[key]
  })

  return obj
}
