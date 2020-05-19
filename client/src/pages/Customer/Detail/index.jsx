import React, { lazy, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import useApi from "shared/hooks/api"
import PhoneVerification from "./PhoneVertification"
import pubsub from "sweet-pubsub"
import { PageHeaderWrapper, PageLoading } from "@ant-design/pro-layout"
import { Descriptions } from "antd"
import useQuery from "shared/hooks/useQuery"

const RecordList = lazy(() => import("./RecordList"))

const tabs = [
  { key: "works", tab: <span>Работы</span> },
  { key: "records", tab: <span>Записи</span>, Component: RecordList },
  { key: "sells", tab: <span>Покупки</span> },
  { key: "studies", tab: <span>Обучения</span> }
]

const CustomerDetail = () => {
  const { customerId } = useParams()
  const [{ isLoading, data, error }, fetchCustomer] = useApi.get(`/customers/${customerId}/`, {}, { mountFetch: true })
  const [tab, setTab] = useQuery("tab", "works")
  const CurrentTab = useMemo(() => tabs.find(el => el.key === tab).Component, [tab])
  useEffect(() => {
    pubsub.on("fetch-customer", fetchCustomer)
    return () => pubsub.off("fetch-customer", fetchCustomer)
  }, [fetchCustomer])

  if (isLoading) return <PageLoading tip={"Загрузка..."} />
  if (error) return null

  return <PageHeaderWrapper
    tabList={tabs}
    content={
      <Descriptions column={2}>
        <Descriptions.Item label="ФИО">{data.full_name}</Descriptions.Item>
        <Descriptions.Item label="Номер телефона">{data.phone.number}</Descriptions.Item>
        <Descriptions.Item label="Email">{data.email || "–"}</Descriptions.Item>
        <Descriptions.Item label="Дата рождения">{data.birth_date}</Descriptions.Item>
        <Descriptions.Item label="Откуда узнал?">{data.find_out?.name || "–"}</Descriptions.Item>
        <Descriptions.Item label="Заметка">{data.note || "–"}</Descriptions.Item>
      </Descriptions>
    }
    extraContent={
      !data.phone.confirmed && <PhoneVerification phone={data.phone} />
    }
    tabActiveKey={tab}
    onTabChange={setTab}
  >
    {CurrentTab && <CurrentTab data={data} />}
  </PageHeaderWrapper>
}

export default CustomerDetail
