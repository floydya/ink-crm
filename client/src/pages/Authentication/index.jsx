import React, { useContext } from "react"
import qs from "query-string"
import useApi from "../../shared/hooks/api"
import { Form } from "../../shared/components"
import {
  Container, FormWrapper,
  FormElement, FormHeading,
  ActionButton, Actions
} from "./Styles"
import toast from "../../shared/utils/toast"
import { authenticationActions } from "../../store/actions"
import { Redirect, useLocation } from "react-router-dom"
import { AuthenticationContext } from "../../services/authentication.service"

const Authentication = () => {
  const { search } = useLocation()
  const { next } = qs.parse(search)
  const { dispatch, loggedIn: isAuthenticated } = useContext(AuthenticationContext)
  const [{ isCreating }, authorizeUser] = useApi.post("/auth/login/")

  if (isAuthenticated) return <Redirect to={next ? next : "/"} />
  return <Container>
    <FormWrapper>
      <Form
        enableReinitialize
        initialValues={{
          username: "",
          password: ""
        }}
        validations={{
          username: Form.is.required(),
          password: Form.is.required()
        }}
        onSubmit={async (values, form) => {
          try {
            const { token } = await authorizeUser(values)
            localStorage.setItem("token", token)
            dispatch(authenticationActions.loginUser(token))
            toast.success("You are successfully authorized.")
          } catch (error) {
            Form.handleAPIError(error, form)
          }
        }}
      >
        <FormElement>
          <FormHeading>Авторизация</FormHeading>
          <Form.Field.Input
            name="username"
            label="Имя пользователя"
          />
          <Form.Field.Input
            type="password"
            name="password"
            label="Пароль"
          />
          <Actions>
            <ActionButton type="submit" variant="primary" isWorking={isCreating}>
              Войти
            </ActionButton>
          </Actions>
        </FormElement>
      </Form>
    </FormWrapper>
  </Container>
}

export default Authentication