import React, { Component } from 'react'
import { Table, Input } from "vtex.styleguide"
import PermissionModal from './PermissionModal'
import { Permission } from '../../utils/dataTypes'

class PermissionsList extends Component {
  constructor(props: any) {
    super(props)
    this.state = {
      items: props.itemsList,
      tableDensity: 'low',
      searchValue: null,
      selectedPermission: null,
      openPermissionModal: false
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
        id: {
          title: 'Id',
          cellRenderer: ({ cellData }: any) => {
            return (
              <span className={`ws-normal ${fontSize}`}>
                {cellData}
              </span>
            )
          }
        },
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
    const { items, searchValue, tableDensity, selectedPermission, openPermissionModal }: any = this.state

    const createNewPermission = () => {
      this.setState({openPermissionModal: true})
      this.setState({selectedPermission : {}}) 
    }

    const editPermission = () => {

    }

    const closeModal = () => {
      this.setState({openPermissionModal: false})
      this.setState({selectedPermission : {}}) 
    }
  
    const lineActions = [
      {
        label: () => `Edit`,
        onClick: ({ rowData }: any) => alert(`Executed action for ${rowData.name}`),
      },
      {
        label: () => `Delete`,
        isDangerous: true,
        onClick: ({ rowData }: any) =>
          alert(`Executed a DANGEROUS action for ${rowData.name}`),
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
            },
            fields: {
              label: 'Toggle visible fields',
              showAllLabel: 'Show All',
              hideAllLabel: 'Hide All',
            }
          }}
        />
        <PermissionModal {...{permission: selectedPermission, isModalOpen: openPermissionModal, closeModal: closeModal }}/>
      </div>
    )
  }
}

export default PermissionsList
