import React from "react"
import { roles } from "shared/constants/roles"
import useApi from "shared/hooks/api"
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import AntForm from "components/Form"
import { Button, Form, Select, message, Row, Col } from "antd"


const CreateProfile = ({ fetchEmployee, user, parlor }) => {
  const [{ isCreating }, createProfile] = useApi.post(`/profiles/`)

  return <PageHeaderWrapper>
    <Row>
      <Col md={{ span: 6, offset: 9 }}>
        <AntForm handleSubmit={async (values) => {
          await createProfile({ ...values, user, parlor })
          await fetchEmployee()
          await message.success("Профиль сотрудника для этой студии создан.")
        }} formProps={{ layout: "vertical", size: "large" }}>
          <Form.Item name="role">
            <Select placeholder="Должность">
              {roles.map(el => <Select.Option key={el.value} value={el.value}>{el.label}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" loading={isCreating}>
              Создать профиль
            </Button>
          </Form.Item>
        </AntForm>
      </Col>
    </Row>
  </PageHeaderWrapper>
}

export default CreateProfile