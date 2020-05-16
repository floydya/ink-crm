import React, { useContext } from "react"
import { months, years } from "shared/constants/dates"
import moment from "moment"
import useApi from "shared/hooks/api"
import pubsub from "sweet-pubsub"
import { Button, Col, Form, Input, message, Row, Select } from "antd"
import ProfileContext from "pages/Profile/context"
import AntForm from "components/Form"
import { PageHeaderWrapper } from "@ant-design/pro-layout"

const BountyCreateForm = () => {
  const { profile } = useContext(ProfileContext)
  const [{ data }] = useApi.get(`/types/bounties/`, {}, { mountFetch: true })
  const [{ isCreating }, createBounty] = useApi.post(`/bounties/`)

  return <PageHeaderWrapper>
    <AntForm
      formProps={{ layout: "vertical" }}
      handleSubmit={async (values) => {
        await createBounty({ ...values, employee: profile.id })
        await pubsub.emit("fetch-unpayed-payments")
        await message.success("Премия успешно создана.")
      }}
    >
      <Row>
        <Col md={11}>
          <Form.Item label="Месяц" name="month" initialValue={moment().month() + 1}>
            <Select>
              {months.map(t => <Select.Option value={t.value}>{t.label}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col md={{ span: 11, offset: 2 }}>
          <Form.Item label="Год" name="year" initialValue={moment().year()}>
            <Select>
              {years.map(t => <Select.Option value={t.value}>{t.label}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Тип премии" name="type">
        <Select>
          {(data || []).map(t => <Select.Option value={t.id}>{t.name}</Select.Option>)}
        </Select>
      </Form.Item>
      <Form.Item label="Сумма" name="amount">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="Заметка" name="note">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Доказательство" name="href">
        <Input type="url" />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" loading={isCreating}>
          Создать
        </Button>
      </Form.Item>
    </AntForm>
  </PageHeaderWrapper>
}

export default BountyCreateForm