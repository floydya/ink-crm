import React from "react"
import useApi from "shared/hooks/api"
import history from "../../history"
import { formatDate } from "../../shared/utils/dateTime"
import { Button, DatePicker, Form, Input } from "antd"
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import AntForm from "components/Form"
import MaskedInput from "antd-mask-input"


const CreateUserPage = () => {
  const [{ isCreating }, createUser] = useApi.post(`/users/`)
  return <PageHeaderWrapper>
    <AntForm handleSubmit={async (values) => {
      const response = await createUser({ ...values, birth_date: formatDate(values.birth_date, "YYYY-MM-DD") })
      await history.push(`/employees/${response.id}`)
    }} formProps={{ layout: "vertical" }}>
      <Form.Item label="Имя пользователя" name="username">
        <Input />
      </Form.Item>
      <Form.Item label="Имя" name="first_name">
        <Input />
      </Form.Item>
      <Form.Item label="Отчество" name="middle_name">
        <Input />
      </Form.Item>
      <Form.Item label="Фамилия" name="last_name">
        <Input />
      </Form.Item>
      <Form.Item label="Номер телефона" name="phone_number">
        <MaskedInput mask="+38(111) 111-11-11" />
      </Form.Item>
      <Form.Item label="Дата рождения" name="birth_date">
        <DatePicker style={{ width: "100%" }}/>
      </Form.Item>
      <Form.Item label="Пароль" name="new_password">
        <Input.Password />
      </Form.Item>
      <Form.Item label="Повторите пароль" name="confirm_new_password">
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" loading={isCreating}>
          Создать сотрудника
        </Button>
      </Form.Item>
    </AntForm>
  </PageHeaderWrapper>
}

export default CreateUserPage