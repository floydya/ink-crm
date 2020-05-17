import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Modal, Form, Button, message } from "antd";
import AntForm from "components/Form";

const FormInModal = ({
  handleSubmit,
  title,
  afterClose,
  children,
  modalProps,
  formProps,
  visible,
  close,
}) => {
  const [form] = Form.useForm();
  const onOk = React.useCallback(
    () => {
      form.validateFields().then(async (values) => {
        try {
          await handleSubmit(values);
          await close();
        } catch (errors) {
          if (errors?.data) {
            const formData = Object.entries(errors.data).map(
              ([name, errors]) => ({ name, errors })
            );
            form.setFields(formData);
            formData
              .filter((el) => ["detail", "non_field_errors"].includes(el.name))
              .forEach((el) => message.error(el.errors));
          } else {
            console.log(errors);
          }
        }
      });
    },
    [form, close, handleSubmit]
  );
  return (
    <Modal
      {...modalProps}
      visible={visible}
      onOk={onOk}
      onCancel={close}
      title={title}
      getContainer={false}
      afterClose={afterClose}
    >
      <AntForm formProps={formProps} _form={form}>
        {children}
      </AntForm>
    </Modal>
  );
};

const ModalForm = ({ buttonProps, ...props }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button
        htmlType="button"
        {...buttonProps}
        onClick={setVisible.bind(null, true)}
      />
      {ReactDOM.createPortal(
        <FormInModal
          {...props}
          visible={visible}
          close={setVisible.bind(null, false)}
        />,
        document.getElementById("root")
      )}
    </>
  );
};

export default ModalForm;
