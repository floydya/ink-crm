import React, { useContext } from "react";
import { months, years } from "shared/constants/dates";
import moment from "moment";
import useApi from "shared/hooks/api";
import pubsub from "sweet-pubsub";
import { Col, Form, Input, message, Row, Select } from "antd";
import ProfileContext from "pages/Profile/context";
import ModalForm from "components/ModalForm";
import { PlusSquareOutlined } from "@ant-design/icons";

const FineCreateForm = () => {
  const { profile } = useContext(ProfileContext);
  const [{ data }] = useApi.get(`/types/fines/`, {}, { mountFetch: true });
  const [{ isCreating }, createFine] = useApi.post(`/fines/`);

  return (
    <ModalForm
      title="Создание штрафа"
      modalProps={{
        okText: "Создать",
        cancelText: "Отменить",
        okButtonProps: { loading: isCreating },
      }}
      formProps={{ layout: "vertical" }}
      buttonProps={{
        children: "Добавить штраф",
        icon: <PlusSquareOutlined />,
        type: "primary",
        style: { width: "100%" },
      }}
      handleSubmit={async (values) => {
        await createFine({ ...values, employee: profile.id });
        pubsub.emit("fetch-unpayed-payments");
        message.success("Штраф успешно создана.");
      }}
    >
      <Row>
        <Col md={11}>
          <Form.Item
            label="Месяц"
            name="month"
            initialValue={moment().month() + 1}
          >
            <Select>
              {months.map((t) => (
                <Select.Option key={t.value} value={t.value}>{t.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={{ span: 11, offset: 2 }}>
          <Form.Item label="Год" name="year" initialValue={moment().year()}>
            <Select>
              {years.map((t) => (
                <Select.Option key={t.value} value={t.value}>{t.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Тип штрафа" name="type">
        <Select>
          {(data || []).map((t) => (
            <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Сумма" name="amount">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="Заметка" name="note">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Доказательство" name="href">
        <Input type="url" />
      </Form.Item>
    </ModalForm>
  );
};

export default FineCreateForm;
