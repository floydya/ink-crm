import React, { useContext } from "react"
import qs from "query-string"
import useApi from "../../shared/hooks/api"
import {
  Container, FormWrapper
} from "./Styles"
import { authenticationActions } from "../../store/actions"
import { Redirect, useLocation } from "react-router-dom"
import { AuthenticationContext } from "../../services/authentication.service"
import AntForm from "components/Form"
import { Button, Form, Input, message } from "antd"
import { UserOutlined, KeyOutlined } from "@ant-design/icons"

const Authentication = () => {
  const { search } = useLocation()
  const { next } = qs.parse(search)
  const { dispatch, loggedIn: isAuthenticated } = useContext(AuthenticationContext)
  const [{ isCreating }, authorizeUser] = useApi.post("/auth/login/")

  if (isAuthenticated) return <Redirect to={next ? next : "/"} />
  return <Container>
    <FormWrapper>
      <AntForm handleSubmit={async (values, form) => {
        const { token } = await authorizeUser(values)
        localStorage.setItem("token", token)
        dispatch(authenticationActions.loginUser(token))
        message.success("You are successfully authorized.")
      }} formProps={{
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
      }}>
        <h1>Авторизация</h1>
        <Form.Item label="Имя пользователя" name="username" rules={[{ required: true }]}>
          <Input size="large" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item label="Пароль" name="password" rules={[{ required: true }]}>
          <Input.Password size="large" prefix={<KeyOutlined />} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button size="large" type="primary" htmlType="submit" loading={isCreating}>
            Войти
          </Button>
        </Form.Item>
      </AntForm>
    </FormWrapper>
  </Container>
}

export default Authentication