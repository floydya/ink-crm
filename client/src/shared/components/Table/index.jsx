import React from "react";
import PropTypes from "prop-types";
import { useFlexLayout, useTable } from "react-table";
import { TableContainer } from "./Styles";
import { v4 as uuid4 } from "uuid";

const propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired
};

const Table = ({ columns, data }) => {
  const defaultColumn = React.useMemo(() => ({ width: 150 }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      defaultColumn
    },
    useFlexLayout
  );

  return (
    <TableContainer>
      <div {...getTableProps()} className="table table-responsive">
        <div className="thead">
          {headerGroups.map(headerGroup => (
            <div
              {...headerGroup.getHeaderGroupProps()}
              className="tr"
              key={uuid4()}
            >
              {headerGroup.headers.map(column => (
                <div
                  {...column.getHeaderProps()}
                  className={["th", column.className].join(" ")}
                  key={uuid4()}
                >
                  {column.render("Header")}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()} className="tbody">
          {rows.map(row => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="tr" key={uuid4()}>
                {row.cells.map(cell => (
                  <div
                    {...cell.getCellProps()}
                    className={["td", cell.column.className].join(" ")}
                    key={uuid4()}
                  >
                    {cell.render("Cell")}
                  </div>
                ))}
              </div>
            );
          })}
          {/*<FixedSizeList*/}
          {/*  height={rows.length * 50 > 400 ? 400 : rows.length * 50}*/}
          {/*  itemCount={rows.length}*/}
          {/*  itemSize={50}*/}
          {/*  width={totalColumnsWidth}*/}
          {/*>*/}
          {/*  {RenderRow}*/}
          {/*</FixedSizeList>*/}
        </div>
      </div>
    </TableContainer>
  );
};

Table.propTypes = propTypes;

export default Table;
