import React from 'react';
import { Title, TitleSizes } from '@patternfly/react-core';
import { TableComposable, TableText, Thead, Tbody, Tr, Th, Td, ExpandableRowContent } from '@patternfly/react-table';
import Basic from './DemoCard';

export default function PlatformTable(props) {


  const [activeChild, setActiveChild] = React.useState([1, null]);
  const columns = props.columns;
  const numColumns = columns.length;
  const rows = props.data;
  const rowPairs = rows.map(k => ({ "parent": k, "child": ["placeholder"] }));
  const Colors = {
    'success': '#00800052',
    'warning': '#ffff00a1',
    'failed': '#ff000070',
    'upstream_failed': '#ffff00a1',
    'failure': '#ff000070',
    'running': '#add8e6',
    'N/A': '#00000000'
  }

  

  let rowIndex = -1;

  const [orderedRows, setRows] = React.useState(rowPairs);
  // index of the currently active column
  const [activeSortIndex, setActiveSortIndex] = React.useState(-1);
  // sort direction of the currently active column
  const [activeSortDirection, setActiveSortDirection] = React.useState('none');
  const onSort = (event, index, direction) => {
    setActiveSortIndex(index);
    setActiveSortDirection(direction);
    // sorts the rows
    const updatedRows = orderedRows.sort((a, b) => {
      a = a.parent
      b = b.parent
      if (typeof a[index] === 'number') {
        // numeric sort
        if (direction === 'asc') {
          return a[index] - b[index];
        }
        return b[index] - a[index];
      } else if (new Date(a[index]).toString !== "Invalid Date") {
        if (direction === 'asc') {
          return new Date(a[index]) - new Date(b[index])
        }
        return new Date(b[index]) - new Date(a[index])
      } else {
        // string sort
        if (direction === 'asc') {
          return a[index].localeCompare(b[index]);
        }
        return b[index].localeCompare(a[index]);
      }
    });
    setRows(updatedRows);
  };

  const [expanded, setExpanded] = React.useState(
    Object.fromEntries(Object.entries(orderedRows).map(([k, v]) => [k, false]))
  );

  const handleExpansionToggle = (event, pairIndex) => {
    setExpanded({
      ...expanded,
      [pairIndex]: !expanded[pairIndex]
    });
  };

  return (
    <>
      {getTitle(props)}
      <TableComposable
        aria-label="Simple table"
        variant='default'
        borders='compactBorderless'
      >
        <Thead>
          <Tr><Th />
            {columns.map((column, columnIndex) => {
              const sortParams = column === "Start Date" ? {
                sort: {
                  sortBy: {
                    index: activeSortIndex,
                    direction: activeSortDirection
                  },
                  onSort,
                  columnIndex
                }
              } : {};
              return (
                <Th
                  key={columnIndex} {...sortParams}>
                  {column}
                </Th>
              )
            })}
          </Tr>
        </Thead>
        {orderedRows.map((pair, pairIndex) => {
          rowIndex += 1;
          const parentRow = (
            <Tr key={rowIndex}>
              <Td
                key={`${rowIndex}_0`}
                expand= {{
                      rowIndex: pairIndex,
                      isExpanded: expanded[pairIndex],
                      onToggle: handleExpansionToggle
                    }}
              />
              {pair.parent.map((cell, cellIndex) => (
                <Td
                  key={`${rowIndex}_${cellIndex}`}
                  dataLabel={columns[cellIndex]}
                  component={cellIndex === 0 ? 'th' : 'td'}
                  style={{
                    backgroundColor: Colors[cell],
                    border: "1 px solid black"
                  }}
                >
                  <TableText>
                    {cell}
                  </TableText>
                </Td>
              ))}
            </Tr>
          );

      
          rowIndex += 1;
        
          const childRow = (
            <Tr key={rowIndex} isExpanded={expanded[pairIndex] === true}>
              <Td dataLabel={columns[0]} noPadding colSpan={6}>
                <ExpandableRowContent>
                  <Basic data={[pair.parent, expanded[pairIndex]]}
                  />
                </ExpandableRowContent>
              </Td>
            </Tr>
          );
          return (
            <Tbody key={pairIndex} isExpanded={expanded[pairIndex] === true}>
              {parentRow}
              {childRow}
            </Tbody>
          );



        })}
      </TableComposable>
    </>
  );
};


const getTitle = (props) => (<><Title headingLevel="h1" size={TitleSizes['xl']} id={props.version}>
    {props.version}
  </Title></>);


