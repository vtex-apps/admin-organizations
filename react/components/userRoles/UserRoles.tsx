import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Layout, PageBlock, PageHeader } from "vtex.styleguide";
import UsersTable from "../../UsersTable";

import "../../styles.global.css";

class UserRoles extends Component {
  public render() {
    return (
      <Layout
        pageHeader={
          <PageHeader
            title={<FormattedMessage id="admin-authorization.user-roles.title" />}
          />
        }
      >
        <PageBlock variation="full">
          <UsersTable />
        </PageBlock>
      </Layout>
    );
  }
}

export default UserRoles;
