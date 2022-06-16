import React, { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { 
  Box, Breadcrumbs, TablePagination, TableContainer, Table, TableHead, Tooltip, Button, Typography,
  TableBody, TableRow, TableCell, TextField, FormControl, IconButton, FormHelperText
} from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useLazyQuery } from '@apollo/client'
import { CLAIM_HISTORIES, CLAIM_HISTORIESWITHDATE } from '../../gql/claimed'

import { CSVLink } from 'react-csv'

const headers = [
  { label: 'ID', key: 'id' },
  { label: 'Status', key: 'status' },
  { label: 'Point used', key: 'point_used' },
  { label: 'Claimer', key: 'claimer' },
  { label: 'Loyalty Product', key: 'loyalty_product' },
  { label: 'Created At', key: 'created_at' },
]

let data = []

const Index = () => {

  const [ count, setCount ] = useState(0)
  const [ page, setPage ] = useState(0)
  const [ rowsPerPage, setRowsPerPage ] = useState(10)
  const [ offset, setOffset ] = useState(0)
  const [ histories, setHistories ] = useState(null)
  const [ search, setSearch ] = useState('')
  const [ sortingCreatedAt, setSortingCreatedAt ] = useState('asc')

  const [ showExport, setShowExport ] = useState(false)

  const [ startDate, setStartDate] = useState(null)
  const [ dateError, setDateError ] = useState('')
  const [ endDate, setEndDate ] = useState(new Date())

  const [ loadHistories, result ] = useLazyQuery(CLAIM_HISTORIES)
  const [ loadHistoriesWithDate, resultWithDate ] = useLazyQuery(CLAIM_HISTORIESWITHDATE)

  useEffect(() => {
    if(startDate && endDate) {
        if((startDate && endDate) && startDate > endDate) {
          setDateError('Date From must be smaller than Date To!')
          return
        }
        loadHistoriesWithDate({ variables: { limit: rowsPerPage, offset: offset, search: `%${search}%`, sorting_created_at: sortingCreatedAt, start: startDate, end: endDate }})
    } else {
        loadHistories({ variables: { limit: rowsPerPage, offset: offset, search: `%${search}%`, sorting_created_at: sortingCreatedAt }})
    }
  }, [endDate, loadHistories, loadHistoriesWithDate, offset, rowsPerPage, search, sortingCreatedAt, startDate])

  useEffect(() => {
    if(result.data) {
      setHistories(result.data.claim_history)
      setCount(Number(result.data?.claim_history_aggregate.aggregate.count))
    }
  }, [result])

  useEffect(() => {
    if(resultWithDate.data) {
      setHistories(resultWithDate.data.claim_history)
      setCount(Number(resultWithDate.data?.claim_history_aggregate.aggregate.count))
      let tempData = resultWithDate.data.claim_history
        let temp = tempData?.map(d => {
          return { 
            id: d.id, status: d.claim_status? 'true' : 'false',
            point_used: d.loyalty_points_used, claimer: d.user.name,
            loyalty_product: d.loyalty_product.name,
            created_at: d.created_at.substring(0, 10),
          }
        })
        data = temp
        setShowExport(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultWithDate])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(rowsPerPage * newPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0);
  };

  if(!histories) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    )
  }

  const alterSorting = (property, sort) => {
    switch (property) {
      case 'created_at':
        setSortingCreatedAt((sortingCreatedAt==='asc' || sortingCreatedAt === null) ? 'desc': 'asc')
        break;
      default:
        break;
    }
  }

  return (
  <div>
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="/">
          Dashboard
        </Link>
        <span>
          Claimed Histories
        </span>
      </Breadcrumbs>
    </div>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', my: 2 }} >
      <FormControl sx={{ width: 300 }} >
        <TextField id="outlined-search" label="Search by Claimer's Name" type="search" 
          value={search}
          onChange={(e) => { setSearch(e.target.value) }}
        />
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <FormControl sx={{ mr: 2 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DesktopDatePicker
                    label="Date From"
                    value={startDate}
                    onChange={(newValue) => {
                    setDateError('')
                    setStartDate(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
                {
                dateError && <FormHelperText error >{dateError}</FormHelperText>
                }
            </LocalizationProvider>
        </FormControl>
        <FormControl>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DesktopDatePicker
                    label="Date To"
                    value={endDate}
                    onChange={(newValue) => {
                    setDateError('')
                    setEndDate(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
                {
                dateError && <FormHelperText error >{dateError}</FormHelperText>
                }
            </LocalizationProvider>
        </FormControl>
      </Box>
    </Box>
    <Typography>* When you select Date filter fields, you can export data as a <em>CVS file</em> by clicking <em>EXPORT button</em> at the bottom on table.</Typography>
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
              <TableCell style={{ minWidth: 100 }}>
                ID
              </TableCell>
              <TableCell style={{ minWidth: 60 }}>
                Status
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Point Used
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Claimer
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Loyalty Product
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Created At
                <IconButton onClick={() => alterSorting('created_at')} color={ !sortingCreatedAt? 'default': 'primary' } sx={{ ml: 1 }} size="small" component="span">
                  {
                    (sortingCreatedAt === 'asc') ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                  }
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {histories?.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell >
                      {row.id}
                    </TableCell>
                    <TableCell >
                      {row.claim_status ? 'true' : 'false'}
                    </TableCell>
                    <TableCell >
                      {row.loyalty_points_used}
                    </TableCell>
                    <TableCell >
                      <Link to={`/user/${row?.user.id}`} >{row?.user.name}</Link>
                    </TableCell>
                    <TableCell >
                      <Link to={`/loualty_product/${row?.loyalty_product.id}`} >{row?.loyalty_product.name}</Link>
                    </TableCell>
                    <TableCell >
                      {row.created_at.substring(0, 10)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    <TablePagination
        rowsPerPageOptions={[ 10, 25, 100]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
    />
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      {
        showExport &&  
        <Tooltip title="Download CSV file which contains all data show in the table" placement='left' arrow>
          <Button>
            <CSVLink className='exportBtn' data={data} headers={headers} filename={`claimed-histories-${new Date().toISOString()}.csv`} >
              Export
            </CSVLink>
          </Button>
        </Tooltip>
      }
    </Box>
  </div>
  )
}

export default Index