import React, { useContext, useEffect, useMemo, useState } from "react"
import { formatMoney } from "shared/utils/moneyFormat"
import { formatDateTime, formatDateTimeForAPI } from "shared/utils/dateTime"
import { capitalize } from "shared/utils/string"
import moment from "moment"
import useApi from "shared/hooks/api"
import groupBy from "lodash/groupBy"
import { Col, DatePicker, Row, Table } from "antd"
import ProfileContext from "pages/Profile/context"
import pubsub from "sweet-pubsub"

const getDateAndTotalsFromTransactions = (transactions) => {
  const grouped = groupBy(transactions, (el) =>
    moment(el.created_at).format("YYYY-MM-DD")
  )
  const groups = Object.entries(grouped)
    .map(([date, entries]) => ({
      date,
      total: entries.reduce((acc, next) => acc + parseFloat(next.amount), 0)
    }))
    .sort((a, b) => moment(b.date).diff(moment(a.date)))
  const getGroup = (date) =>
    grouped[date].sort((a, b) =>
      moment(b.created_at).diff(moment(a.created_at))
    )
  return [groups, getGroup]
}

const Transactions = () => {
  const { profile } = useContext(ProfileContext)
  const [dates, setDates] = useState([
    moment().startOf("month"),
    moment().endOf("month")
  ])
  const [{ isLoading, data }, fetchTransactions] = useApi.get(
    `/transactions/`,
    {
      created_at_after: formatDateTimeForAPI(dates[0]),
      created_at_before: formatDateTimeForAPI(dates[1]),
      purpose_id: profile.id
    },
    { mountFetch: true }
  )
  useEffect(() => {
    pubsub.on("fetch-transactions", fetchTransactions)
    return () => pubsub.off("fetch-transactions", fetchTransactions)
  }, [fetchTransactions])
  const [groups, getGroup] = useMemo(
    () => getDateAndTotalsFromTransactions(data),
    [data]
  )
  return (
    <Table
      title={() => (
        <Row>
          <Col md={12} xs={24}>
            <h2>Транзакции</h2>
          </Col>
          <Col md={12} xs={24}>
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              onChange={setDates}
              ranges={{
                Сегодня: [moment(), moment()],
                "Текущая неделя": [
                  moment().startOf("week"),
                  moment().endOf("week")
                ],
                "Текущий месяц": [
                  moment().startOf("month"),
                  moment().endOf("month")
                ],
                "Текущий год": [moment().startOf("year"), moment().endOf("year")]
              }}
              value={dates}
            />
          </Col>
        </Row>
      )}
      loading={isLoading}
      pagination={false}
      columns={[
        {
          title: "Дата",
          dataIndex: "date",
          key: "date",
          render: (value) => formatDateTime(value, "dddd, DD.MM.YYYY")
        },
        { title: "Сумма", dataIndex: "total", key: "total" }
      ]}
      dataSource={groups}
      rowKey="date"
      expandable={{
        defaultExpandedRowKeys: groups.map((el) => el.date),
        expandedRowRender: (record) => (
          <Table
            columns={[
              {
                title: "Время",
                dataIndex: "created_at",
                key: "created_at",
                render: (v) => formatDateTime(v, "HH:mm:ss")
              },
              {
                title: "Сумма",
                dataIndex: "amount",
                key: "amount",
                render: formatMoney
              },
              {
                title: "Назначение",
                dataIndex: "reference",
                key: "reference",
                render: capitalize
              }
            ]}
            dataSource={getGroup(record.date)}
            rowKey="id"
            pagination={false}
          />
        )
      }}
    />
  )
}

export default Transactions
