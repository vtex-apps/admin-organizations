import React, { Component } from "react"
import { Table, Input } from "vtex.styleguide"
import { find, propEq } from "ramda"
import { Role, Permission } from "../../utils/dataTypes"
import RoleModal from './RoleModal'
import RoleDelete from './RoleDelete'
import '../../styles.global.css'
class RolesList extends Component {
  constructor(props: any) {
    super(props)
    this.state = {
      items: props.itemsList,
      tableDensity: "low",
      searchValue: null,
      selectedRole: {},
      openRoleModal: false,
      openRoleDelete: false
    }
  }

  private getPermission(id: string) {
    const { permissionList }: any = this.props
    const permission: Permission = permissionList
      ? find(propEq("id", id))(permissionList)
      : null
    return permission ? permission.label : ""
  }

  private getSchema() {
    const { tableDensity }: any = this.state
    let fontSize = "f5"
    switch (tableDensity) {
      case "low": {
        fontSize = "f5"
        break
      }
      case "medium": {
        fontSize = "f6"
        break
      }
      case "high": {
        fontSize = "f7"
        break
      }
      default: {
        fontSize = "f5"
        break
      }
    }
    return {
      properties: {
        name: {
          title: "Name",
          cellRenderer: ({ cellData }: any) => {
            return <span className={`ws-normal ${fontSize}`}>{cellData}</span>
          }
        },
        label: {
          title: "Label",
          cellRenderer: ({ cellData }: any) => {
            return <span className={`ws-normal ${fontSize}`}>{cellData}</span>
          }
        },
        permissions: {
          title: "Permissions",
          cellRenderer: ({ cellData }: any) => {
            return cellData ? (
              <div className={`ws-normal ${fontSize}`}>
                {(JSON.parse(cellData) as any[]).map(x => (
                  <div>
                    <span className={`ws-normal ${fontSize}`}>
                      {this.getPermission(x)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span />
            )
          }
        }
      }
    }
  }

  public render() {
    const { items, searchValue, tableDensity, selectedRole, openRoleModal, openRoleDelete }: any = this.state
    const { permissionList }: any = this.props

    const createNewRole = () => {
      this.setState({selectedRole : {}}) 
      this.setState({openRoleModal: true})
    }

    const editRole = (cellData: Role) => {
      this.setState({selectedRole : cellData}) 
      this.setState({openRoleModal: true})
    }

    const deleteRole = (cellData: Role) => {
      this.setState({selectedRole : cellData}) 
      this.setState({openRoleDelete: true})
    }

    const closeModal = () => {
      this.setState({selectedRole : {}}) 
      this.setState({openRoleModal: false})
    }

    const closeDeleteModal = () => {
      this.setState({selectedRole : {}}) 
      this.setState({openRoleDelete: false})
    }

    const lineActions = [
      {
        label: () => `Edit`,
        onClick: ({ rowData }: any) => editRole(rowData)
      },
      {
        label: () => `Delete`,
        isDangerous: true,
        onClick: ({ rowData }: any) => deleteRole(rowData)
      }
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
              buttonLabel: "Line density",
              lowOptionLabel: "Low",
              mediumOptionLabel: "Medium",
              highOptionLabel: "High",
              handleCallback: (tableDensity: string) =>
                this.setState({ tableDensity })
            },
            inputSearch: {
              value: searchValue,
              placeholder: "Search role...",
              onChange: (searchValue: string) => this.setState({ searchValue }),
              onClear: () => this.setState({ searchValue: null }),
              onSubmit: () => {}
            },
            newLine: {
              label: "New",
              handleCallback: () => createNewRole()
            }
          }}
        />
        <RoleModal {...{role: selectedRole, isModalOpen: openRoleModal, closeModal: closeModal, allPermissions: permissionList }}/>
        <RoleDelete {...{role: selectedRole, isModalOpen: openRoleDelete, closeModal: closeDeleteModal }}/>
      </div>
    )
  }
}

export default RolesList
