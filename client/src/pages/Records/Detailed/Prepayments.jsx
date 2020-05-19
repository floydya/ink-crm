import React, { useContext } from "react"
import { message, Button, Table, Form, Input, Popconfirm } from "antd"
import { formatDateTime } from "shared/utils/dateTime"
import { RecordContext } from "pages/Records/Detailed/context"
import ModalForm from "components/ModalForm"
import pubsub from "sweet-pubsub"
import useApi from "shared/hooks/api"
import { canEdit } from "pages/Records/utils"

const CreatePrepaymentModalForm = () => {
  const { record } = useContext(RecordContext)
  const [{ isCreating }, createPrepayment] = useApi.post(`/prepayments/`)
  return <div>
    <ModalForm
      buttonProps={{ type: "primary", children: "Добавить предоплату" }}
      title="Добавление предоплаты"
      modalProps={{ okText: "Добавить", cancelText: "Отменить", okButtonProps: { loading: isCreating } }}
      formProps={{ layout: "vertical" }}
      handleSubmit={async (values) => {
        await createPrepayment({ ...values, record: record.id })
        message.success("Предоплата успешно добавлена!")
        pubsub.emit("fetch-record")
      }}
    >
      <Form.Item label="Сумма" name="value">
        <Input type="number" />
      </Form.Item>
    </ModalForm>
  </div>
}

const DeletePrepaymentPopup = ({ prepayment }) => {
  const [, deletePrepayment] = useApi.delete(`/prepayments/${prepayment.id}/`)
  return <Popconfirm
    title="Вы действительно хотите удалить эту предоплату?"
    cancelText="Отмена"
    okText="Удалить"
    onConfirm={async () => {
      await deletePrepayment()
      message.success("Предоплата успешно удалена!")
      pubsub.emit("fetch-record")
    }}
  >
    <Button type="dashed">Удалить</Button>
  </Popconfirm>
}

const Prepayments = () => {
  const { record } = useContext(RecordContext)
  return <Table
    pagination={false}
    title={canEdit(record.status) ? CreatePrepaymentModalForm : null}
    columns={[
      { title: "ID", dataIndex: "id", key: "id" },
      {
        title: "Дата",
        dataIndex: "created_at",
        key: "created_at",
        render: v => formatDateTime(v)
      },
      {
        title: "Кем создана",
        dataIndex: "created_by",
        key: "created_by",
        render: v => v.full_name
      },
      { title: "Сумма", dataIndex: "value", key: "value" },
      ...canEdit(record.status) ? [{
        title: "Действия", dataIndex: "", key: "x", render: (_, r) => <DeletePrepaymentPopup prepayment={r} />
      }] : []
    ]}
    dataSource={record.prepayments}
    rowKey="id"
    summary={pageData => (
      <Table.Summary.Row>
        <Table.Summary.Cell colSpan={3}>Итого</Table.Summary.Cell>
        <Table.Summary.Cell>{pageData.reduce((acc, next) => acc + parseFloat(next.value), 0.0).toFixed(2)}</Table.Summary.Cell>
      </Table.Summary.Row>
    )}
  />
}

export default Prepayments