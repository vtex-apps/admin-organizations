export const documentSerializer = (documents: any) => {
  
  if (!documents || documents.length === 0) {
    return []
  }

  const fieldReducer = (fieldsAccumulator: any, field: any) => {
    fieldsAccumulator[field.key] = field.value
    return fieldsAccumulator
  }

  const documentReducer = (documentAccumulator: any, document: any) => {
    documentAccumulator.push(document.fields.reduce(fieldReducer, {}))
    return documentAccumulator
  }

  return documents.reduce(documentReducer, [])
}
