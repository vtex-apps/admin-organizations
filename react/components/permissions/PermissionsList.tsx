import { pathOr } from 'ramda'
import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { Spinner, Table } from 'vtex.styleguide'
import DOCUMENTS from '../../graphql/queries/documents.graphql'
import '../../styles.global.css'
import {
  PERMISSIONS_ACRONYM,
  PERMISSIONS_FIELDS,
  PERMISSIONS_SCHEMA
} from '../../utils/consts'
import { documentSerializer } from '../../utils/documentSerializer'
import PermissionDelete from './PermissionDelete'
import PermissionModal from './PermissionModal'

import Toast from '../../Toast'

const PermissionsList = () => {
  
  const { data, loading, error } = useQuery(DOCUMENTS, {
    variables: {
      acronym: PERMISSIONS_ACRONYM,
      fields: PERMISSIONS_FIELDS,
      page: 1,
      pageSize: 100,
      schema: PERMISSIONS_SCHEMA,
    },
  })

  const permissionsList = documentSerializer(pathOr([], ['myDocuments'], data))

  const [tableDensity, setTableDensity] = useState('low')
  const [searchValue, setSearchValue] = useState('')
  const [sharedPermission, setSharedPermission] = useState({} as Permission)
  const [openPermissionModal, setOpenPermissionModal] = useState(false)
  const [openPermissionDelete, setOpenPermissionDelete] = useState(false)

  const [tostMessage, setTostMessage] = useState({showToast: false, message: '', type: '' } as TostMessage)

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
      },
    }
  }

  const createNewPermission = () => {
    setSharedPermission({} as Permission)
    setOpenPermissionModal(true)
  }

  const editPermission = (cellData: Permission) => {
    setSharedPermission(cellData)
    setOpenPermissionModal(true)
  }

  const deletePermission = (cellData: Permission) => {
    setSharedPermission(cellData)
    setOpenPermissionDelete(true)
  }

  const closeCreateEditModal = (message: string, messageType: string) => {
    setSharedPermission({} as Permission)
    setOpenPermissionModal(false)

    if(messageType === 'error' || messageType === 'success'){
      setTostMessage({showToast: true, message, type: messageType } as TostMessage)
    }
  }

  const closeDeleteModal = (message: string, messageType: string) => {
    setSharedPermission({} as Permission)
    setOpenPermissionDelete(false)

    if(messageType === 'error' || messageType === 'success'){
      setTostMessage({showToast: true, message, type: messageType } as TostMessage)
    }
  }

  const handleCloseToast = () => {
    setTostMessage({showToast: false, message: '', type: '' } as TostMessage)
  }

  const lineActions = [
    {
      label: () => `Edit`,
      onClick: ({ rowData }: any) => editPermission(rowData),
    },
    {
      isDangerous: true,
      label: () => `Delete`,
      onClick: ({ rowData }: any) => deletePermission(rowData),
    },
  ]

  return loading ? (
    <Spinner />
  ) : error ? (
    <div>Failed to load permissions</div>
  ) : (
    <div>
      <Table
        fullWidth
        updateTableKey={tableDensity}
        items={permissionsList}
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
          newLine: {
            handleCallback: () => createNewPermission(),
            label: 'New',
          },
        }}
      />
      <PermissionModal
        closeModal={closeCreateEditModal}
        isModalOpen={openPermissionModal}
        permission={sharedPermission}
      />
      <PermissionDelete
        closeModal={closeDeleteModal}
        isModalOpen={openPermissionDelete}
        permission={sharedPermission}
      />
      {tostMessage.showToast && (
        <Toast
          type={tostMessage.type}
          showToast={tostMessage.showToast}
          message={tostMessage.message}
          onClose={handleCloseToast}
        />
      )}
    </div>
  )
}

export default PermissionsList
