import React, { Component } from 'react'
import { Table } from "vtex.styleguide"
import PermissionModal from './PermissionModal'
import { Permission } from '../../utils/dataTypes'
import PermissionDelete from './PermissionDelete'

class PermissionsList extends Component {
  constructor(props: any) {
    super(props)
    this.state = {
      items: props.itemsList,
      tableDensity: 'low',
      searchValue: null,
      selectedPermission: {},
      openPermissionModal: false,
      openPermissionDelete: false
    }
  }
  
  private getSchema() {
    const { tableDensity }: any = this.state
    let fontSize = 'f5'
    switch(tableDensity) {
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
        name: {
          title: 'Name',
          cellRenderer: ({ cellData }: any) => {
            return (
              <span className={`ws-normal ${fontSize}`}>
                {cellData}
              </span>
            )
          }
        },
        label: {
          title: 'Label',
          cellRenderer: ({ cellData }: any) => {
            return (
              <span className={`ws-normal ${fontSize}`}>
                {cellData}
              </span>
            )
          }
        }
      }
    }
  }

  public render() {
    const { items, searchValue, tableDensity, selectedPermission, openPermissionModal, openPermissionDelete }: any = this.state

    const createNewPermission = () => {
      this.setState({selectedPermission : {}}) 
      this.setState({openPermissionModal: true})
    }

    const editPermission = (cellData: Permission) => {
      this.setState({selectedPermission : cellData}) 
      this.setState({openPermissionModal: true})
    }

    const deletePermission = (cellData: Permission) => {
      this.setState({selectedPermission : cellData}) 
      this.setState({openPermissionDelete: true})
    }

    const closeModal = () => {
      this.setState({selectedPermission : {}}) 
      this.setState({openPermissionModal: false})
    }

    const closeDeleteModal = () => {
      this.setState({selectedPermission : {}}) 
      this.setState({openPermissionDelete: false})
    }

    const lineActions = [
      {
        label: () => `Edit`,
        onClick: ({ rowData }: any) => editPermission(rowData),
      },
      {
        label: () => `Delete`,
        isDangerous: true,
        onClick: ({ rowData }: any) => deletePermission(rowData),
      },
    ]

    return (
      <div>
        <Table
          fullWidth
          updateTableKey={tableDensity}
          items={items}
          schema={this.getSchema()}
          density="low"
          lineActions={lineActions}
          toolbar={{
            density: {
              buttonLabel: 'Line density',
              lowOptionLabel: 'Low',
              mediumOptionLabel: 'Medium',
              highOptionLabel: 'High',
              handleCallback: (tableDensity: string) => this.setState({ tableDensity })
            },
            inputSearch: {
              value: searchValue,
              placeholder: 'Search permission...',
              onChange: (searchValue: string) => this.setState({ searchValue }),
              onClear: () => this.setState({ searchValue: null }),
              onSubmit: () => {},
            },
            newLine: {
              label: 'New',
              handleCallback: () => createNewPermission(),
            }
          }}
        />
        <PermissionModal {...{permission: selectedPermission, isModalOpen: openPermissionModal, closeModal: closeModal }}/>
        <PermissionDelete {...{permission: selectedPermission, isModalOpen: openPermissionDelete, closeModal: closeDeleteModal }}/>
      </div>
    )
  }
}

export default PermissionsList
