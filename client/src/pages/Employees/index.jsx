import React, { Fragment, useContext, useEffect, useMemo, useState } from "react"
import useApi from "../../shared/hooks/api"
import { AuthenticationContext } from "../../services/authentication.service"
import { Container, ProfileLine, RoleLine } from "./Styles"
import { Avatar, Input, PageLoader } from "../../shared/components"
import lodash from "lodash"
import { Divider } from "../Authentication/Styles"
import Button from "../../shared/components/Button"
import { color } from "../../shared/utils/styles"
import NoResults from "../../shared/components/NoResults"
import { Link } from "react-router-dom"
import { useModalStateHelper } from "../Home/components/shared"
import Modal from "../../shared/components/Modal"
import CreateUserModal from "./CreateUserModal"

const Employees = () => {
  const { parlor } = useContext(AuthenticationContext)
  const modalHelper = useModalStateHelper()
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
  return <Container>
    <div>
      <h2>Сотрудники этой студии</h2>
      <Divider />
      {isLoading ? <PageLoader /> : <Fragment>
        {Object.entries(groupedEmployees).map(([role, employees]) => <Fragment key={role}>
          <RoleLine>{role}</RoleLine>
          {employees.map(el => (
            <ProfileLine key={el.id} style={{
              backgroundColor: search && search.length > 3 && (
                el.user.full_name.toLowerCase().includes(search.toLowerCase()) ||
                el.user.phone_number.includes(search)
              ) && color.backgroundLightPrimary
            }}>
              <Avatar name={el.user.full_name} />
              <h4>{el.user.full_name}</h4>
              <Link to={`/employees/${el.user.id}`}>
                <Button variant="empty" icon="link">Перейти</Button>
              </Link>
            </ProfileLine>
          ))}
        </Fragment>)}
      </Fragment>}
    </div>
    <div>
      <Input value={search} onChange={setSearch} icon="search" />
      {searchLoading ? <PageLoader /> : <Fragment>
        {searchResults.length ? searchResults.map(el =>
          <ProfileLine key={el.id}>
            <Avatar name={el.full_name} />
            <h4>{el.full_name}</h4>
            <Link to={`/employees/${el.id}`}>
              <Button variant="empty" icon="link">Перейти</Button>
            </Link>
          </ProfileLine>) : <NoResults title="Сотрудники не найдены" tip={
          search.length > 3 ? <Fragment>
            <Button variant="primary" onClick={modalHelper.open}>Создать</Button>
            {modalHelper.isOpen() && (
              <Modal
                isOpen
                withCloseIcon
                onClose={modalHelper.close}
                renderContent={({ close }) => (
                  <CreateUserModal modalClose={close} />
                )}
              />
            )}
          </Fragment> : null
        } />}
      </Fragment>}
    </div>
  </Container>
}


export default Employees
