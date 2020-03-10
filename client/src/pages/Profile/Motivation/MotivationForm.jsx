import React, { useMemo } from "react"
import Form from "../../../shared/components/Form"
import { ActionButton, Actions, FormElement, FormHeading } from "../../Authentication/Styles"
import useApi from "../../../shared/hooks/api"
import pubsub from "sweet-pubsub"

export const SessionForm = ({ types, href, motivation = null, employee, modalClose }) => {
  const [{ isUpdating }, updateMotivation] = useApi.patch(`/motivation/${href}/${motivation?.id}/`)
  const [{ isCreating }, createMotivation] = useApi.post(`/motivation/${href}/`)
  const [isLoading, handleMotivation] = useMemo(
    () => motivation?.id ? [isUpdating, updateMotivation] : [isCreating, createMotivation],
    [motivation, isUpdating, isCreating, updateMotivation, createMotivation]
  )
  return <div>
    <Form
      enableReinitialize
      initialValues={{
        employee: employee,
        session_type: motivation?.session_type?.id || "",
        base_percent: motivation?.base_percent || "",
        invite_percent: motivation?.invite_percent || ""
      }}
      validations={{
        session_type: Form.is.required(),
        base_percent: Form.is.required(),
        invite_percent: Form.is.required()
      }}
      onSubmit={async (values, form) => {
        try {
          await handleMotivation({ ...values })
          await pubsub.emit('fetch-profile')
          modalClose()
        } catch (error) {
          Form.handleAPIError(error, form)
        }
      }}
    >
      <FormElement>
        <FormHeading>
          {!motivation?.id ? "Добавление мотивации" : "Изменение мотивации"}
        </FormHeading>
        <Form.Field.Select
          options={
            motivation?.id
              ? [{ label: motivation?.session_type.name, value: motivation?.session_type?.id }]
              : types
          }
          name={"session_type"}
          label="Категория"
          disabled={motivation?.id}
        />
        <Form.Field.Input
          type="number"
          name="base_percent"
          label="Базовый процент"
        />
        <Form.Field.Input
          type="number"
          name="invite_percent"
          label="Процент за приглашение"
        />
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isLoading}>
            Сохранить
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  </div>
}

export const StoreForm = ({ types, motivation = null, employee, modalClose }) => {
  const [{ isUpdating }, updateMotivation] = useApi.patch(`/motivation/sells/${motivation?.id}/`)
  const [{ isCreating }, createMotivation] = useApi.post(`/motivation/sells/`)
  const [isLoading, handleMotivation] = useMemo(
    () => motivation?.id ? [isUpdating, updateMotivation] : [isCreating, createMotivation],
    [motivation, isUpdating, isCreating, updateMotivation, createMotivation]
  )
  return <div>
    <Form
      enableReinitialize
      initialValues={{
        sell_category: motivation?.sell_category?.id || "",
        base_percent: motivation?.base_percent || "",
      }}
      validations={{
        sell_category: Form.is.required(),
        base_percent: Form.is.required(),
      }}
      onSubmit={async (values, form) => {
        try {
          await handleMotivation({ ...values, employee })
          await pubsub.emit('fetch-profile')
          modalClose()
        } catch (error) {
          Form.handleAPIError(error, form)
        }
      }}
    >
      <FormElement>
        <FormHeading>
          {motivation?.id ? "Добавление мотивации" : "Изменение мотивации"}
        </FormHeading>
        <Form.Field.Select
          options={motivation?.id
              ? [{ label: motivation?.sell_category.name, value: motivation?.sell_category?.id }]
              : types}
          name={"sell_category"}
          label="Категория"
          disabled={motivation?.id}
        />
        <Form.Field.Input
          type="number"
          name="base_percent"
          label="Процент"
        />
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isLoading}>
            Сохранить
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  </div>
}




