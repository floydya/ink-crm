import React, { useContext, useState } from "react";
import { Table, Select, Form, Descriptions } from "antd";
import useApi from "shared/hooks/api";
import ProfileContext from "../context";
import { months, years } from "shared/constants/dates";
import { formatDateTime } from "shared/utils/dateTime";

const useFilters = () => {
  const [type, setType] = useState(undefined);
  const [month, setMonth] = useState(undefined);
  const [year, setYear] = useState(undefined);
  const [status, setStatus] = useState(undefined);
  const [{ isLoading, data }] = useApi.get(
    `/types/bounties/`,
    {},
    { mountFetch: true }
  );
  return [
    type,
    month,
    year,
    status,
    <Form
      layout="vertical"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "25px",
      }}
    >
      <Form.Item>
        <Select
          allowClear
          loading={isLoading}
          onChange={setType}
          value={type}
          placeholder="Тип премии"
        >
          {(data || []).map((el) => (
            <Select.Option value={el.id}>{el.name}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Select allowClear onChange={setMonth} value={month} placeholder="Месяц">
          {months.map((el) => (
            <Select.Option value={el.value}>{el.label}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Select allowClear onChange={setYear} value={year} placeholder="Год">
          {years.map((el) => (
            <Select.Option value={el.value}>{el.label}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Select allowClear onChange={setStatus} value={status} placeholder="Статус">
          <Select.Option value={"null"}>Ожидание</Select.Option>
          <Select.Option value={"True"}>Выплачена</Select.Option>
          <Select.Option value={"False"}>Отменена</Select.Option>
        </Select>
      </Form.Item>
    </Form>,
  ];
};

const Bounties = () => {
  const { profile } = useContext(ProfileContext);
  const [type, month, year, status, renderFilter] = useFilters();
  const [{ isLoading, data }] = useApi.get(
    `/bounties/`,
    {
      employee_id: profile.id,
      month,
      year,
      type,
      status,
    },
    { mountFetch: true }
  );
  return (
    <Table
      loading={isLoading}
      title={() => <>{renderFilter}</>}
      columns={[
        { title: "ID", dataIndex: "id", key: "id" },
        {
          title: "Категория",
          dataIndex: "type",
          key: "type",
          render: (v) => v.name,
        },
        { title: "Сумма", dataIndex: "amount", key: "amount" },
      ]}
      rowKey="id"
      dataSource={data}
      expandable={{
        expandedRowRender: (record) => (
          <Descriptions column={1}>
            <Descriptions.Item label="Комментарий">
              {record.note}
            </Descriptions.Item>
            <Descriptions.Item label="Кем создана">
              {record.created_by?.full_name}
            </Descriptions.Item>
            <Descriptions.Item label="Когда создана">
              {formatDateTime(record.created_at, "dddd, DD.MM.YYYY HH:mm")}
            </Descriptions.Item>
            {record.href && (
              <Descriptions.Item label="Доказательство">
                <a href={record.href} target="_blank" rel="noopener noreferrer">
                  Открыть в новой вкладке
                </a>
              </Descriptions.Item>
            )}
          </Descriptions>
        ),
      }}
    />
  );
};

export default Bounties;
