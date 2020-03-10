import React, { useContext } from "react"
import { Link, useParams } from "react-router-dom"
import useApi from "../../shared/hooks/api"
import { AuthenticationContext } from "../../services/authentication.service"
import { PageError, PageLoader } from "../../shared/components"
import {
  Card,
  Container,
  Info, InfoBody,
  InfoCard, InfoHeader,
  ProfileAvatar,
  ProfileName,
  ProfileRole,
  Row
} from "./Styles"
import { Divider } from "../Authentication/Styles"
import { formatDateTime } from "../../shared/utils/dateTime"
import History from "./History"
import Breadcrumbs from "../../shared/components/Breadcrumbs"
import CreateProfile from "./CreateProfile"

const Profile = () => {
  const { employeeId } = useParams()
  const { parlor } = useContext(AuthenticationContext)
  const [{ isLoading, data, error }, fetchEmployee] = useApi.get(`/users/${employeeId}/`, {}, { mountFetch: true })
  if (isLoading) return <PageLoader />
  if (error) return <PageError />
  const profile = data.profile.find(p => p.parlor.id === parlor)

  if (!profile) return <CreateProfile fetchEmployee={fetchEmployee} parlor={parlor} user={data.id} />

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Breadcrumbs items={[
        { name: "Сотрудники", link: "/employees" },
        { name: data.full_name }
      ]} />
      <Link to={`/employees/${employeeId}/motivations`}>Мотивация</Link>
    </div>
    <Container>
      <Card>
        <ProfileAvatar size={150} name={data.last_name} />
        <ProfileName>{data.full_name}</ProfileName>
        <ProfileRole>{profile.role_display}</ProfileRole>
      </Card>
      <InfoCard>
        <span>Информация о сотруднике</span>
        <Divider />
        <Row>
          <Info>
            <InfoHeader>Дата рождения</InfoHeader>
            <InfoBody>{formatDateTime(data.birth_date, "DD.MM.YYYY")}</InfoBody>
          </Info>
          <Info>
            <InfoHeader>Номер телефона</InfoHeader>
            <InfoBody>{data.phone_number}</InfoBody>
          </Info>
          <Info>
            <InfoHeader>Дата регистрации</InfoHeader>
            <InfoBody>{formatDateTime(data.date_joined, "DD.MM.YYYY")}</InfoBody>
          </Info>
          <Info>
            <InfoHeader>Последний вход</InfoHeader>
            <InfoBody>
              {data.last_login
                ? formatDateTime(data.last_login, "DD.MM.YYYY")
                : "–"
              }
            </InfoBody>
          </Info>
        </Row>
        {/*<Divider style={{ marginTop: "0" }} />*/}
      </InfoCard>
    </Container>
    <History employee={profile.id} />
  </div>
}

export default Profile