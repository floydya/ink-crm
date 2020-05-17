import React, { useMemo, useContext } from "react";
import MotivationForm from "../MotivationForm";
import useApi from "shared/hooks/api";
import ProfileContext from "pages/Profile/context";
import { Table } from "antd";

const SellMotivation = () => {
  const { profile } = useContext(ProfileContext);
  const { sell_motivations } = profile;
  const [{ data: types }] = useApi.get(
    `/store/categories/`,
    {},
    { mountFetch: true }
  );
  const typeOptions = useMemo(
    () =>
      (types || [])
        .map((el) => ({ value: el.id, label: el.name }))
        .filter(
          (el) =>
            !sell_motivations.find((mot) => mot.session_type?.id === el.value)
        ),
    [sell_motivations, types]
  );
  return (
    <Table
      columns={[
        {
          title: "Категория",
          key: "sell_category",
          dataIndex: "sell_category",
          render: (v) => v.name,
        },
        {
          title: "Базовый процент",
          key: "base_percent",
          dataIndex: "base_percent",
        },
        {
          title: "Действия",
          key: "x",
          render: (_, record) => (
            <MotivationForm
              href="sells"
              types={typeOptions}
              motivation={record}
            />
          ),
        },
      ]}
      dataSource={sell_motivations}
      pagination={false}
      title={() => <h2>Продажи</h2>}
      footer={() => <MotivationForm href="sells" types={typeOptions} />}
    />
  );
};

export default SellMotivation;
