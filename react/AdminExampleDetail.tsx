import React, { Component } from "react";
import { FormattedMessage } from "react-intl";

import "./styles.global.css";

class AdminExampleDetail extends Component {
  public render() {
    return <FormattedMessage id="admin-authorization.hello-world" />;
  }
}

export default AdminExampleDetail;
