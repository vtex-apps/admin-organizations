import React, { useState, useEffect } from "react"
import { contains, reject, equals, find, propEq } from 'ramda'
import { Modal, Button, Input, ActionMenu, Table } from "vtex.styleguide"
import { Role, Permission } from "../../utils/dataTypes"
import { useMutation } from "react-apollo"
import CREATE_DOCUMENT from "../../graphql/mutations/createDocument.graphql"
import UPDATE_DOCUMENT from "../../graphql/mutations/updateDocument.graphql"
import { ROLES_ACRONYM, ROLES_SCHEMA } from "../../utils/consts"
import "../../styles.global.css"

interface Props {
  isModalOpen: boolean
  role: Role
  allPermissions: Permission[]
  closeModal: Function
}

const RoleModal = (props: Props) => {
  const [isEdit, setIsEdit] = useState(false)
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [label, setLabel] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState([] as Permission[])

  const [addRole] = useMutation(CREATE_DOCUMENT)
  const [editRole] = useMutation(UPDATE_DOCUMENT)

  const handleCloseModal = () => {
    props.closeModal()
  }

  useEffect(() => {
    setIsEdit(props.role && props.role.id !== undefined && props.role.id !== "")
    setId(props.role && props.role.id ? props.role.id : "")
    setName(props.role && props.role.name ? props.role.name : "")
    setLabel(props.role && props.role.label ? props.role.label : "")
    setSelectedPermissions(
      props.role && props.role.permissions
        ? getSelectedPermissions(props.role.permissions): [] as Permission[]
      )
  }, [props.role])

  const getSelectedPermissions = (ids: any) => {
    if(!ids || ids.length == 0) { return [] as Permission[] }
    const { allPermissions } = props
    return (JSON.parse(ids) as string[]).map(x => find(propEq('id', x))(allPermissions)) as Permission[]
  }

  const options = props.allPermissions.map(p => ({
    label: p.label,
    onClick: () => permissionSelected(p)
  }))

  const permissionSelected = (selected: Permission) => {
    if(!contains(selected, selectedPermissions)){
      setSelectedPermissions([...selectedPermissions, selected])
    }
  }

  const handleSave = async () => {
    const roleFields = [
      { key: "name", value: name },
      { key: "label", value: label }
    ]
    
    if (isEdit) {
      roleFields.push({ key: "id", value: id })
    }

    if(selectedPermissions && selectedPermissions.length > 0){
      const permissions = selectedPermissions.map(x => x.id)
      roleFields.push({ key: "permissions", value: JSON.stringify(permissions) })
    }

    const save = isEdit ? editRole : addRole

    await save({
      variables: {
        acronym: ROLES_ACRONYM,
        document: { fields: roleFields },
        schema: ROLES_SCHEMA
      }
    })

    props.closeModal()
  }

  const tableScheme = {
    properties: {
      name: {
        title: 'Name',
        cellRenderer: ({ cellData }: any) => {
          return (
            <span className={`ws-normal `}>
              {cellData}
            </span>
          )
        }
      },
      label: {
        title: 'Label',
        cellRenderer: ({ cellData }: any) => {
          return (
            <span className={`ws-normal `}>
              {cellData}
            </span>
          )
        }
      },
    },
  }

  const lineActions = [
    {
      label: () => `Remove`,
      onClick: ({ rowData }: any) => removePermission(rowData),
    }
  ]

  const removePermission = (permission: Permission) => {
    setSelectedPermissions(reject(equals(permission), selectedPermissions))
  }

  return (
    <Modal
      isOpen={props.isModalOpen}
      title="Role"
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
      className="rolesModal"
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
      <div className="ma3 flex">
        <div className="addPermissionLabel">Add Permissions</div>
        <div className="addPermissionMenu">
          <ActionMenu
            buttonProps={{
              variation: "primary"
            }}
            options={options}
          />
        </div>
      </div>
      <Table fullWidth schema={tableScheme} items={selectedPermissions} lineActions={lineActions}/>
    </Modal>
  )
}

export default RoleModal