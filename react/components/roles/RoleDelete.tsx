import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { ModalDialog } from 'vtex.styleguide'
import DELETE_DOCUMENT from '../../graphql/mutations/deleteDocument.graphql'
import { updateCacheDeleteRole } from '../../utils/cacheUtils'
import { ROLES_ACRONYM } from '../../utils/consts'
import { getErrorMessage } from '../../utils/graphqlErrorHandler'

interface Props {
  isModalOpen: boolean
  role: Role
  closeModal: (message: string, type: string) => void
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

  const handleConfirmation = () => {
    deleteRole({
      variables: {
        acronym: ROLES_ACRONYM,
        documentId: id,
      },
    }).catch((e) => {
      const message = getErrorMessage(e)
      props.closeModal(message, 'error')
    }).then(() => {
      props.closeModal(`successfully deleted role "${props.role.label}"`, 'success')
    })
  }

  const handleCancelation = () => {
    props.closeModal('', 'close')
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
