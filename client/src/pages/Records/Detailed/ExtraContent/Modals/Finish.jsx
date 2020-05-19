import React, { useContext, useMemo, useState } from "react"
import { RecordContext } from "pages/Records/Detailed/context"
import ModalForm from "components/ModalForm"
import useApi from "shared/hooks/api"
import { Checkbox, Descriptions, Divider, Form, Input, message, Select } from "antd"
import pubsub from "sweet-pubsub"
import moment from "moment"
import {
  getCouponDenomination,
  getCouponType, getInviteCash,
  getPerformerCash,
  getPrepayments
} from "pages/Records/Detailed/ExtraContent/Modals/utils"
import { RecordStatus } from "pages/Records/utils"

const FinishRecordButton = () => {
  const { record } = useContext(RecordContext)
  const [formAccepted, setFormAccepted] = useState(false)
  const [{ isUpdating }, finishRecord] = useApi.patch(`/records/${record.id}/`)
  const [{ data: coupons }, fetchCoupons] = useApi.get(`/coupons/`, {}, { lazy: true })
  const timeSpent = useMemo(
    () => moment().diff(moment(record.status_changed), "hours"),
    [record]
  )
  const countedPrice = useMemo(
    () => parseFloat(record.type.price_per_hour) * timeSpent,
    [record, timeSpent]
  )

  return <ModalForm
    title="Завершение записи"
    modalProps={{
      okText: "Завершить",
      cancelText: "Отменить",
      okButtonProps: { loading: isUpdating, disabled: !formAccepted }
    }}
    formProps={{ layout: "vertical" }}
    buttonProps={{ type: "primary", children: "Завершить" }}
    handleSubmit={async (values) => {
      await finishRecord({ ...values, status: RecordStatus.FINISHED })
      pubsub.emit("fetch-record")
      message.success("Запись успешно завершена!")
    }}
  >
    <Form.Item
      label="Стоимость работы"
      rules={[{ required: true, message: "Это поле обязательное для заполнения!" }]}
      name="price"
      extra={countedPrice > 0 && <span>
        Затрачено {timeSpent} час(-ов) на работу. Примерная стоимость – {countedPrice} {record.type.price_per_hour_currency}.
      </span>}
    >
      <Input type="number" suffix={record.type.price_per_hour_currency} />
    </Form.Item>
    <Form.Item label="Купон" name="used_coupon">
      <Select
        showSearch
        placeholder="Введите серию и номер купона"
        showArrow={false}
        filterOption={false}
        onSearch={code => fetchCoupons({ code })}
        defaultActiveFirstOption={false}
      >
        {(coupons || []).map(c => <Select.Option key={c.id} value={c.id}>{c.code}</Select.Option>)}
      </Select>
    </Form.Item>
    <Divider>Итоговые подсчеты</Divider>
    <Form.Item noStyle shouldUpdate={() => true}>
      {({ getFieldValue }) => (
        <Descriptions column={1}>
          {getFieldValue("price") && (
            <Descriptions.Item label="Указанная стоимость">
              {getFieldValue("price")}
            </Descriptions.Item>
          )}
          {record.prepayments.length > 0 && (
            <Descriptions.Item label="Внесено предоплаты">
              {getPrepayments(record.prepayments)}
            </Descriptions.Item>
          )}
          {getFieldValue("used_coupon") && (
            <Descriptions.Item label={`Использован купон(${getCouponType(coupons, getFieldValue("used_coupon"))})`}>
              {getCouponDenomination(coupons, getFieldValue("used_coupon"))}
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Form.Item>
    <Divider>Распределение мотивации</Divider>
    <Form.Item noStyle shouldUpdate={() => true}>
      {({ getFieldValue }) => (
        <Descriptions column={1}>
          <Descriptions.Item label={`За работу – ${record.performer.user.full_name}`}>
            {getPerformerCash(record, getFieldValue("price"), coupons, getFieldValue("used_coupon"))}
          </Descriptions.Item>
          <Descriptions.Item label={`За приглашение – ${record.created_by.user.full_name}`}>
            {getInviteCash(record, getFieldValue("price"), coupons, getFieldValue("used_coupon"))}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Form.Item>
    <Divider />
    <Form.Item noStyle shouldUpdate={() => true}>
      {({ getFieldValue }) => (
        <Descriptions column={1}>
          <Descriptions.Item label="Нужно взять наличных">
            {getFieldValue("price") -
            getCouponDenomination(
              coupons,
              getFieldValue("used_coupon")
            ) - getPrepayments(record.prepayments)}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Form.Item>
    <Checkbox checked={formAccepted} onChange={e => setFormAccepted(e.target.checked)}>
      Я подтверждаю правильность введенных данных?
    </Checkbox>
  </ModalForm>
}

export default FinishRecordButton
