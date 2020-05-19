import React, { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import useApi from "shared/hooks/api"
import { formatDate } from "shared/utils/dateTime"
import { useCurrentProfile } from "shared/hooks/currentUser"
import history from "../../../history"
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import { Button, DatePicker, Form, Input, Select } from "antd"
import AntForm from "components/Form"
import MaskedInput from "antd-mask-input"
import "antd/es/input/style/index.less"

const CustomerCreateForm = () => {
  const { phoneNumber } = useParams()
  const profile = useCurrentProfile()
  const [{ data }] = useApi.get(`/phone/${phoneNumber}/`, {}, { mountFetch: true })

  useEffect(() => {
    if (data && data.customer) {
      history.push(`/customers/${data.customer}`)
    }
  }, [data])

  const [{ data: findOuts }] = useApi.get(`/types/find-outs/`, {}, { mountFetch: true })
  const [{ isCreating }, createCustomer] = useApi.post(`/customers/`)

  const findOutOptions = useMemo(
    () => (findOuts || []).map(el => ({ label: el.name, value: el.id })),
    [findOuts]
  )

  return <PageHeaderWrapper>
    <AntForm
      formProps={{
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        size: "large"
      }}
      handleSubmit={async (values) => {
        const response = await createCustomer({
          ...values,
          phone: phoneNumber,
          created_by: profile.id,
          birth_date: formatDate(values.birth_date, "YYYY-MM-DD")
        })
        await history.push(`/customers/${response.id}`)
      }}
    >
      {data && <Form.Item label="Номер телефона">
        <MaskedInput mask="+38(111) 111-11-11" value={data.number} disabled />
      </Form.Item>}
      <Form.Item label="ФИО" name="full_name">
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input type="email" />
      </Form.Item>
      <Form.Item label="Откуда узнал?" name="find_out">
        <Select>
          {findOutOptions.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
        </Select>
      </Form.Item>
      <Form.Item label="Дата рождения" name="birth_date">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Заметка" name="note">
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isCreating}>Создать</Button>
      </Form.Item>
    </AntForm>
  </PageHeaderWrapper>
}

export default CustomerCreateForm