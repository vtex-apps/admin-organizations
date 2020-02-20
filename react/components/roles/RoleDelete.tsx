import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { ModalDialog } from 'vtex.styleguide'
import DELETE_DOCUMENT from '../../graphql/mutations/deleteDocument.graphql'
import { updateCacheDeleteRole } from '../../utils/cacheUtils'
import { ROLES_ACRONYM } from '../../utils/consts'

interface Props {
  isModalOpen: boolean
  role: Role
  closeModal: () => void
}

const RoleDelete = (props: Props) => {
  const [id, setId] = useState('')

  const [deleteRole] = useMutation(DELETE_DOCUMENT, {
    update: (cache: any, { data }: any) =>
    updateCacheDeleteRole(
        cache,
        data
      ),
  })

  useEffect(() => {
    setId(props.role && props.role.id ? props.role.id : '')
  }, [props.role])

  const handleConfirmation = async () => {
    await deleteRole({
      variables: {
        acronym: ROLES_ACRONYM,
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
        Confirm delete role "{props.role && props.role.name}"
      </h3>
    </ModalDialog>
  )
}

export default RoleDelete
