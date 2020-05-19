import React, { useMemo, useContext } from "react";
import MotivationForm from "../MotivationForm";
import useApi from "shared/hooks/api";
import ProfileContext from "pages/Profile/context";
import { Table } from "antd";

const EducationMotivation = () => {
  const { profile } = useContext(ProfileContext);
  const { education_motivations } = profile;
  const [{ data: types }] = useApi.get(
    `/types/sessions/`,
    {},
    { mountFetch: true }
  );
  const typeOptions = useMemo(
    () =>
      (types || [])
        .map((el) => ({ value: el.id, label: el.name }))
        .filter(
          (el) =>
            !education_motivations.find(
              (mot) => mot.session_type?.id === el.value
            )
        ),
    [education_motivations, types]
  );
  return (
    <Table
      tableLayout="fixed"
      columns={[
        {
          title: "Категория",
          key: "session_type",
          dataIndex: "session_type",
          render: (v) => v.name,
        },
        {
          title: "Базовый процент",
          key: "base_percent",
          dataIndex: "base_percent",
        },
        {
          title: "Процент за приглашение",
          key: "invite_percent",
          dataIndex: "invite_percent",
        },
        {
          title: "Действия",
          key: "x",
          render: (_, record) => (
            <MotivationForm
              href="educations"
              types={typeOptions}
              motivation={record}
            />
          ),
        },
      ]}
      dataSource={education_motivations}
      pagination={false}
      rowKey="id"
      title={() => <h2>Обучения</h2>}
      footer={() => <MotivationForm href="educations" types={typeOptions} />}
    />
  );
};

export default EducationMotivation;
