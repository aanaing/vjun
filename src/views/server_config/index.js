import React, { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { SERVER_CONFIG, UPDATE_SERVER_CONFIG } from '../../gql/server_config'
import { 
  Box, Breadcrumbs, TableContainer, Table, TableHead, TextField,
  TableBody, TableRow, TableCell, Alert
} from '@mui/material'

let timeId  = null

const Index = () => {

  const [ showAlert, setShowAlert ] = useState({ message: '', isError: false })
  const [ values, setValues ] = useState({})
  const [ errorValues, setErrorValues ] = useState({})

  const result = useQuery(SERVER_CONFIG)

  const [ updateValue ] = useMutation(UPDATE_SERVER_CONFIG, {
    onError: (error) => {
      console.log('error : ', error)
    },
    onCompleted: () => {
      setShowAlert({ message: 'Config\'s vlaue have been updated.', isError: false })
      setTimeout(() => {
        setShowAlert({ message: '', isError: false })
      }, 3000)
    },
    refetchQueries: [SERVER_CONFIG]
  })

  useEffect(() => {
    if(!result.loading || result.data) {
        let config = result.data.server_config
        let temp_values = {}
        let temp_errors = {}
        config.map((c) => {
            temp_values[c.id] = c.config_value
            temp_errors[c.id] = ''
            return null
        })
        setErrorValues(temp_errors)
        setValues(temp_values)
    } 
  }, [result.data, result.loading])

  if(result.loading) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    )
  }

  const config = result.data.server_config

  const handleUpdate = (e, id) => {
    setErrorValues({ ...errorValues, [id]: '' })
    if(timeId) {
      clearTimeout(timeId)
    }
    setValues({ ...values, [id]: e.target.value })
    let v = e.target.value
    if(!v) {
      setErrorValues({ ...errorValues, [id]: 'Config\'s value is required.'})
      return
    }
    timeId = setTimeout(() => {
      updateValue({ variables: { id: id, value: v } })
    }, 2500)
  }

  return (
    <div>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to='/' >
              Dashboard
            </Link>
            <span>
              Server Config
            </span>
          </Breadcrumbs>
        </div>
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
          <TableContainer sx={{ maxHeight: '75vh' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: 70 }} >
                    Name
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Value
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Updated At
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  config.map((row, index) => (
                    <TableRow onClick={() => null} key={index} hover role="checkbox" tabIndex={-1} >
                        <TableCell>
                            {row.config_name}
                        </TableCell>
                        <TableCell >
                            {
                                (values[row.id] !== undefined ) && (
                                <TextField id="value" label="Change Config's value"
                                    value={values[row.id]}
                                    onChange={(e) => handleUpdate(e, row.id)}
                                    error={errorValues[row.id]? true: false}
                                    helperText={errorValues[row.id]}
                                />
                                )
                            }
                        </TableCell>
                        <TableCell >
                            {row.updated_at.substring(0, 10)}
                        </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      {
        (showAlert.message && !showAlert.isError) && <Alert sx={{ position: 'fixed', bottom: '1em', right: '1em' }} severity="success">{showAlert.message}</Alert>
      }
      {
        (showAlert.message && showAlert.isError) && <Alert sx={{ position: 'fixed', bottom: '1em', right: '1em' }} severity="warning">{showAlert.message}</Alert>
      }
    </div>
  )
}

export default Index