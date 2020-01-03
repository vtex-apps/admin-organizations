export interface Permission {
  id: string
  name: string
  label: string
}

export interface Role {
  id: string
  name: string
  label: string
  permissions: string[]
}
