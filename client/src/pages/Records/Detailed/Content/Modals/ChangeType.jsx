import React, { useContext, useMemo } from "react"
import { RecordContext } from "pages/Records/Detailed/context"
import useApi from "shared/hooks/api"
import ModalForm from "components/ModalForm"
import { EditOutlined } from "@ant-design/icons"
import pubsub from "sweet-pubsub"
import { Form, Select, message } from "antd"
import { canEdit } from "pages/Records/utils"

const ChangeTypeModal = () => {
  const { record } = useContext(RecordContext)
  const [{ data }] = useApi.get(`/types/sessions/`, {}, { mountFetch: true })
  const types = useMemo(
    () => (data || []).map(el => ({ label: el.name, value: el.id })),
    [data]
  )
  const [{ isUpdating }, changeType] = useApi.patch(`/records/${record.id}/`)
  if (!canEdit(record.status)) return record.type.name
  return <ModalForm
    buttonProps={{
      icon: <EditOutlined />,
      children: record.type.name,
      type: "dashed"
    }}
    title="Изменение типа записи"
    modalProps={{
      okText: "Изменить",
      cancelText: "Отменить",
      okButtonProps: { loading: isUpdating }
    }}
    formProps={{ layout: "vertical" }}
    handleSubmit={async (values) => {
      await changeType(values)
      pubsub.emit("fetch-record")
      message.success("Тип записи успешно изменен!")
    }}
  >
    <Form.Item rules={[{ required: true, message: "Это поле обязательное для заполнения!" }]} name="type" label="Тип сеанса" initialValue={record.type.id}>
      <Select>
        {types.map(t => <Select.Option key={t.value} value={t.value}>{t.label}</Select.Option>)}
      </Select>
    </Form.Item>
  </ModalForm>
}

export default ChangeTypeModal
