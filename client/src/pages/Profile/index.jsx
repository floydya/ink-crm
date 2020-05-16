import React, { useContext, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import useApi from "shared/hooks/api"
import { AuthenticationContext } from "services/authentication.service"
import { PageError } from "shared/components"
import { formatDateTime } from "shared/utils/dateTime"
import CreateProfile from "./CreateProfile"
import { PageHeaderWrapper, PageLoading } from "@ant-design/pro-layout"
import { Avatar, Row, Col, Descriptions, Button } from "antd"
import History from "pages/Profile/History"
import ProfileContext from "pages/Profile/context"
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons"

const tabs = [
  { key: "history", tab: <span>История</span>, Component: History }
]

const Profile = () => {
  const [tab, setTab] = useState("history")
  const Component = useMemo(() => tabs.find(el => el.key === tab).Component, [tab])
  const { employeeId } = useParams()
  const { parlor } = useContext(AuthenticationContext)
  const [{ isLoading, data, error }, fetchEmployee] = useApi.get(`/users/${employeeId}/`, {}, { mountFetch: true })

  if (isLoading) return <PageLoading tip={"Загрузка..."} />
  if (error) return <PageError />
  const profile = data.profile.find(p => p.parlor.id === parlor)
  if (!profile) return <CreateProfile fetchEmployee={fetchEmployee} parlor={parlor} user={data.id} />
  return <PageHeaderWrapper
    content={
      <Row>
        <Col md={5} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Avatar size={72} src={null}>{data.full_name.charAt(0)}</Avatar>
        </Col>
        <Col md={19}>
          <Descriptions column={1}>
            <Descriptions.Item label="ФИО">{data.full_name}</Descriptions.Item>
            <Descriptions.Item label="Должность">{profile.role_display}</Descriptions.Item>
            <Descriptions.Item label="Номер телефона">{data.phone_number}</Descriptions.Item>
            <Descriptions.Item label="Дата рождения">{formatDateTime(data.birth_date, "DD.MM.YYYY")}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    }
    extraContent={
      <Descriptions column={1}>
        <Descriptions.Item label="Дата регистрации">
          {formatDateTime(data.date_joined, "DD.MM.YYYY")}
        </Descriptions.Item>
        <Descriptions.Item label="Последний вход">
          {formatDateTime(data.last_login, "DD.MM.YYYY") || "–"}
        </Descriptions.Item>
      </Descriptions>
    }
    tabList={tabs}
    onTabChange={setTab}
    tabActiveKey={tab}
    tabBarExtraContent={<>
      <Button
        type="primary"
        style={{ background: "green", borderColor: "green" }}
        icon={<PlusSquareOutlined />}
      >
        Премия
      </Button>
      <Button
        type="primary"
        style={{ background: "red", borderColor: "red" }}
        icon={<MinusSquareOutlined />}
      >
        Штраф
      </Button>
    </>}
  >
    <ProfileContext.Provider value={{ user: data, profile }}>
      {Component && <Component employee={profile.id} />}
    </ProfileContext.Provider>
  </PageHeaderWrapper>
}

export default Profile