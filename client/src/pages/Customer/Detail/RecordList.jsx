import React, { useMemo } from "react"
import PropTypes from "prop-types"
import { useCurrentProfile } from "shared/hooks/currentUser"
import { formatDateTime } from "shared/utils/dateTime"
import { useParams, Link } from "react-router-dom"
import { RecordStatusLabel, RecordStatusOrder } from "pages/Records/utils"
import moment from "moment"
import { Button, Space, Table } from "antd"

const propTypes = {
  data: PropTypes.shape({
    records: PropTypes.array.isRequired
  })
}

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
    render: (status, original) => <RecordStatusLabel status={status} children={original.status_display} />
  },
  {
    title: "Дата",
    dataIndex: "datetime",
    key: "datetime",
    render: (datetime) => formatDateTime(datetime, "DD.MM.YYYY HH:mm")
  },
  {
    title: "Действия",
    key: "action",
    render: (text, record) => <Space size="middle">
      <Link to={`/records/${record.id}`}>
        <Button type="default">
          Перейти
        </Button>
      </Link>
    </Space>
  }
]

const RecordList = ({ data }) => {
  const profile = useCurrentProfile()
  const { customerId } = useParams()
  const recordList = useMemo(
    () =>
      data.records
        .filter(el => el.parlor.id === profile.parlor.id)
        .sort(
          (a, b) => {
            if (a.status === b.status) {
              return moment(a.datetime).diff(moment(b.datetime))
            }
            return RecordStatusOrder[a.status] - RecordStatusOrder[b.status]
          }
        ),
    [data.records, profile.parlor.id]
  )
  return (<Table columns={columns} dataSource={recordList} title={() => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <h3>
        Записи в этом салоне. Всего записей у этого клиента: {data.records.length}.
      </h3>
      <Link to={`/records/create/${customerId}`}>
        <Button type="primary">
          Создать
        </Button>
      </Link>
    </div>
  )} />)
}

RecordList.propTypes = propTypes

export default RecordList
