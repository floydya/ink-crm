import React from "react";
import { Alert, Form, message } from "antd";

const AntForm = ({ _form, handleSubmit, formProps, children }) => {
  const [form] = Form.useForm(_form);
  const onFinish = React.useCallback(
    async (values) => {
      try {
        await handleSubmit(values);
      } catch (errors) {
        if (errors?.data) {
          const formData = Object.entries(errors.data).map(
            ([name, errors]) => ({ name, errors })
          );
          form.setFields(formData);
          formData
            .filter((el) => ["detail", "non_field_errors"].includes(el.name))
            .forEach((el) => message.error(el.errors, 5));
        } else {
          console.log(errors);
        }
      }
    },
    [form, handleSubmit]
  );
  return (
    <Form {...formProps} form={form} onFinish={onFinish}>
      {!!form.getFieldError("detail").length && (
        <Alert
          style={{ marginBottom: "10px" }}
          message={form.getFieldError("detail")}
          type="error"
          showIcon
        />
      )}
      {!!form.getFieldError("non_field_errors").length && (
        <Alert
          style={{ marginBottom: "10px" }}
          message={form.getFieldError("non_field_errors")}
          type="error"
          showIcon
        />
      )}
      {children}
    </Form>
  );
};

export default AntForm;
