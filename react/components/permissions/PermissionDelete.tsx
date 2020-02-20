import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { Button, Input, ModalDialog } from 'vtex.styleguide'
import DELETE_DOCUMENT from '../../graphql/mutations/deleteDocument.graphql'
import { updateCacheDeletePermission } from '../../utils/cacheUtils'
import { PERMISSIONS_ACRONYM } from '../../utils/consts'

interface Props {
  isModalOpen: boolean
  permission: Permission
  closeModal: () => void
}

const PermissionDelete = (props: Props) => {
  const [id, setId] = useState('')

  const [deletePermission] = useMutation(DELETE_DOCUMENT, {
    update: (cache: any, { data }: any) =>
      updateCacheDeletePermission(
        cache,
        data
      ),
  })

  useEffect(() => {
    setId(props.permission && props.permission.id ? props.permission.id : '')
  }, [props.permission])

  const handleConfirmation = async () => {
    await deletePermission({
      variables: {
        acronym: PERMISSIONS_ACRONYM,
        documentId: id,
      },
    })
    props.closeModal()
  }

  const handleCancelation = () => {
    props.closeModal()
  }

  return (
    <ModalDialog
      centered
      confirmation={{
        isDangerous: true,
        label: 'Delete',
        onClick: handleConfirmation,
      }}
      cancelation={{
        label: 'Cancel',
        onClick: handleCancelation,
      }}
      isOpen={props.isModalOpen}
      onClose={handleCancelation}
    >
      <h3>
        Confirm delete permission "{props.permission && props.permission.name}"
      </h3>
    </ModalDialog>
  )
}

export default PermissionDelete
