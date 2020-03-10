import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { AvatarContainer, CustomerContainer, DL, LeftContainer, RightContainer } from "./Styles"
import { Avatar, PageError, PageLoader } from "../../../shared/components"
import { Divider } from "../../Authentication/Styles"
import useApi from "../../../shared/hooks/api"
import Tabs from "../../../shared/components/Tabs"
import PhoneVerification from "./PhoneVertification"
import pubsub from "sweet-pubsub"
import RecordList from "./RecordList"

const CustomerDetail = () => {
  const { customerId } = useParams()
  const [{ isLoading, data, error }, fetchCustomer] = useApi.get(`/customers/${customerId}/`, {}, { mountFetch: true })

  useEffect(() => {
    pubsub.on('fetch-customer', fetchCustomer)
    return () => pubsub.off('fetch-customer', fetchCustomer)
  }, [fetchCustomer])

  if (isLoading) return <PageLoader />
  if (error) return <PageError />

  return <CustomerContainer>
    <LeftContainer>
      <AvatarContainer>
        <Avatar name={data.full_name} size={150} />
        <h2 style={{ marginTop: "25px" }}>{data.full_name}</h2>
      </AvatarContainer>
      <Divider />
      <div style={{ marginTop: "25px" }}>
        <h3 style={{ fontWeight: "bold" }}>Информация</h3>
        <DL>
          <dt>Номер телефона</dt>
          <dd>{data.phone.number}</dd>
          <dt>Email</dt>
          <dd>{data.email || "–"}</dd>
          <dt>Дата рождения</dt>
          <dd>{data.birth_date}</dd>
          <dt>Откуда узнал?</dt>
          <dd>{data.find_out?.name || "–"}</dd>
          <dt>Заметка</dt>
          <dd>{data.note || "–"}</dd>
        </DL>
      </div>
    </LeftContainer>
    <Tabs tabs={[
      ...!data.phone?.confirmed ? [{
        label: "Верификация", render: <RightContainer>
          <PhoneVerification phone={data.phone} />
        </RightContainer>
      }] : [],
      { label: "Сеансы", render: <RightContainer>
          <RecordList records={data.records} />
        </RightContainer> },
      { label: "Покупки", render: <RightContainer>Покупки</RightContainer> },
      { label: "Обучения", render: <RightContainer>Обучения</RightContainer> }
    ]} />
  </CustomerContainer>
}

export default CustomerDetail
