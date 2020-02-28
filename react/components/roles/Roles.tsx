import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader, Spinner } from 'vtex.styleguide'

import RolesList from './RolesList'

const Roles = () => {
  return (
    <Layout
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin-authorization.roles.title" />}
        />
      }
    >
      <PageBlock variation="full">
        <RolesList />
      </PageBlock>
    </Layout>
  )
}

export default Roles
