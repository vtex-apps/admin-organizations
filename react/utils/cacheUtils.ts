import { find, pathOr, propEq, reject } from 'ramda'
import GET_DOCUMENTS from '../graphql/queries/documents.graphql'
import {
  PERMISSIONS_ACRONYM,
  PERMISSIONS_FIELDS,
  PERMISSIONS_SCHEMA,
  ROLES_ACRONYM,
  ROLES_FIELDS,
  ROLES_SCHEMA
} from './consts'

export const updateCacheAddPermission = (
  cache: any,
  data: any,
  name: string,
  label: string
) => {
  try {
    const response: any = cache.readQuery(getPermissions())
    const idC = pathOr('', ['createMyDocument', 'cacheId'], data)
    const writeData = {
      ...getPermissions(),
      data: {
        myDocuments: [
          ...response.myDocuments,
          {
            __typename: 'Document',
            fields: [
              { key: 'id', value: idC, __typename: 'Field' },
              { key: 'name', value: name, __typename: 'Field' },
              { key: 'label', value: label, __typename: 'Field' },
            ],
            id: idC,
          },
        ],
      },
    }
    cache.writeQuery(writeData)
  } catch (e) {
    console.log(e)
  }
}

export const updateCacheUpdatePermission = (
  cache: any,
  data: any,
  name: string,
  label: string
) => {
  try {
    const response: any = cache.readQuery(getPermissions())
    const idC = pathOr('', ['updateMyDocument', 'cacheId'], data)

    // const selectedPermission = find(propEq('id', idC), pathOr([], ['myDocuments'],response))

    const permissions = pathOr([], ['myDocuments'], response).map((x: any) => {
      if (x.id === idC) {
        x.fields = [
          { key: 'id', value: idC, __typename: 'Field' },
          { key: 'name', value: name, __typename: 'Field' },
          { key: 'label', value: label, __typename: 'Field' },
        ]
      }
      return x
    })

    const writeData = {
      ...getPermissions(),
      data: {
        myDocuments: permissions,
      },
    }
    cache.writeQuery(writeData)
  } catch (e) {
    console.log(e)
  }
}

export const updateCacheDeletePermission = (cache: any, data: any) => {
  try {
    const id = pathOr('', ['deleteMyDocument', 'cacheId'], data)
    const response: any = cache.readQuery(getPermissions())

    const writeData = {
      ...getPermissions(),
      data: { myDocuments: reject(propEq('id', id), response.myDocuments) },
    }

    cache.writeQuery(writeData)
  } catch (e) {
    console.log(e)
  }
}

export const updateCacheAddRole = (
  cache: any,
  data: any,
  name: string,
  label: string,
  selectedPermissions: Permission[]
) => {
  try {
    const response: any = cache.readQuery(getRoles())
    const idC = pathOr('', ['createMyDocument', 'cacheId'], data)
    
    const permissions = selectedPermissions && selectedPermissions.length > 0 ? selectedPermissions.map(x => x.id): []
    const writeData = {
      ...getRoles(),
      data: {
        myDocuments: [
          ...response.myDocuments,
          {
            __typename: 'Document',
            fields: [
              { key: 'id', value: idC, __typename: 'Field' },
              { key: 'name', value: name, __typename: 'Field' },
              { key: 'label', value: label, __typename: 'Field' },
              {
                key: 'permissions',
                value: JSON.stringify(permissions),
                __typename: 'Field',
              },
            ],
            id: idC,
          },
        ],
      },
    }
    cache.writeQuery(writeData)
  } catch (e) {
    console.log(e)
  }
}

export const updateCacheEditRole = (
  cache: any,
  data: any,
  name: string,
  label: string,
  selectedPermissions: Permission[]
) => {
  try {
    const response: any = cache.readQuery(getRoles())
    const idC = pathOr('', ['updateMyDocument', 'cacheId'], data)
    const permissions = selectedPermissions && selectedPermissions.length > 0 ? selectedPermissions.map(x => x.id): []
    const roles = pathOr([], ['myDocuments'], response).map((x: any) => {
      if (x.id === idC) {
        x.fields = [
          { key: 'id', value: idC, __typename: 'Field' },
          { key: 'name', value: name, __typename: 'Field' },
          { key: 'label', value: label, __typename: 'Field' },
          {
            key: 'permissions',
            value: JSON.stringify(permissions),
            __typename: 'Field',
          },
        ]
      }
      return x
    })

    const writeData = {
      ...getRoles(),
      data: {
        myDocuments: roles,
      },
    }
    cache.writeQuery(writeData)
  } catch (e) {
    console.log(e)
  }
}

export const updateCacheDeleteRole = (cache: any, data: any) => {
  try {
    const id = pathOr('', ['deleteMyDocument', 'cacheId'], data)
    const response: any = cache.readQuery(getRoles())

    const writeData = {
      ...getRoles(),
      data: { myDocuments: reject(propEq('id', id), response.myDocuments) },
    }

    cache.writeQuery(writeData)
  } catch (e) {
    console.log(e)
  }
}


const getPermissions = () => {
  return {
    query: GET_DOCUMENTS,
    variables: {
      acronym: PERMISSIONS_ACRONYM,
      fields: PERMISSIONS_FIELDS,
      page: 1,
      pageSize: 100,
      schema: PERMISSIONS_SCHEMA,
    },
  }
}

const getRoles = () => {
  return {
    query: GET_DOCUMENTS,
    variables: {
      acronym: ROLES_ACRONYM,
      fields: ROLES_FIELDS,
      page: 1,
      pageSize: 100,
      schema: ROLES_SCHEMA,
    },
  }
}
