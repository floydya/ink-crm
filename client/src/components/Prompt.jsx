import React  from "react"
import ReactDOM from "react-dom"
import { Modal, Input, Form } from "antd"

const PromptForm = ({ form, rules, placeholder }) => {
  return <Form form={form}>
    <Form.Item rules={rules} name="input">
      <Input placeholder={placeholder} />
    </Form.Item>
  </Form>
}

const Prompt = ({ title, afterClose, rules, placeholder, modalProps, visible, close }) => {
  const [form] = Form.useForm()
  const onOk = React.useCallback(() => {
    form.validateFields().then((values) => close(values.input))
  }, [form, close])
  return <Modal
    {...modalProps}
    visible={visible}
    onOk={onOk}
    onCancel={close.bind(null, undefined)}
    title={title}
    getContainer={false}
    afterClose={afterClose}
  >
    <PromptForm rules={rules} placeholder={placeholder} form={form} />
  </Modal>
}

export default function prompt(config) {
  return new Promise((resolve, reject) => {
    const div = document.createElement("div")
    document.body.appendChild(div)
    // eslint-disable-next-line no-use-before-define
    let currentConfig = { ...config, close, visible: true }

    function destroy(value) {
      const unmountResult = ReactDOM.unmountComponentAtNode(div)
      if (unmountResult && div.parentNode) {
        div.parentNode.removeChild(div)
      }
      if (value !== undefined) {
        resolve(value)
      } else {
        reject(value)
      }
    }

    function render(props) {
      ReactDOM.render(<Prompt {...props} />, div)
    }

    function close(value) {
      currentConfig = {
        ...currentConfig,
        visible: false,
        afterClose: destroy.bind(this, value)
      }
      render(currentConfig)
    }

    render(currentConfig)
  })
}