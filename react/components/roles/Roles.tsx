import React from "react"
import { FormattedMessage } from "react-intl"
import { Layout, PageBlock, PageHeader, Spinner } from "vtex.styleguide"
import RolesList from "./RolesList"
import DOCUMENTS from "../../graphql/queries/documents.graphql"
import {
  ROLES_ACRONYM,
  ROLES_FIELDS,
  ROLES_SCHEMA,
  PERMISSIONS_ACRONYM,
  PERMISSIONS_FIELDS,
  PERMISSIONS_SCHEMA
} from "../../utils/consts"
import { path } from "ramda"
import { documentSerializer } from "../../utils/documentSerializer"
import { useQuery, Query } from "react-apollo"
import { Permission } from '../../utils/dataTypes'
import "../../styles.global.css"

const Roles = () => {
  const { loading, error, data } = useQuery(DOCUMENTS, {
    variables: {
      acronym: PERMISSIONS_ACRONYM,
      fields: PERMISSIONS_FIELDS,
      page: 1,
      pageSize: 100,
      schema: PERMISSIONS_SCHEMA,
      where: ""
    }
  })
  const documents = !loading && !error ? path(["myDocuments"], data) : null
  const permissions : Permission[] = documents ? documentSerializer(documents) : []
  return (
    !loading && (
      <Layout
        pageHeader={
          <PageHeader
            title={<FormattedMessage id="admin-authorization.roles.title" />}
          />
        }
      >
        <Query
          query={DOCUMENTS}
          variables={{
            acronym: ROLES_ACRONYM,
            fields: ROLES_FIELDS,
            page: 1,
            pageSize: 100,
            schema: ROLES_SCHEMA,
            where: ""
          }}
        >
          {({ loading, error, data }: any) => {
            if (loading) {
              return <Spinner />
            }
            if (error) {
              return <div>Failed to load roles</div>
            }
            const documents = path(["myDocuments"], data)
            const rolesList = documents && documentSerializer(documents)
            return (
              <PageBlock variation="full">
                <RolesList
                  {...{ itemsList: rolesList, permissionList: permissions }}
                />
              </PageBlock>
            )
          }}
        </Query>
      </Layout>
    )
  )
}

export default Roles
