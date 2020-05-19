import React, { useContext } from "react"
import { RecordContext } from "pages/Records/Detailed/context"
import useApi from "shared/hooks/api"
import ModalForm from "components/ModalForm"
import { EditOutlined } from "@ant-design/icons"
import pubsub from "sweet-pubsub"
import { Form, message, DatePicker } from "antd"
import { canEdit } from "pages/Records/utils"
import { formatDateTime } from "shared/utils/dateTime"
import * as moment from "moment"

const ChangeDatetimeModal = () => {
  const { record } = useContext(RecordContext)
  const [{ isUpdating }, changeDatetime] = useApi.patch(`/records/${record.id}/`)
  if (!canEdit(record.status)) return formatDateTime(record.datetime, "dddd, DD.MM.YYYY HH:mm")
  return <ModalForm
    buttonProps={{
      icon: <EditOutlined />,
      children: formatDateTime(record.datetime, "dddd, DD.MM.YYYY HH:mm"),
      type: "dashed"
    }}
    title="Изменение даты и времени записи"
    modalProps={{
      okText: "Изменить",
      cancelText: "Отменить",
      okButtonProps: { loading: isUpdating }
    }}
    formProps={{ layout: "vertical" }}
    handleSubmit={async (values) => {
      await changeDatetime(values)
      pubsub.emit("fetch-record")
      message.success("Дата и время записи успешно изменены!")
    }}
  >
    <Form.Item rules={[{ required: true, message: "Это поле обязательное для заполнения!" }]} name="datetime" label="Дата и время" initialValue={moment(record.datetime)}>
      <DatePicker
        placeholder="Выберите дату и время"
        format="DD.MM.YYYY HH:mm"
        minuteStep={5}
        style={{ width: "100%" }}
        showTime
      />
    </Form.Item>
  </ModalForm>
}

export default ChangeDatetimeModal
