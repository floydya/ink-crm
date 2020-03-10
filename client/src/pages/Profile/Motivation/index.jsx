import React, { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { AuthenticationContext } from "../../../services/authentication.service"
import useApi from "../../../shared/hooks/api"
import { PageError, PageLoader } from "../../../shared/components"
import { Container } from "./Styles"
import pubsub from "sweet-pubsub"
import Breadcrumbs from "../../../shared/components/Breadcrumbs"
import SessionsTable from "./Tables/Sessions"
import EducationsTable from "./Tables/Educations"
import StoreTable from "./Tables/Sells"

const Motivation = () => {
  const { employeeId } = useParams()
  const { parlor } = useContext(AuthenticationContext)
  const [{ isLoading, data, error }, fetchProfile] = useApi.get(`/users/${employeeId}/`, {}, { mountFetch: true })

  useEffect(() => {
    pubsub.on("fetch-profile", fetchProfile)
    return () => pubsub.off("fetch-profile", fetchProfile)
  }, [fetchProfile])

  if (isLoading) return <PageLoader />
  if (error) return <PageError />

  const profile = data.profile.find(p => p.parlor.id === parlor)
  if (!profile) return <PageError />
  const {
    session_motivations: sessions,
    education_motivations: educations,
    sell_motivations: sells
  } = profile

  return <div>
    <Breadcrumbs items={[
      { name: "Сотрудники", link: "/employees" },
      { name: data.full_name, link: `/employees/${employeeId}` },
      { name: "Мотивация" }
    ]} />
    <Container>
      <SessionsTable employee={profile.id} sessions={sessions} />
      <EducationsTable employee={profile.id} educations={educations} />
      <StoreTable employee={profile.id} sells={sells} />
    </Container>
  </div>
}


export default Motivation
