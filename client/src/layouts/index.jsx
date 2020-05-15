import React from "react"
import ProLayout, { PageHeaderWrapper } from "@ant-design/pro-layout"
import { ParlorSwitch } from "layouts/components/ParlorSwitch"

export default ({ children }) => {
  return (
    <ProLayout
      menuHeaderRender={(logo) => <ParlorSwitch logo={logo} />}
      menuDataRender={() => [
        { path: "/home", name: "Dashboard" }
      ]}
    >
      <PageHeaderWrapper>
        {children}
      </PageHeaderWrapper>
    </ProLayout>

  )
}
