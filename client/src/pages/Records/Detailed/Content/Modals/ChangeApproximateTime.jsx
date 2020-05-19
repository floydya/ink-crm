import React, { useContext } from "react"
import { RecordContext } from "pages/Records/Detailed/context"
import useApi from "shared/hooks/api"
import ModalForm from "components/ModalForm"
import { EditOutlined } from "@ant-design/icons"
import pubsub from "sweet-pubsub"
import { Form, message, TimePicker } from "antd"
import { canEdit } from "pages/Records/utils"
import * as moment from "moment"

const ChangeApproximateTime = () => {
  const { record } = useContext(RecordContext)
  const [{ isUpdating }, changeApproximateTime] = useApi.patch(`/records/${record.id}/`)
  if (!canEdit(record.status)) return moment(record.approximate_time, "HH:mm:ss").format("HH:mm")
  return <ModalForm
    buttonProps={{
      icon: <EditOutlined />,
      children: moment(record.approximate_time, "HH:mm:ss").format("HH:mm"),
      type: "dashed"
    }}
    title="Изменение примерного времени на сеанс"
    modalProps={{
      okText: "Изменить",
      cancelText: "Отменить",
      okButtonProps: { loading: isUpdating }
    }}
    formProps={{ layout: "vertical" }}
    handleSubmit={async (values) => {
      await changeApproximateTime({
        approximate_time: moment(values.approximate_time).format("HH:mm")
      })
      pubsub.emit("fetch-record")
      message.success("Примерное время на сеанс изменено!")
    }}
  >
    <Form.Item
      rules={[{ required: true, message: "Это поле обязательное для заполнения!" }]}
      name="approximate_time"
      label="Примерное время на сеанс"
      initialValue={moment(record.approximate_time, "HH:mm:ss")}
    >
      <TimePicker
        placeholder="Выберите время"
        format="HH:mm"
        minuteStep={5}
        style={{ width: "100%" }}
      />
    </Form.Item>
  </ModalForm>
}

export default ChangeApproximateTime
