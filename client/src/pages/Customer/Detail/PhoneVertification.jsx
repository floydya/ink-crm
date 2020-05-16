import React, { useCallback, useState } from "react"
import PropTypes from "prop-types"
import useApi from "shared/hooks/api"
import pubsub from "sweet-pubsub"
import useInterval from "shared/hooks/useInterval"
import { Button, Form } from "antd"
import AntForm from "components/Form"
import MaskedInput from "antd-mask-input"
import "antd/es/input/style/index.less"
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
    <AntForm handleSubmit={async (values) => {
      await updatePhone(values)
      await pubsub.emit("fetch-customer")
    }} formProps={{ layout: "vertical" }}>
      <Form.Item label="Пин-код" name="verification_code" rules={[
        {
          validator: (rule, value) =>
            /^\d{4}$/.test(value)
              ? Promise.resolve()
              : Promise.reject("Пин-код должен быть из 4-х цифр.")
        }
      ]}>
        <MaskedInput mask="1111" />
      </Form.Item>
      <Form.Item style={{ width: "100%" }}>
        <Button type="primary" htmlType="submit" loading={isUpdating}>
          Подтвердить
        </Button>
        <Button type="link" onClick={handleSend} htmlType="button" loading={seconds > 0}>
          {seconds > 0 ? `Можно отправить еще раз через ${seconds} секунд.` : "Отправить пин-код по СМС"}
        </Button>
      </Form.Item>
    </AntForm>
  </div>
}

PhoneVerification.propTypes = propTypes

export default PhoneVerification