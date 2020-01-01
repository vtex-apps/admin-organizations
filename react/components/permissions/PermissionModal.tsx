import React, { useState, useEffect } from "react"
import { Modal, Button, Input } from "vtex.styleguide"
import { Permission } from "../../utils/dataTypes"
import { useMutation } from "react-apollo"
import CREATE_DOCUMENT from '../../graphql/mutations/createDocument.graphql'
import {
  PERMISSIONS_ACRONYM,
  PERMISSIONS_SCHEMA
} from "../../utils/consts"

interface Props {
  isModalOpen: boolean
  permission: Permission
  closeModal: Function
}

const PermissionModal = (props: Props) => {
  
  const [id, setId] = props.permission && props.permission.id? useState(props.permission.id): useState('')
  const [name, setName] = props.permission && props.permission.name? useState(props.permission.name): useState('')
  const [label, setLabel] = props.permission && props.permission.label? useState(props.permission.label): useState('')
  
  const [addPermission] = useMutation(CREATE_DOCUMENT)

  const handleCloseModal = () => {
    props.closeModal(false)
  }

  useEffect(() => {
    setId(props.permission && props.permission.id? props.permission.id: '')
    setName(props.permission && props.permission.name? props.permission.name: '')
    setLabel(props.permission && props.permission.label? props.permission.label: '')
  }, [props.permission])

  const handleSave = () => {
    //props.closeModal(false)
    createPermission()
  }

  const createPermission = async() => {
    const permissionFields = [ { key: 'name', value: name }, {key: 'label', value: label}]
    const params = {
      variables: { acronym: PERMISSIONS_ACRONYM, document: { fields: permissionFields }, schema: PERMISSIONS_SCHEMA },
    }
    const result = await addPermission(params)
    props.closeModal(false)
  }

  return (
    <Modal
      isOpen={props.isModalOpen}
      title="Permission"
      responsiveFullScreen
      centered
      bottomBar={
        <div className="nowrap">
          <span className="mr4">
            <Button variation="tertiary" onClick={handleCloseModal}>
              Cancel
            </Button>
          </span>
          <span>
            <Button variation="secondary" onClick={handleSave}>
              Save
            </Button>
          </span>
        </div>
      }
      onClose={handleCloseModal}
    >
      <div className="mb5">
        <Input
          placeholder="e.g. view_order"
          dataAttributes={{ "hj-white-list": true, test: "string" }}
          label="Name"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />
      </div>
      <div className="mb5">
        <Input
          placeholder="e.g. View Order"
          dataAttributes={{ "hj-white-list": true, test: "string" }}
          label="Label"
          value={label}
          onChange={(e: any) => setLabel(e.target.value)}
        />
      </div>
    </Modal>
  )
}

export default PermissionModal
