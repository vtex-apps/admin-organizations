import React, { Component } from "react"
import { Table, Input } from "vtex.styleguide"
import { find, propEq } from "ramda"
import { Permission } from "../../utils/dataTypes"

class RolesList extends Component {
  constructor(props: any) {
    super(props)
    this.state = {
      items: props.itemsList,
      tableDensity: "low",
      searchValue: null
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
            console.log(cellData)
            debugger
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
    const { items, searchValue, tableDensity }: any = this.state

    const lineActions = [
      {
        label: () => `Edit`,
        onClick: ({ rowData }: any) =>
          alert(`Executed action for ${rowData.name}`)
      },
      {
        label: () => `Delete`,
        isDangerous: true,
        onClick: ({ rowData }: any) =>
          alert(`Executed a DANGEROUS action for ${rowData.name}`)
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
              placeholder: "Search permission...",
              onChange: (searchValue: string) => this.setState({ searchValue }),
              onClear: () => this.setState({ searchValue: null }),
              onSubmit: () => {}
            },
            newLine: {
              label: "New",
              handleCallback: () => alert("handle new line callback")
            }
          }}
        />
      </div>
    )
  }
}

export default RolesList
