import React, { useMemo } from "react"
import PropTypes from "prop-types"
import Form from "../../../shared/components/Form"
import toast from "../../../shared/utils/toast"
import { ModalContainer, Row } from "./Styles"
import { months, years } from "../../../shared/constants/dates"
import moment from "moment"
import useApi from "../../../shared/hooks/api"
import pubsub from "sweet-pubsub"
import { ActionButton, Actions, FormElement, FormHeading } from "../../Authentication/Styles"

const propTypes = {
  modalClose: PropTypes.func.isRequired,
  employee: PropTypes.number.isRequired,
}


const BountyModal = ({ modalClose, employee }) => {
  const [{ data }] = useApi.get(`/types/bounties/`, {}, { mountFetch: true })
  const [{isCreating}, createBounty] = useApi.post(`/bounties/`)
  const bountyTypes = useMemo(
    () => (data || []).map(el => ({ label: el.name, value: el.id })),
    [data]
  )
  return <ModalContainer>
    <Form
      enableReinitialize
      initialValues={{
        month: moment().month() + 1,
        year: moment().year(),
        type: "",
        amount: "",
        note: "",
        href: ""
      }}
      validations={{
        month: Form.is.required(),
        year: Form.is.required(),
        type: Form.is.required(),
        amount: Form.is.required()
      }}
      onSubmit={async (values, form) => {
        try {
          await createBounty({ ...values, employee })
          toast.success("Премия создана.")
          pubsub.emit('fetch-unpayed-payments')
          modalClose()
        } catch (error) {
          Form.handleAPIError(error, form)
        }
      }}
    >
      <FormElement>
        <FormHeading>Создание премии</FormHeading>
        <Row>
          <Form.Field.Select
            name="month"
            options={months}
            label="Месяц"
          />
          <Form.Field.Select
            name="year"
            options={years}
            label="Год"
          />
        </Row>
        <Form.Field.Select
          name="type"
          options={bountyTypes}
          label="Тип премии"
        />
        <Form.Field.Input
          name="amount"
          type="number"
          label="Сумма"
        />
        <Form.Field.Textarea
          name="note"
          label="Заметка"
        />
        <Form.Field.Input
          name="href"
          type="url"
          label="Ссылка на доказательство"
        />
        <Actions>
          <ActionButton type="submit" variant="success" disabled={isCreating} >
            Создать
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  </ModalContainer>
}

BountyModal.propTypes = propTypes

export default BountyModal