import React, { Component } from "react"
import { FormattedMessage } from "react-intl"
import { Layout, PageBlock, PageHeader, Spinner } from "vtex.styleguide"
import PermissionsList from "./PermissionsList"
import { Query } from "react-apollo"
import DOCUMENTS from "../../graphql/queries/documents.graphql"
import {
  PERMISSIONS_ACRONYM,
  PERMISSIONS_FIELDS,
  PERMISSIONS_SCHEMA
} from "../../utils/consts"
import { path } from "ramda"
import { documentSerializer } from "../../utils/documentSerializer"
import "../../styles.global.css"

const Permissions = () => {
  const queryParams = {
    acronym: PERMISSIONS_ACRONYM,
    fields: PERMISSIONS_FIELDS,
    page: 1,
    pageSize: 100,
    schema: PERMISSIONS_SCHEMA
  }

  return (
    <Layout
      pageHeader={
        <PageHeader
          title={
            <FormattedMessage id="admin-authorization.permissions.title" />
          }
        />
      }
    >
      <Query query={DOCUMENTS} variables={queryParams}>
        {({ loading, error, data }: any) => {
          if (loading) {
            return <Spinner />
          }
          if (error) {
            return <div>Failed to load permissions</div>
          }
          const documents = path(["documents"], data)
          const permissionsList = documents && documentSerializer(documents)
          return (
            <PageBlock variation="full">
              <PermissionsList {...{ itemsList: permissionsList }} />
            </PageBlock>
          )
        }}
      </Query>
      
    </Layout>
  )
}

export default Permissions
