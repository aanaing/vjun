import React, { useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { 
  Box, Breadcrumbs, Button, TablePagination, TableContainer, Table, TableHead,
  TableBody, TableRow, TableCell, TextField, FormControl, Avatar
} from '@mui/material'
import { useLazyQuery } from '@apollo/client'
import { USERS } from '../../gql/users'

const Index = () => {

  const navigate = useNavigate()
  const [ count, setCount ] = useState(0)
  const [ page, setPage ] = useState(0)
  const [ rowsPerPage, setRowsPerPage ] = useState(10)
  const [ offset, setOffset ] = useState(0)
  const [ name, setName ] = useState('')
  const [ phone, setPhone ] = useState('')
  const [ users, setUsers ] = useState(null)

  const [ loadUsers, result ] = useLazyQuery(USERS)

  useEffect(() => {
      loadUsers({ variables: { limit: rowsPerPage, offset: offset, phone: `%${phone}%`, name: `%${name}%` } })
  }, [loadUsers, offset, rowsPerPage, phone, name])

  useEffect(() => {
    if(result.data) {
        setUsers(result.data.users)
        setCount(Number(result.data?.users_aggregate.aggregate.count))
    }
  }, [result])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(rowsPerPage * newPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0);
  };

  if(!users) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    )
  }

  return (
  <div>
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="/">
          Dashboard
        </Link>
        <span>
          Users
        </span>
      </Breadcrumbs>
    </div>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', my: 2 }} >
      <FormControl sx={{ width: 200 }} >
        <TextField id="search-by-name" label="Search By Name" type="search" 
          value={name}
          onChange={(e) => { setName(e.target.value) }}
        />
      </FormControl>
      <FormControl sx={{ width: 200 }} >
        <TextField id="search-by-phone" label="Search By Phone" type="search" 
          value={phone}
          onChange={(e) => { setPhone(e.target.value) }}
        />
      </FormControl>
      {/* <Stack direction="row" spacing={1} alignItems="center">
        <Typography>By Phone</Typography>
        <Switch checked={byName} onChange={(e) => setByName(e.target.checked)} />
        <Typography>By Name</Typography>
      </Stack> */}
    </Box>
    <Box
      sx={{
      display: 'flex',
      flexFlow: 'wrap row',
      '& > :not(style)': {
        m: 1,
        width: '100%',
        minHeight: '25vh',
      },
      }}
    >
    <TableContainer sx={{ maxHeight: '60vh' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell style={{ minWidth: 50 }}>
                ID
              </TableCell>
              <TableCell style={{ minWidth: 60 }}>
                Image
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Name
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Phone
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>
                Address
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Loyalty Points
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Member Tire
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Member Start Data
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Created At
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Updated At
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {
              users.map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index} >
                    <TableCell >
                        {row.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>
                        <Avatar
                        alt="User"
                        src={row.image_url}
                        sx={{ width: 56, height: 56 }}
                        >U</Avatar>
                    </TableCell>
                    <TableCell >
                        {row.name}
                    </TableCell>
                    <TableCell >
                        {row.phone}
                    </TableCell>
                    <TableCell >
                        {row.address}
                    </TableCell>
                    <TableCell >
                        {row.loyalty_points}
                    </TableCell>
                    <TableCell >
                        {row.member_tier}
                    </TableCell>
                    <TableCell >
                        {row.member_start_data?.substring(0, 10)}
                    </TableCell>
                    <TableCell >
                        {row.created_at.substring(0, 10)}
                    </TableCell>
                    <TableCell >
                        {row.updated_at.substring(0, 10)}
                    </TableCell>
                    <TableCell >
                      {/* <Button size="small" color={ row.disabled? 'success' : 'error' } >{ row.disabled ? 'Enable' : 'Disable' }</Button> */}
                      <Button size="small" color="secondary" onClick={() => navigate(`/user/${row.id}`)} >Detail</Button>
                    </TableCell>
                </TableRow>
              ))
          }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[ 10, 25, 100]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  </div>
  )
}

export default Index