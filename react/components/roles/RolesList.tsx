import { find, pathOr, propEq } from 'ramda'
import React, { useState } from 'react'
import { Spinner, Table } from 'vtex.styleguide'
import DOCUMENTS from '../../graphql/queries/documents.graphql'
import '../../styles.global.css'
import '../../styles.global.css'
import {
  PERMISSIONS_ACRONYM,
  PERMISSIONS_FIELDS,
  PERMISSIONS_SCHEMA,
  ROLES_ACRONYM,
  ROLES_FIELDS,
  ROLES_SCHEMA
} from '../../utils/consts'
import { documentSerializer } from '../../utils/documentSerializer'
import RoleDelete from './RoleDelete'
import RoleModal from './RoleModal'

import { useQuery } from 'react-apollo'

const RolesList = () => {
  const {
    loading: loadingPermissions,
    error: errorPermissions,
    data: permissionsData,
  } = useQuery(DOCUMENTS, {
    variables: {
      acronym: PERMISSIONS_ACRONYM,
      fields: PERMISSIONS_FIELDS,
      page: 1,
      pageSize: 100,
      schema: PERMISSIONS_SCHEMA,
    },
  })

  const {
    loading: loadingRoles,
    error: errorRoles,
    data: rolesData,
  } = useQuery(DOCUMENTS, {
    variables: {
      acronym: ROLES_ACRONYM,
      fields: ROLES_FIELDS,
      page: 1,
      pageSize: 100,
      schema: ROLES_SCHEMA,
    },
  })

  const permissions: Permission[] = documentSerializer(
    pathOr([], ['myDocuments'], permissionsData)
  )
  const roles: Role[] = documentSerializer(
    pathOr([], ['myDocuments'], rolesData)
  )

  const [tableDensity, setTableDensity] = useState('low')
  const [searchValue, setSearchValue] = useState('')
  const [sharedRole, setSharedRole] = useState({} as Role)
  const [openRoleModal, setOpenRoleModal] = useState(false)
  const [openRoleDelete, setOpenRoleDelete] = useState(false)

  const createNewRole = () => {
    setSharedRole({} as Role)
    setOpenRoleModal(true)
  }

  const editRole = (cellData: Role) => {
    setSharedRole(cellData)
    setOpenRoleModal(true)
  }

  const deleteRole = (cellData: Role) => {
    setSharedRole(cellData)
    setOpenRoleDelete(true)
  }

  const closeCreateEditModal = () => {
    setSharedRole({} as Role)
    setOpenRoleModal(false)
  }

  const closeDeleteModal = () => {
    setSharedRole({} as Role)
    setOpenRoleDelete(false)
  }

  const lineActions = [
    {
      label: () => `Edit`,
      onClick: ({ rowData }: any) => editRole(rowData),
    },
    {
      isDangerous: true,
      label: () => `Delete`,
      onClick: ({ rowData }: any) => deleteRole(rowData),
    },
  ]

  const getPermission = (id: string) => {
    const permission: Permission = permissions
      ? find(propEq('id', id))(permissions)
      : null
    return permission ? permission.label : ''
  }

  const getSchema = () => {
    let fontSize = 'f5'
    switch (tableDensity) {
      case 'low': {
        fontSize = 'f5'
        break
      }
      case 'medium': {
        fontSize = 'f6'
        break
      }
      case 'high': {
        fontSize = 'f7'
        break
      }
      default: {
        fontSize = 'f5'
        break
      }
    }
    return {
      properties: {
        label: {
          cellRenderer: ({ cellData }: any) => {
            return <span className={`ws-normal ${fontSize}`}>{cellData}</span>
          },
          title: 'Label',
        },
        name: {
          cellRenderer: ({ cellData }: any) => {
            return <span className={`ws-normal ${fontSize}`}>{cellData}</span>
          },
          title: 'Name',
        },
        permissions: {
          cellRenderer: ({ cellData }: any) => {
            return cellData ? (
              <div className={`ws-normal ${fontSize}`}>
                {cellData === null || cellData === '' || cellData === 'null' ? (
                  <div />
                ) : (
                  (JSON.parse(cellData) as any[]).map(x => (
                    <div>
                      <span className={`ws-normal ${fontSize}`}>
                        { getPermission(x) }
                      </span>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <span />
            )
          },
          title: 'Permissions',
        },
      },
    }

    
  }
  return loadingPermissions || loadingRoles ? (
    <Spinner />
  ) : errorPermissions || errorRoles ? (
    <div>Error loading data</div>
  ) : (
    <div>
      <Table
        fullWidth
        updateTableKey={tableDensity}
        items={roles}
        schema={getSchema()}
        density="low"
        lineActions={lineActions}
        toolbar={{
          density: {
            buttonLabel: 'Line density',
            handleCallback: (density: string) => setTableDensity(density),
            highOptionLabel: 'High',
            lowOptionLabel: 'Low',
            mediumOptionLabel: 'Medium',
          },
          inputSearch: {
            onChange: (value: string) => setSearchValue(value),
            onClear: () => setSearchValue(''),
            onSubmit: () => {},
            placeholder: 'Search role...',
            value: searchValue,
          },
          newLine: {
            handleCallback: () => createNewRole(),
            label: 'New',
          },
        }}
      />
      <RoleModal
        {...{
          allPermissions: permissions,
          closeModal: closeCreateEditModal,
          isModalOpen: openRoleModal,
          role: sharedRole,
        }}
      />
      <RoleDelete
        {...{
          closeModal: closeDeleteModal,
          isModalOpen: openRoleDelete,
          role: sharedRole,
        }}
      />
    </div>
  )
}

export default RolesList
