import React, { useCallback, useContext, useEffect, useMemo } from "react"
import useApi from "shared/hooks/api"
import pubsub from "sweet-pubsub"
import moment from "moment"
import { formatDateTime } from "shared/utils/dateTime"
import ProfileContext from "pages/Profile/context"
import { Button, Descriptions, Popconfirm, Table } from "antd"
import { getMonthName } from "shared/utils/dateTime"
import prompt from "components/Prompt"

const PaymentActions = ({ entity }) => {
  const URL = useMemo(
    () => {
      switch (entity.__type) {
        case "bounty":
          return `/bounties/${entity.id}/`
        case "fine":
          return `/fines/${entity.id}/`
        default:
          throw new Error("Undefined entity type")
      }
    }, [entity]
  )
  const [, updateEntity] = useApi.patch(URL)
  const applyEntity = useCallback(async () => {
    await updateEntity({ status: true })
    await pubsub.emit("fetch-unpayed-payments")
    await pubsub.emit("fetch-transactions")
  }, [updateEntity])
  const cancelEntity = useCallback(async () => {
    const reason = await prompt({
      title: "Причина отмены",
      rules: [{ required: true, message: "Это поле обязательное для заполнения!" }]
    })
    if (reason) {
      await updateEntity({
        status: false,
        status_change_reason: prompt("Введите причину отмены выплаты")
      })
      await pubsub.emit("fetch-unpayed-payments")
      await pubsub.emit("fetch-transactions")
    }
  }, [updateEntity])
  return <>
    <Popconfirm title="Вы уверены что хотите подтвердить платеж?" onConfirm={applyEntity} okText="Да" cancelText="Нет">
      <Button type="link">Подтвердить</Button>
    </Popconfirm>
    <Button type="link" onClick={cancelEntity}>Отменить</Button>
  </>
}

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "Тип",
    dataIndex: "type",
    key: "type",
    render: (type) => type.name
  },
  {
    title: "Сумма",
    dataIndex: "amount",
    key: "amount",
    render: (_, row) => row.__type === "fine" ? `-${_}` : _
  },
  {
    title: "Действия",
    dataIndex: "", key: "x",
    render: (_, row) => <PaymentActions entity={row} />
  }
]

const UnpayedPayments = () => {
  const {profile} = useContext(ProfileContext)

  const [{ data: bounties }, fetchBounties] = useApi.get(`/bounties/`, {
    employee_id: profile.id,
    status: "null"
  }, { mountFetch: true })
  const [{ data: fines }, fetchFines] = useApi.get(`/fines/`, {
    employee_id: profile.id,
    status: "null"
  }, { mountFetch: true })

  const data = useMemo(() => {
    const _b = (bounties || []).map(el => ({ ...el, key: `${el.id}__bounty`, __type: "bounty", color: "rgba(0, 255, 0, 0.05)" }))
    const _f = (fines || []).map(el => ({ ...el, key: `${el.id}__fine`, __type: "fine", color: "rgba(255, 0, 0, 0.05)" }))
    return [..._b, ..._f].sort((a, b) => moment(a.created_at).diff(moment(b.created_at)))
  }, [bounties, fines])

  const fetchAll = useCallback(() => {
    fetchFines()
    fetchBounties()
  }, [fetchFines, fetchBounties])

  useEffect(() => {
    pubsub.on("fetch-unpayed-payments", fetchAll)
    return () => pubsub.off("fetch-unpayed-payments", fetchAll)
  }, [fetchAll])

  return <Table columns={columns} dataSource={data} expandable={{
    expandedRowRender: record => (
      <Descriptions column={1}>
        <Descriptions.Item label="Период">
          {getMonthName(record.month)}{" "}
          {record.year}
        </Descriptions.Item>
        <Descriptions.Item label="Примечание">{record.note}</Descriptions.Item>
        {record.href && <Descriptions.Item label="Доказательство">
          <a href={record.href} target="_blank" rel="noopener noreferrer">
            Открыть в новой вкладке
          </a>
        </Descriptions.Item>}
        <Descriptions.Item label="Кто создал">{record.created_by.full_name}</Descriptions.Item>
        <Descriptions.Item label="Когда создал">
          {formatDateTime(record.created_at, "DD.MM.YYYY HH:mm:ss")}
        </Descriptions.Item>
      </Descriptions>
    )
  }} />
}

export default UnpayedPayments