import { contains, equals, find, propEq, reject } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { ActionMenu, Button, Input, Modal, Table } from 'vtex.styleguide'
import CREATE_DOCUMENT from '../../graphql/mutations/createDocument.graphql'
import UPDATE_DOCUMENT from '../../graphql/mutations/updateDocument.graphql'
import '../../styles.global.css'
import { updateCacheAddRole, updateCacheEditRole } from '../../utils/cacheUtils'
import { ROLES_ACRONYM, ROLES_SCHEMA } from '../../utils/consts'
import { getErrorMessage } from '../../utils/graphqlErrorHandler'

interface Props {
  isModalOpen: boolean
  role: Role
  allPermissions: Permission[]
  closeModal: (message: string, type: string) => void
}

const RoleModal = (props: Props) => {
  const [isEdit, setIsEdit] = useState(false)
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState([] as Permission[])

  const [addRole] = useMutation(CREATE_DOCUMENT, {
    update: (cache: any, { data }: any) =>
      updateCacheAddRole(
        cache,
        data,
        name,
        label,
        selectedPermissions
      ),
  })
  const [editRole] = useMutation(UPDATE_DOCUMENT, {
    update: (cache: any, { data }: any) =>
      updateCacheEditRole(
        cache,
        data,
        name,
        label,
        selectedPermissions
      ),
  })

  const handleCloseModal = () => {
    props.closeModal('', 'close')
  }

  useEffect(() => {
    setIsEdit(props.role && props.role.id !== undefined && props.role.id !== '')
    setId(props.role && props.role.id ? props.role.id : '')
    setName(props.role && props.role.name ? props.role.name : '')
    setLabel(props.role && props.role.label ? props.role.label : '')
    setSelectedPermissions(
      props.role && props.role.permissions
        ? getSelectedPermissions(props.role.permissions): [] as Permission[]
      )
  }, [props.role])

  const getSelectedPermissions = (ids: any) => {
    if(ids === null || ids === '' || ids === 'null' || !ids || ids.length === 0) { return [] as Permission[] }
    const { allPermissions } = props
    return (JSON.parse(ids) as string[]).map(x => find(propEq('id', x))(allPermissions)) as Permission[]
  }

  const options = props.allPermissions.map(p => ({
    label: p.label,
    onClick: () => permissionSelected(p),
  }))

  const permissionSelected = (selected: Permission) => {
    if(!contains(selected, selectedPermissions)){
      setSelectedPermissions([...selectedPermissions, selected])
    }
  }

  const handleSave = () => {
    const roleFields = [
      { key: 'name', value: name },
      { key: 'label', value: label },
    ]
    
    if (isEdit) {
      roleFields.push({ key: 'id', value: id })
    }

    if(selectedPermissions && selectedPermissions.length > 0){
      const permissions = selectedPermissions.map(x => x.id)
      roleFields.push({ key: 'permissions', value: JSON.stringify(permissions) })
    }

    const save = isEdit ? editRole : addRole

    save({
      variables: {
        acronym: ROLES_ACRONYM,
        document: { fields: roleFields },
        schema: ROLES_SCHEMA,
      },
    }).catch((e) => {
      const message = getErrorMessage(e)
      props.closeModal(message, 'error')
    }).then(() => {
      props.closeModal(`successfully ${ isEdit? 'updated': 'created' } role "${label}"`, 'success')
    })
  }

  const tableScheme = {
    properties: {
      label: {
        cellRenderer: ({ cellData }: any) => {
          return (
            <span className={`ws-normal `}>
              {cellData}
            </span>
          )
        },
        title: 'Label',
      },
      name: {
        cellRenderer: ({ cellData }: any) => {
          return (
            <span className={`ws-normal `}>
              {cellData}
            </span>
          )
        },
        title: 'Name',
      },
    },
  }

  const lineActions = [
    {
      label: () => `Remove`,
      onClick: ({ rowData }: any) => removePermission(rowData),
    },
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
          placeholder="e.g. sales_manager"
          dataAttributes={{ 'hj-white-list': true, test: 'string' }}
          label="Name"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />
      </div>
      <div className="mb5">
        <Input
          placeholder="e.g. Sales Manager"
          dataAttributes={{ 'hj-white-list': true, test: 'string' }}
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
              variation: 'primary',
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
