import React, { useState } from "react"
import { Modal, Form, Button } from "antd"
import AntForm from "components/Form"

const FormInModal = ({ handleSubmit, title, afterClose, children, modalProps, formProps, visible, close }) => {
  const [form] = Form.useForm()
  const onOk = React.useCallback(() => {
    form.validateFields().then(async (values) => {
      await handleSubmit(values)
      await close()
    })
  }, [form, close, handleSubmit])
  return <Modal
    {...modalProps}
    visible={visible}
    onOk={onOk}
    onCancel={close}
    title={title}
    getContainer={false}
    afterClose={afterClose}
  >
    <AntForm _form={form} {...formProps}>
      {children}
    </AntForm>
  </Modal>
}

const ModalForm = ({ buttonProps, ...props }) => {
  const [visible, setVisible] = useState(false)
  return <>
    <Button htmlType="button" {...buttonProps} onClick={setVisible.bind(null, true)} />
    <FormInModal {...props} visible={visible} close={setVisible.bind(null, false)} />
  </>
}

export default ModalForm