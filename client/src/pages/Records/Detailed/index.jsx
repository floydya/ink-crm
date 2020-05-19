import React, { useEffect, useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { PageHeaderWrapper, PageLoading } from "@ant-design/pro-layout"
import useApi from "shared/hooks/api"
import { RecordContext } from "pages/Records/Detailed/context"
import RecordContent from "pages/Records/Detailed/Content"
import pubsub from "sweet-pubsub"
import RecordExtraContent from "pages/Records/Detailed/ExtraContent"
import { getPrepayments } from "pages/Records/Detailed/ExtraContent/Modals/utils"
import { Button } from "antd"
import { RecordStatus } from "pages/Records/utils"
import Prepayments from "pages/Records/Detailed/Prepayments"
import Consumables from "pages/Records/Detailed/Consumables"
import useQuery from "shared/hooks/useQuery"

const RecordDetail = () => {
  const { recordId } = useParams()
  const [{ isLoading, data: record }, fetchRecord] = useApi.get(
    `/records/${recordId}/`,
    {},
    { mountFetch: true }
  )
  const [tab, setTab] = useQuery("tab", null)
  const tabList = useMemo(() => ([
    ...([RecordStatus.FINISHED, RecordStatus.CANCELED].includes(record?.status)
      ? [{ key: "detail", tab: `Подробности`, Component: () => <h2>Detail</h2> }]
      : []),
    { key: "prepayments", tab: `Предоплаты – ${getPrepayments(record?.prepayments)}`, Component: Prepayments },
    ...([RecordStatus.FINISHED, RecordStatus.IN_WORK].includes(record?.status)
      ? [{ key: "consumables", tab: "Расходники", Component: Consumables }]
      : [])
  ]), [record])
  const Component = useMemo(() => tabList.find(t => t.key === tab)?.Component, [tabList, tab])
  useEffect(() => {
    pubsub.on("fetch-record", fetchRecord)
    return () => pubsub.off("fetch-record", fetchRecord)
  }, [fetchRecord])
  if (isLoading) return <PageLoading />
  return <RecordContext.Provider value={{ record }}>
    <PageHeaderWrapper
      content={<RecordContent />}
      extraContent={<RecordExtraContent />}
      tabList={tabList}
      tabBarExtraContent={
        <Link to={`/customers/${record.customer.id}`}>
          <Button type="dashed" size="small">Перейти на страницу клиента</Button>
        </Link>
      }
      tabActiveKey={tab}
      onTabChange={setTab}
    >
      {Component ? <Component /> : null}
    </PageHeaderWrapper>
  </RecordContext.Provider>
}

export default RecordDetail
