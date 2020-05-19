import React, { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useCurrentProfile } from "shared/hooks/currentUser"

import useApi from "shared/hooks/api"
import history from "../../../history"
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import AntForm from "components/Form"
import {
  message,
  Select,
  DatePicker,
  TimePicker,
  Input,
  Form,
  Button, Checkbox
} from "antd"
import * as moment from "moment"

const RecordForm = () => {
  const [prepayment, setPrepayment] = useState(false)
  const { customerId } = useParams()
  const profile = useCurrentProfile()
  const [{ isCreating }, createRecord] = useApi.post(`/records/`)
  const [{ data: sessionTypes }] = useApi.get(
    `/types/sessions/`,
    {},
    { mountFetch: true }
  )
  const [{ data: employees }] = useApi.get(
    `/profiles/`,
    { parlor: profile?.parlor?.id },
    { mountFetch: true }
  )
  const types = useMemo(
    () => (sessionTypes || []).map((el) => ({ label: el.name, value: el.id })),
    [sessionTypes]
  )
  const filteredEmployees = useMemo(
    () =>
      (employees || []).map((el) => ({
        label: `[${el.role_display}] ${el.user.full_name}`,
        value: el.id,
        session_types: el.session_motivations.map((el) => el.id)
      })),
    [employees]
  )
  return (
    <PageHeaderWrapper>
      <AntForm
        formProps={{ layout: "vertical" }}
        handleSubmit={async (values) => {
          // console.log(values.sketch)
          // const b = await getBase64(values.sketch)
          // console.log(b)
          const formData = {
            ...values,
            prepayment: prepayment ? values.prepayment : 0,
            approximate_time: moment(values.approximate_time).format("HH:mm"),
            customer: customerId,
            parlor: profile.parlor.id,
            created_by: profile.id
          }
          const response = await createRecord(formData)
          history.push(`/records/${response.id}`)
          message.success("Запись успешно создана!")
        }}
      >
        <Form.Item name="type" label="Тип сеанса">
          <Select>
            {types.map((t) => (
              <Select.Option key={t.value} value={t.value}>{t.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="datetime" label="Дата и время">
          <DatePicker placeholder="Выберите дату и время" format="DD.MM.YYYY HH:mm" minuteStep={5}
                      style={{ width: "100%" }} showTime />
        </Form.Item>
        <Form.Item noStyle shouldUpdate={() => true}>
          {({ getFieldValue }) => (
            <Form.Item name="performer" label="Мастер">
              <Select>
                {filteredEmployees
                  .filter((e) =>
                    e.session_types.find((t) => t === getFieldValue("type"))
                  )
                  .map((e) => (
                    <Select.Option key={e.value} value={e.value}>{e.label}</Select.Option>
                  ))}
              </Select>
            </Form.Item>
          )}
        </Form.Item>
        <Form.Item name="approximate_time" label="Примерное время на сеанс" initialValue={moment("01:00", "HH:mm")}>
          <TimePicker placeholder="Выберите время" style={{ width: "100%" }} format="HH:mm" minuteStep={5} />
        </Form.Item>
        <Form.Item name="comment" label="Комментарий">
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Checkbox value={prepayment} onChange={(e) => setPrepayment(e.target.checked)}>Внести предоплату?</Checkbox>
        </Form.Item>
        {prepayment && <Form.Item name="prepayment" label="Сумма предоплаты">
          <Input type="number" />
        </Form.Item>}
        {/*<Form.Item name="sketch" label="Эскиз">*/}
        {/*  <Input type="file" />*/}
        {/*</Form.Item>*/}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isCreating}>
            Создать запись
          </Button>
        </Form.Item>
      </AntForm>
    </PageHeaderWrapper>
  )
}

export default RecordForm
