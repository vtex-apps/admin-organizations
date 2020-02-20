import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader, Spinner } from 'vtex.styleguide'

import PermissionsList from './PermissionsList'

const Permissions = () => {
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
      <PageBlock variation="full">
        <PermissionsList />
      </PageBlock>
    </Layout>
  )
}

export default Permissions
