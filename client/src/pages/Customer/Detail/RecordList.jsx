import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useCurrentProfile } from "../../../shared/hooks/currentUser";
import Button from "../../../shared/components/Button";
import Table from "../../../shared/components/Table";
import { formatDateTime } from "../../../shared/utils/dateTime";
import { useParams, Link } from "react-router-dom";
import { RecordStatusLabel, RecordStatusOrder } from "pages/Records/utils";
import moment from "moment";

const propTypes = {
  records: PropTypes.array.isRequired
};

const columns = [
  {
    Header: "#",
    accessor: "id",
    width: 50
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({
      cell: {
        row: { original }
      }
    }) => (
      <RecordStatusLabel status={original.status}>
        {original.status_display}
      </RecordStatusLabel>
    )
  },
  {
    Header: "Datetime",
    accessor: "datetime",
    Cell: ({ cell: { value } }) => {
      return `${formatDateTime(value, "DD.MM.YYYY HH:mm")}`;
    }
  },
  {
    Header: "",
    accessor: "id",
    Cell: ({ cell: { value } }) => (
      <Link to={`/records/${value}`}>
        <Button icon="link" variant="empty">
          Перейти
        </Button>
      </Link>
    ),
    className: "text-right"
  }
];

const RecordList = ({ records }) => {
  const profile = useCurrentProfile();
  const { customerId } = useParams();
  const recordList = useMemo(
    () =>
      records
        .filter(el => el.parlor.id === profile.parlor.id)
        .sort(
          (a, b) => {
            if (a.status === b.status) {
              return moment(a.datetime).diff(moment(b.datetime))
            }
            return RecordStatusOrder[a.status] - RecordStatusOrder[b.status]
          }
        ),
    [records, profile.parlor.id]
  );
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h3>
          Записи в этом салоне. Всего записей у этого клиента: {records.length}.
        </h3>
        <Link to={`/records/create/${customerId}`}>
          <Button variant="primary" icon="plus-square">
            Создать
          </Button>
        </Link>
      </div>
      <div>
        <Table columns={columns} data={recordList} />
      </div>
    </div>
  );
};

RecordList.propTypes = propTypes;

export default RecordList;
