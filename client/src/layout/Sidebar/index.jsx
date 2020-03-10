import React from "react"
import { NavLink, useRouteMatch } from "react-router-dom"

import { Icon } from "../../shared/components"

import {
  Sidebar,
  Divider,
  LinkItem,
  LinkText,
  NotImplemented
} from "./Styles"
import ParlorChange from "./ParlorChange"

const ProjectSidebar = () => {
  const match = useRouteMatch()

  return (
    <Sidebar>
      <ParlorChange />
      {renderLinkItem(match, "Панель управления", "board", "/dashboard")}
      {renderLinkItem(match, "Сотрудники", "user", "/employees")}
      {renderLinkItem(match, "Клиенты", "customers", "/customers")}
      {/*{renderLinkItem(match, "Project settings", "settings", "/settings")}*/}
      <Divider />
      {renderLinkItem(match, "Рабочий график", "calendar")}
      {renderLinkItem(match, "Склад", "shop")}
      {renderLinkItem(match, "Отчеты", "reports")}
    </Sidebar>
  )
}

const renderLinkItem = (match, text, iconType, path) => {
  const isImplemented = !!path

  const linkItemProps = isImplemented
    ? { as: NavLink, exact: true, to: path }
    : { as: "div" }

  return (
    <LinkItem {...linkItemProps}>
      <Icon type={iconType} />
      <LinkText>{text}</LinkText>
      {!isImplemented && <NotImplemented>Not implemented</NotImplemented>}
    </LinkItem>
  )
}

export default ProjectSidebar