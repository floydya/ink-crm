import React from "react"
import { useContext, useMemo } from "react"
import { RecordContext } from "pages/Records/Detailed/context"
import useApi from "shared/hooks/api"
import ModalForm from "components/ModalForm"
import { Form, message, Select } from "antd"
import { canEdit } from "pages/Records/utils"
import pubsub from "sweet-pubsub"
import { EditOutlined } from "@ant-design/icons"

const ChangePerformerModal = () => {
  const { record } = useContext(RecordContext)
  const [{ data }] = useApi.get(`/profiles/`, { session_type: record.type.id }, { mountFetch: true })
  const employees = useMemo(
    () => (data || []).map(el => ({ label: el.user.full_name, value: el.id })),
    [data]
  )
  const [{ isUpdating }, changePerfomer] = useApi.patch(`/records/${record.id}/`)
  if (!canEdit(record.status)) return `${record.performer.role_display} ${record.performer.user.full_name}`
  return <ModalForm
    buttonProps={{
      icon: <EditOutlined />,
      children: `${record.performer.role_display} ${record.performer.user.full_name}`,
      type: "dashed"
    }}
    title="Изменение исполнителя"
    modalProps={{
      okText: "Изменить",
      cancelText: "Отменить",
      okButtonProps: { loading: isUpdating }
    }}
    formProps={{ layout: "vertical" }}
    handleSubmit={async (values) => {
      await changePerfomer(values)
      pubsub.emit("fetch-record")
      message.success("Исполнитель успешно изменен!")
    }}
  >
    <Form.Item rules={[{ required: true, message: "Это поле обязательное для заполнения!" }]} name="performer" label="Исполнитель" initialValue={record.performer.id}>
      <Select>
        {employees.map(e => <Select.Option key={e.value} value={e.value}>{e.label}</Select.Option>)}
      </Select>
    </Form.Item>
  </ModalForm>
}

export default ChangePerformerModal