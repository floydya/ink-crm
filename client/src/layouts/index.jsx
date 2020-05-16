import React from "react"
import ProLayout from "@ant-design/pro-layout"
import { ParlorSwitch } from "layouts/components/ParlorSwitch"
import { DashboardOutlined, HomeOutlined, IdcardOutlined, UsergroupAddOutlined } from "@ant-design/icons"
import "./index.scss"
import { Link } from "react-router-dom"

export default ({ children }) => {
  return (
    <ProLayout
      title="Ink CRM"
      menuHeaderRender={(logo) => <ParlorSwitch logo={logo} />}
      menuDataRender={() => ([
        { path: "/home", name: "Домой", icon: <HomeOutlined /> },
        { path: "/dashboard", name: "Панель управления", icon: <DashboardOutlined /> },
        {
          path: "/customers",
          name: "Клиенты",
          icon: <IdcardOutlined />,
          exact: true,
          children: [
            {
              path: "/customers/:customerId",
              exact: true,
              name: "Клиент",
              hideInMenu: true,
              hideChildrenInMenu: true,
              children: [
                { path: "/records/create/:customerId", exact: true, name: "Создание записи", hideInMenu: true }
              ]
            },
            { path: "/customers/create/:phoneNumber", exact: true, name: "Создание клиента", hideInMenu: true }
          ]
        },
        {
          path: "/employees", exact: true, name: "Сотрудники", icon: <UsergroupAddOutlined />, children: [
            { path: "/employees/:id", exact: true, name: "Сотрудник", hideInMenu: true },
            { path: "/employees/:id/motivation", exact: true, name: "Мотивация", hideInMenu: true },
            {
              path: "/employees/:id/bounties", exact: true, name: "Премии", hideInMenu: true, children: [
                { path: "/employees/:id/bounties/create", exact: true, name: "Создание премии", hideInMenu: true }
              ]
            }
          ]
        }
      ])}
      menuItemRender={(menuItemProps, defaultDom) => <Link to={menuItemProps.path}>{defaultDom}</Link>}
      rightContentRender={() => <>
      </>}
    >
      {children}
    </ProLayout>

  )
}
