import React, { useContext, useMemo, useEffect } from "react"
import { useParams } from "react-router-dom"
import useApi from "shared/hooks/api"
import { AuthenticationContext } from "services/authentication.service"
import { PageError } from "shared/components"
import { formatDateTime } from "shared/utils/dateTime"
import CreateProfile from "./CreateProfile"
import { PageHeaderWrapper, PageLoading } from "@ant-design/pro-layout"
import { Avatar, Row, Col, Descriptions } from "antd"
import History from "pages/Profile/History"
import Bounties from "pages/Profile/Bounties"
import ProfileContext from "pages/Profile/context"
import Fines from "./Fines"
import Motivation from "./Motivation"
import pubsub from "sweet-pubsub"
import useQuery from "shared/hooks/useQuery"

const tabs = [
  { key: "history", tab: <span>История</span>, Component: History },
  { key: "motivation", tab: <span>Мотивация</span>, Component: Motivation },
  { key: "bounties", tab: <span>Премии</span>, Component: Bounties },
  { key: "fines", tab: <span>Штрафы</span>, Component: Fines }
]

const Profile = () => {
  const [tab, setTab] = useQuery("tab", "history")
  const Component = useMemo(() => tabs.find((el) => el.key === tab).Component, [
    tab
  ])
  const { employeeId } = useParams()
  const { parlor } = useContext(AuthenticationContext)
  const [{ isLoading, data, error }, fetchEmployee] = useApi.get(
    `/users/${employeeId}/`,
    {},
    { mountFetch: true }
  )

  useEffect(() => {
    pubsub.on("fetch-profile", fetchEmployee)
    return () => pubsub.off("fetch-profile", fetchEmployee)
  })

  if (isLoading) return <PageLoading tip={"Загрузка..."} />
  if (error) return <PageError />
  const profile = data.profile.find((p) => p.parlor.id === parlor)
  if (!profile)
    return (
      <CreateProfile
        fetchEmployee={fetchEmployee}
        parlor={parlor}
        user={data.id}
      />
    )
  return (
    <ProfileContext.Provider value={{ user: data, profile }}>
      <PageHeaderWrapper
        content={
          <Row>
            <Col
              md={5}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Avatar size={72} src={null}>
                {data.full_name.charAt(0)}
              </Avatar>
            </Col>
            <Col md={19}>
              <Descriptions column={1}>
                <Descriptions.Item label="ФИО">
                  {data.full_name}
                </Descriptions.Item>
                <Descriptions.Item label="Должность">
                  {profile.role_display}
                </Descriptions.Item>
                <Descriptions.Item label="Номер телефона">
                  {data.phone_number}
                </Descriptions.Item>
                <Descriptions.Item label="Дата рождения">
                  {formatDateTime(data.birth_date, "DD.MM.YYYY")}
                </Descriptions.Item>
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
      >
        {Component && <Component employee={profile.id} />}
      </PageHeaderWrapper>
    </ProfileContext.Provider>
  )
}

export default Profile
