import React, { useState, useEffect } from "react"
import { ModalDialog } from "vtex.styleguide"
import { Role } from "../../utils/dataTypes"
import { useMutation } from "react-apollo"
import DELETE_DOCUMENT from "../../graphql/mutations/deleteDocument.graphql"
import { ROLES_ACRONYM } from "../../utils/consts"

interface Props {
  isModalOpen: boolean
  role: Role
  closeModal: Function
}

const RoleDelete = (props: Props) => {
  const [id, setId] = useState("")

  const [deleteRole] = useMutation(DELETE_DOCUMENT)

  useEffect(() => {
    setId(props.role && props.role.id ? props.role.id : "")
  }, [props.role])

  const handleConfirmation = async () => {
    await deleteRole({
      variables: {
        acronym: ROLES_ACRONYM,
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
        Confirm delete role "{props.role && props.role.name}"
      </h3>
    </ModalDialog>
  )
}

export default RoleDelete
