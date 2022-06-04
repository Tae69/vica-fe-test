import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Button } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Book, User } from '../mocks/types';
import { getComparator, Order, stableSort } from '../utils/helper';
import LinkBehavior from './LinkBehavior';
import type { BookRow } from '../pages/Books';

type Data = Omit<Book, 'availability'>;

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'title',
    numeric: false,
    disablePadding: false,
    label: 'Name'
  },
  {
    id: 'author',
    numeric: false,
    disablePadding: false,
    label: 'Author'
  },
  {
    id: 'genre',
    numeric: false,
    disablePadding: false,
    label: 'Genre'
  },
  {
    id: 'yearPublished',
    numeric: false,
    disablePadding: false,
    label: 'Year Published'
  },
  {
    id: 'copies',
    numeric: false,
    disablePadding: false,
    label: 'Copies'
  }
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>Availability</TableCell>
        <TableCell>Last Borrower</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

type Props = {
  rows: BookRow[];
  user: User;
  canModify: boolean;
  onRemove: (id: number) => Promise<void>;
  onReturn: (book: Book) => Promise<void>;
  onBorrow: (book: Book) => Promise<void>;
};

export default function EnhancedTable({
  rows,
  user,
  onRemove,
  onBorrow,
  onReturn,
  canModify
}: Props) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('title');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const labelId = `enhanced-table-checkbox-${row.id}`;
                const isBorrowed = row.borrowers.some((b) => b.id === user.id);
                const remaining = row.copies - row.borrowers.length;

                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell component="th" id={labelId} scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell>{row.author}</TableCell>
                    <TableCell>{row.genre}</TableCell>
                    <TableCell>{row.yearPublished}</TableCell>
                    <TableCell>
                      {remaining} / {row.copies}
                    </TableCell>
                    <TableCell>{row.availability ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{row.borrowers[row.borrowers.length - 1]?.name || '-'}</TableCell>
                    <TableCell>
                      <Box>
                        {remaining > 0 && !isBorrowed && row.availability && (
                          <Button onClick={() => onBorrow(row)}>Borrow</Button>
                        )}
                        {isBorrowed && <Button onClick={() => onReturn(row)}>Return</Button>}
                      </Box>
                      {canModify && (
                        <>
                          <Button component={LinkBehavior} href={`/books/${row.id}/edit`}>
                            Edit
                          </Button>
                          <Button onClick={() => onRemove(row.id)} color="error">
                            Remove
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows
                }}
              >
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
