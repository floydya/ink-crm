import { CreateContainer } from "./Styles"
import { ActionButton, Actions, FormElement, FormHeading, FormWrapper } from "../Authentication/Styles"
import Form from "../../shared/components/Form"
import toast from "../../shared/utils/toast"
import { roles } from "../../shared/constants/roles"
import React from "react"
import useApi from "../../shared/hooks/api"


const CreateProfile = ({ fetchEmployee, user, parlor }) => {
  const [{ isCreating }, createProfile] = useApi.post(`/profiles/`)

  return <CreateContainer>
    <div />
    <FormWrapper>
      <Form
        enableReinitialize
        initialValues={{
          role: ""
        }}
        validations={{
          role: Form.is.required()
        }}
        onSubmit={async (values, form) => {
          try {
            await createProfile({ ...values, user, parlor })
            fetchEmployee()
            toast.success("Профиль для этого салона создан.")
          } catch (error) {
            Form.handleAPIError(error, form)
          }
        }}
      >
        <FormElement>
          <FormHeading>Create new profile for parlor {parlor}.</FormHeading>
          <Form.Field.Select
            name="role"
            label="Роль"
            options={roles}
          />
          <Actions>
            <ActionButton type="submit" variant="primary" isWorking={isCreating}>
              Создать
            </ActionButton>
          </Actions>
        </FormElement>
      </Form>
    </FormWrapper>
    <div />
  </CreateContainer>
}

export default CreateProfile