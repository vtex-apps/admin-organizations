import React, { useState, useEffect } from "react"
import { ModalDialog, Button, Input } from "vtex.styleguide"
import { Permission } from "../../utils/dataTypes"
import { useMutation } from "react-apollo"
import DELETE_DOCUMENT from "../../graphql/mutations/deleteDocument.graphql"
import { PERMISSIONS_ACRONYM } from "../../utils/consts"

interface Props {
  isModalOpen: boolean
  permission: Permission
  closeModal: Function
}

const PermissionDelete = (props: Props) => {
  const [id, setId] = useState("")

  const [deletePermission] = useMutation(DELETE_DOCUMENT)

  useEffect(() => {
    setId(props.permission && props.permission.id ? props.permission.id : "")
  }, [props.permission])

  const handleConfirmation = async () => {
    await deletePermission({
      variables: {
        acronym: PERMISSIONS_ACRONYM,
        documentId: id
      }
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
        onClick: handleConfirmation,
        label: "Delete",
        isDangerous: true
      }}
      cancelation={{
        onClick: handleCancelation,
        label: "Cancel"
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
