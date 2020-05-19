import React, { useContext } from "react"
import { RecordContext } from "pages/Records/Detailed/context"
import { RecordStatus } from "pages/Records/utils"
import { message, Form, Select, Input } from "antd"
import useApi from "shared/hooks/api"
import ModalForm from "components/ModalForm"
import pubsub from "sweet-pubsub"

const CancelRecordButton = () => {
  const { record } = useContext(RecordContext)
  const [{ isUpdating }, cancelRecord] = useApi.patch(`/records/${record.id}/`)
  return (
    <ModalForm
      title="Отмена записи"
      modalProps={{
        okText: "Отменить",
        cancelText: "Закрыть",
        okButtonProps: { loading: isUpdating }
      }}
      formProps={{ layout: "vertical" }}
      buttonProps={{
        type: "dashed",
        children: "Отменить"
      }}
      handleSubmit={async (values) => {
        await cancelRecord({
          ...values,
          status: RecordStatus.CANCELED,
          rollback_prepayment: values.rollback_prepayment || true
        })
        message.success("Запись успешно отменена!")
        pubsub.emit("fetch-record")
      }}
    >
      <Form.Item rules={[{ required: true, message: "Это поле обязательное для заполнения!" }]} label="Причина отмены" name="reason">
        <Input />
      </Form.Item>
      {record.prepayments.length > 0 &&
      <Form.Item rules={[{ required: true, message: "Это поле обязательное для заполнения!" }]} label="Что делать с предоплатой?" name="rollback_prepayment">
        <Select>
          <Select.Option value={true}>Вернуть клиенту</Select.Option>
          <Select.Option value={false}>Оставить в кассе</Select.Option>
        </Select>
      </Form.Item>}
    </ModalForm>
  )
}

export default CancelRecordButton
