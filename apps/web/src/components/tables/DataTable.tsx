'use client';

import { useState } from "react";
import { Table, Box, Text, Flex, Thead, Tbody, Tr, Th, Td, chakra, Button, Stack, position } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel
} from "@tanstack/react-table";

interface DataTableProps<Data extends object> {
  data: Data[];
  columns: ColumnDef<Data, any>[];
  handleDelete?: (data: Data) => void;
  handleEdit?: (data: Data) => void;
  handleDisplay?: (data: Data) => void;
  isDisabledEdit?: (data: Data) => boolean;
  isDisabledDelete?: (data: Data) => boolean;
  isDisabledShow?: (data: Data) => boolean;
};

function DataTable<Data extends object>({
  data,
  columns,
  handleEdit,
  handleDelete,
  handleDisplay,
  isDisabledEdit,
  isDisabledDelete,
  isDisabledShow,
}: DataTableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    }
  });

  return (
    <Table variant={'simple'}>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              const meta: any = header.column.columnDef.meta;
              return (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  isNumeric={meta?.isNumeric}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  <chakra.span pl="4">
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "desc" ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              );
            })}
            {handleEdit && handleDelete &&
              <Th>
                <Flex w={'100%'} direction={'row'}>
                  <Text ml={'auto'}>Action</Text>
                </Flex>
              </Th>
            }
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              const meta: any = cell.column.columnDef.meta;
              return (
                <Td verticalAlign={'top'} key={cell.id} isNumeric={meta?.isNumeric}>
                  <Box 
                    maxH={'16vh'} 
                    textOverflow={'ellipsis'}
                    overflow={'hidden'}
                    display={'-webkit-box'}
                    style={{
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Box>
                </Td>
              );
            })}
            {
              (handleEdit || handleDelete || handleDisplay) &&
              <Td verticalAlign={'top'}>
                <Stack direction={"row"} ml={'auto'} minWidth={'fit-content'} w={'100%'}>
                  <Stack direction={"row"} ml={'auto'}>
                    {
                      handleDisplay &&
                      <Button isDisabled={isDisabledShow && isDisabledShow(row.original)} colorScheme="white" onClick={() => handleDisplay(row.original)}>Show</Button>
                    }
                    { 
                      handleEdit &&
                      <Button isDisabled={isDisabledEdit && isDisabledEdit(row.original)} onClick={() => handleEdit(row.original)}>Edit</Button>
                    }
                    {
                      handleDelete &&
                      <Button isDisabled={isDisabledDelete && isDisabledDelete(row.original)} colorScheme="red" onClick={() => handleDelete(row.original)}>Delete</Button>
                    }
                  </Stack>
                </Stack>
              </Td>}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default DataTable;