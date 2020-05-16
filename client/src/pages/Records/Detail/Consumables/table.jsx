import React, { useMemo } from "react";

import { useParams } from "react-router-dom";
import {
  PageError,
  Table,
  Icon,
  Modal,
  Form,
  ConfirmModal,
  Button
} from "shared/components";
import useApi from "shared/hooks/api";
import { useModalStateHelper } from "pages/Home/components/shared";
import {
  FormElement,
  Actions,
  ActionButton
} from "pages/Authentication/Styles";
import pubsub from "sweet-pubsub";
import { useCallback } from "react";
import NoResults from "shared/components/NoResults";
import { PageLoading } from "@ant-design/pro-layout"

const NewConsumableForm = ({ modalClose }) => {
  const { recordId } = useParams();
  const [{ data }] = useApi.get(`/store/items/`, {}, { mountFetch: true });
  const [{ isCreating }, createConsumable] = useApi.post(`/store/consumables/`);
  const itemList = useMemo(
    () => (data || []).map(el => ({ label: el.name, value: el.id })),
    [data]
  );
  return (
    <Form
      validations={{
        item: Form.is.required(),
        value: Form.is.required()
      }}
      initialValues={{
        item: "",
        value: ""
      }}
      onSubmit={async (values, form) => {
        try {
          await createConsumable({
            ...values,
            record: recordId
          });
          await pubsub.emit("fetch-record");
          await modalClose();
        } catch (error) {
          Form.handleAPIError(error, form);
        }
      }}
    >
      <FormElement>
        <Form.Field.Select name="item" label="Товар" options={itemList} />
        <Form.Field.Input name="value" label="Количество" />
        <Actions>
          <ActionButton variant="primary" isWorking={isCreating} type="submit">
            Добавить
          </ActionButton>
          <ActionButton
            variant="secondary"
            disabled={isCreating}
            type="button"
            onClick={modalClose}
          >
            Отменить
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  );
};

const EditForm = ({ consumable, modalClose }) => {
  const [{ isUpdating }, editConsumable] = useApi.patch(
    `/store/consumables/${consumable.id}/`
  );

  return (
    <Form
      validations={{
        value: Form.is.required()
      }}
      initialValues={{
        value: consumable.value
      }}
      onSubmit={async (values, form) => {
        try {
          await editConsumable(values);
          await pubsub.emit("fetch-record");
          await modalClose();
        } catch (error) {
          Form.handleAPIError(error, form);
        }
      }}
    >
      <FormElement>
        <Form.Field.Input name="value" label="Количество" />
        <Actions>
          <ActionButton variant="primary" type="submit" isWorking={isUpdating}>
            Изменить
          </ActionButton>
          <ActionButton variant="secondary" type="button" disabled={isUpdating} onClick={modalClose}>
            Отменить
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  );
};

const ConsumableActions = ({ consumable }) => {
  const editModalHelper = useModalStateHelper();
  const [, deleteConsumable] = useApi.delete(
    `/store/consumables/${consumable.id}/`
  );

  const handleDelete = useCallback(
    async ({ close }) => {
      await deleteConsumable();
      await pubsub.emit("fetch-record");
      await close();
    },
    [deleteConsumable]
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "10px"
      }}
    >
      <Icon
        size={20}
        type="edit"
        style={{ color: "cornflowerblue", cursor: "pointer" }}
        onClick={editModalHelper.open}
      />
      <ConfirmModal
        renderLink={({ open }) => (
          <Icon
            size={20}
            type="trash"
            onClick={open}
            style={{ color: "red", cursor: "pointer" }}
          />
        )}
        onConfirm={handleDelete}
      />
      {editModalHelper.isOpen() && (
        <Modal
          isOpen
          width={400}
          onClose={editModalHelper.close}
          renderContent={({ close }) => (
            <EditForm consumable={consumable} modalClose={close} />
          )}
        />
      )}
    </div>
  );
};

const columns = [
  {
    Header: "#",
    accessor: "id",
    className: "text-center",
    width: 50
  },
  {
    Header: "Категория",
    accessor: "item.category.name"
  },
  {
    Header: "Товар",
    accessor: "item.name"
  },
  {
    Header: "Количество",
    accessor: "value",
    className: "text-right",
    width: 50
  },
  {
    Header: "Ед. изм.",
    accessor: "item.units",
    className: "text-left",
    width: 50
  },
  {
    Header: "",
    accessor: "id",
    Cell: ({ cell }) => <ConsumableActions consumable={cell.row.original} />,
    className: "text-right",
    width: 50
  }
];

const ConsumableTable = () => {
  const addConsumableModalHelper = useModalStateHelper();
  const { recordId } = useParams();
  const [{ isLoading, data, error }] = useApi.get(
    `/store/consumables/`,
    { record: recordId },
    { mountFetch: true }
  );

  if (isLoading) return <PageLoading tip={"Загрузка..."} />
  if (error) return <PageError />;
  return (
    <div style={{ backgroundColor: "white", padding: "15px" }}>
      <Table columns={columns} data={data} />
      {!data.length && <NoResults title="Нет добавленных расходников!" />}
      <div className="text-center">
        <Button
          variant="secondary"
          icon="plus-square"
          onClick={addConsumableModalHelper.open}
        >
          Добавить расходник
        </Button>
      </div>
      {addConsumableModalHelper.isOpen() && (
        <Modal
          isOpen
          width={600}
          onClose={addConsumableModalHelper.close}
          renderContent={({ close }) => (
            <NewConsumableForm modalClose={close} />
          )}
        />
      )}
    </div>
  );
};

export default ConsumableTable;
