import React, { useCallback } from "react"
import history from "../../../history"
import { isValidPhoneNumber } from "shared/utils/phoneNumberValidation"
import useApi from "shared/hooks/api"
import { Button, Form } from "antd"
import AntForm from "components/Form"
import MaskedInput from "antd-mask-input"
import "antd/es/input/style/index.less"
import { PageHeaderWrapper } from "@ant-design/pro-layout"

const CustomerSearch = () => {
  const [{ clearData, isLoading }, fetchPhoneNumber] = useApi.get("/phone/", {}, { lazy: true })
  const [{ isCreating }, createPhone] = useApi.post("/phone/")
  const handleSearch = useCallback(async (values) => {
    clearData()
    const response = await fetchPhoneNumber(values)
    if ((response || []).length > 0) {
      if (response[0].customer) {
        await history.push(`/customers/${response[0].customer}`)
      } else {
        await history.push(`/customers/create/${response[0].id}`)
      }
    } else {
      const createResponse = await createPhone(values)
      await history.push(`/customers/create/${createResponse.id}`)
    }
  }, [createPhone, clearData, fetchPhoneNumber])

  return <PageHeaderWrapper>
    <AntForm handleSubmit={handleSearch} formProps={{ layout: "vertical", size: "large" }}>
      <Form.Item name="number" label="Номер телефона" rules={[
        {
          validator:
            (rule, value) =>
              value && isValidPhoneNumber(value)
                ? Promise.resolve()
                : Promise.reject("Некорректный номер телефона.")
        }
      ]}>
        <MaskedInput mask="+38(111) 111-11-11" />
      </Form.Item>
      <Form.Item style={{ textAlign: "center" }}>
        <Button htmlType="submit" type="primary" loading={isLoading || isCreating}>
          Найти
        </Button>
      </Form.Item>
    </AntForm>
  </PageHeaderWrapper>
}

export default CustomerSearch