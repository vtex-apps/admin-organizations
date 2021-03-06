import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { Button, Input, Modal } from 'vtex.styleguide'
import CREATE_DOCUMENT from '../../graphql/mutations/createDocument.graphql'
import UPDATE_DOCUMENT from '../../graphql/mutations/updateDocument.graphql'
import { updateCacheAddPermission, updateCacheUpdatePermission } from '../../utils/cacheUtils'
import { PERMISSIONS_ACRONYM, PERMISSIONS_SCHEMA } from '../../utils/consts'
import { getErrorMessage } from '../../utils/graphqlErrorHandler'

interface Props {
  isModalOpen: boolean
  permission: Permission
  closeModal: (message: string, type: string) => void
}

const PermissionModal = (props: Props) => {
  const [isEdit, setIsEdit] = useState(false)
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')

  const [addPermission] = useMutation(CREATE_DOCUMENT, {
    update: (cache: any, { data }: any) =>
      updateCacheAddPermission(
        cache,
        data,
        name,
        label
      ),
  })
  const [editPermission] = useMutation(UPDATE_DOCUMENT, {
    update: (cache: any, { data }: any) =>
      updateCacheUpdatePermission(
        cache,
        data,
        name,
        label
      ),
  })

  const handleCloseModal = () => {
    props.closeModal('', 'close')
  }

  useEffect(() => {
    setIsEdit(
      props.permission &&
        props.permission.id !== undefined &&
        props.permission.id !== ''
    )
    setId(props.permission && props.permission.id ? props.permission.id : '')
    setName(props.permission && props.permission.name ? props.permission.name : '')
    setLabel(props.permission && props.permission.label ? props.permission.label : '')
  }, [props.permission])

  const handleSave = () => {
    const permissionFields = [
      { key: 'name', value: name },
      { key: 'label', value: label },
    ]
    if (isEdit) {
      permissionFields.push({ key: 'id', value: id })
    }
    const save = isEdit? editPermission: addPermission
    
    save({
      variables: {
        acronym: PERMISSIONS_ACRONYM,
        document: { fields: permissionFields },
        schema: PERMISSIONS_SCHEMA,
      },
    }).catch((e) => {
      const message = getErrorMessage(e)
      props.closeModal(message, 'error')
    }).then(() => {
      props.closeModal(`successfully ${ isEdit? 'updated': 'created' } permission "${label}"`, 'success')
    })
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
          dataAttributes={{ 'hj-white-list': true, test: 'string' }}
          label="Name"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />
      </div>
      <div className="mb5">
        <Input
          placeholder="e.g. View Order"
          dataAttributes={{ 'hj-white-list': true, test: 'string' }}
          label="Label"
          value={label}
          onChange={(e: any) => setLabel(e.target.value)}
        />
      </div>
    </Modal>
  )
}

export default PermissionModal
