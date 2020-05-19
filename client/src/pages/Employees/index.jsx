import React, { useContext, useEffect, useMemo, useState } from "react"
import useApi from "shared/hooks/api"
import { AuthenticationContext } from "services/authentication.service"
import lodash from "lodash"
import { Link } from "react-router-dom"
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import { Col, Row, List, Avatar, Input, Button, Divider } from "antd"

const Employees = () => {
  const { parlor } = useContext(AuthenticationContext)
  const [{ isLoading, data }] = useApi.get(`/profiles/`, { parlor }, { mountFetch: true })

  const [search, setSearch] = useState("")
  const [{ isLoading: searchLoading, data: searchData, clearData }, fetchEmployees] = useApi.get(`/users/`, {}, { lazy: true })
  const groupedEmployees = useMemo(
    () => lodash.groupBy(data, el => el.role_display),
    [data]
  )
  const searchResults = useMemo(() => {
    return ((searchData || []).filter(el => !el.profile.find(profile => profile.parlor.id === parlor)))
  }, [parlor, searchData])
  useEffect(() => {
    if (search && search.length > 3) {
      fetchEmployees({ search: search.toLowerCase() })
    } else {
      clearData()
    }
  }, [clearData, search, fetchEmployees])
  return <PageHeaderWrapper content={
    <Input
      size="large"
      placeholder="Поиск сотрудника..."
      onChange={(e) => setSearch(e.target.value)}
      value={search}
    />
  }>
    <Row>
      <Col md={11}>
        {Object.entries(groupedEmployees).map(([role, employees]) => (
          <React.Fragment key={role}>
            <Divider orientation="left">{role}</Divider>
            <List
              loading={isLoading}
              itemLayout="horizontal"
              dataSource={employees || []}
              renderItem={item => (
                <List.Item
                  style={{ backgroundColor: (searchData || []).find(el => el.id === item.user.id) && "rgba(255, 0, 0, 0.15)" }}
                  actions={[
                    <Link to={`/employees/${item.user.id}`}>
                      <Button type="link">Перейти в профиль</Button>
                    </Link>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar size="large">{item.user.full_name.charAt(0)}</Avatar>}
                    title={item.user.full_name}
                  />
                </List.Item>
              )}
            />
          </React.Fragment>
        ))}
      </Col>
      <Col md={11} offset={2}>
        <List
          loading={searchLoading}
          itemLayout="horizontal"
          dataSource={searchResults || []}
          footer={!(searchResults || []).length && search.length > 3 && <div style={{ textAlign: "center" }}>
            <Link to={`/employees/create`}><Button type="primary">Создать сотрудника</Button></Link>
          </div>}
          renderItem={item => (
            <List.Item
              actions={[
                <Link to={`/employees/${item.id}`}>
                  <Button type="link">Создать профиль</Button>
                </Link>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar size="large">{item.full_name.charAt(0)}</Avatar>}
                title={item.full_name}
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  </PageHeaderWrapper>
}


export default Employees
