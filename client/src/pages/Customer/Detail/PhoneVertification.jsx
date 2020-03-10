import React, { useCallback, useState } from "react"
import PropTypes from "prop-types"
import { Form } from "../../../shared/components"
import { ActionButton, Actions, FormElement, FormHeading } from "../../Authentication/Styles"
import useApi from "../../../shared/hooks/api"
import pubsub from "sweet-pubsub"
import useInterval from "../../../shared/hooks/useInterval"

const propTypes = {
  phone: PropTypes.object.isRequired
}

const PhoneVerification = ({ phone }) => {
  const [{ isUpdating }, updatePhone] = useApi.patch(`/phone/${phone.id}/`)
  const [, sendSMS] = useApi.post(`/phone/${phone.id}/verify/`, { type: "sms" })
  const [seconds, setSeconds] = useState(0)

  const handleSend = useCallback(async () => {
    await sendSMS()
    await setSeconds(60)
  }, [sendSMS])

  useInterval(() => {
    if (seconds > 0) setSeconds(prev => prev - 1)
  }, 1000)

  return <div>
    <Form
      validations={{
        verification_code: Form.is.match(
          (pin) => /^\d{4}$/.test(pin),
          "Пин-код должен быть из 4-х цифр."
        )
      }}
      initialValues={{ verification_code: "" }}
      onSubmit={async (values, form) => {
        try {
          await updatePhone(values)
          pubsub.emit("fetch-customer")
        } catch (error) {
          Form.handleAPIError(error, form)
        }
      }}
    >
      <FormElement>
        <FormHeading>Подтверждение номера телефона</FormHeading>
        <Form.Field.Input name="verification_code" label="Пин-код" />
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isUpdating}>
            Подтвердить
          </ActionButton>
        </Actions>
        <Actions style={{ flexDirection: "column", alignItems: "center" }}>
          <ActionButton type="button" variant="empty" onClick={handleSend} isWorking={seconds > 0}>
            Отправить пин-код повторно по СМС
          </ActionButton>
          {seconds > 0 && <h5>Повторная отправка возможна через {seconds} секунд.</h5>}
        </Actions>
      </FormElement>
    </Form>
  </div>
}

PhoneVerification.propTypes = propTypes

export default PhoneVerification