import React, { useMemo, useContext } from "react";
import useApi from "shared/hooks/api";
import pubsub from "sweet-pubsub";
import { Form, message, Select, Input } from "antd";
import ModalForm from "components/ModalForm";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import ProfileContext from "../context";

const typeName = (href) => {
  switch (href) {
    case "sessions":
      return "session_type";
    case "educations":
      return "session_type";
    case "sells":
      return "sell_category";
    default:
      throw new Error("Undefined type");
  }
};

const MotivationForm = ({ types, href, motivation = null }) => {
  const { profile } = useContext(ProfileContext);
  const [{ isUpdating }, updateMotivation] = useApi.patch(
    `/motivation/${href}/${motivation?.id}/`
  );
  const [{ isCreating }, createMotivation] = useApi.post(
    `/motivation/${href}/`
  );
  const [loading, handleMotivation] = useMemo(
    () =>
      motivation?.id
        ? [isUpdating, updateMotivation]
        : [isCreating, createMotivation],
    [motivation, isUpdating, isCreating, updateMotivation, createMotivation]
  );
  const typeOptions = useMemo(
    () =>
      motivation?.id
        ? [
            {
              label: motivation[typeName(href)]?.name,
              value: motivation[typeName(href)]?.id,
            },
          ]
        : types,
    [types, motivation, href]
  );
  return (
    <ModalForm
      title={`${motivation?.id ? "Изменение" : "Создание"} мотивации`}
      modalProps={{
        okText: motivation?.id ? "Изменить" : "Создать",
        cancelText: "Отменить",
        okButtonProps: { loading },
      }}
      formProps={{ layout: "vertical" }}
      buttonProps={{
        children: motivation?.id ? "Изменить" : "Создать",
        icon: motivation?.id ? <EditOutlined /> : <PlusOutlined />,
        type: motivation?.id ? "dashed" : "primary",
        style: motivation?.id ? {} : { width: "100%" },
      }}
      handleSubmit={async (values) => {
        await handleMotivation({
          ...values,
          ...(motivation?.id ? {} : { employee: profile.id }),
        });
        message.success(
          `Мотивация успешно ${motivation?.id ? "изменена" : "добавлена"}`
        );
        pubsub.emit("fetch-profile");
      }}
    >
      <Form.Item
        label="Тип мотивации"
        name={typeName(href)}
        disabled={motivation?.id}
        initialValue={motivation && motivation[typeName(href)]?.id}
      >
        <Select>
          {typeOptions.map((t) => (
            <Select.Option value={t.value} children={t.label} />
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Базовый процент"
        name="base_percent"
        initialValue={motivation?.base_percent}
      >
        <Input type="number" min={0} max={100} />
      </Form.Item>
      {href !== "sells" && (
        <Form.Item
          label="Процент за приглашение"
          name="invite_percent"
          initialValue={motivation?.invite_percent}
        >
          <Input type="number" min={0} max={100} />
        </Form.Item>
      )}
    </ModalForm>
  );
};

export default MotivationForm;
