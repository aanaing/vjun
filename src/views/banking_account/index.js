import React, { useState } from "react"
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { BANKING_ACCOUNTS, DELETE_BANKING_ACCOUNT } from '../../gql/banking_accounts'
import { 
    Box, Breadcrumbs, Button, TableContainer, Table, TableHead, Modal,
    TableBody, TableRow, TableCell, Alert, Typography
} from '@mui/material'
import CreateBankingAccount from '../../components/bankingAccounts/CreateBankingAccount'
import UpdateBankingAccount from "../../components/bankingAccounts/UpdateBankingAccount"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const styleD = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Index = () => {

  const [ showAlert, setShowAlert ] = useState({ message: '', isError: false })
  const [ open, setOpen ] = useState(false)
  const [ openE, setOpenE ] = useState(false)
  const [ openD, setOpenD ] = useState(false)
  const [ account, setAccount ] = useState(null)

  const result = useQuery(BANKING_ACCOUNTS)

  const [ deleteAccount ] = useMutation(DELETE_BANKING_ACCOUNT, {
    onError: (error) => {
      console.log('error : ', error)
    },
    onCompleted: () => {
      setShowAlert({ message: `Account have been removed.`, isError: false })
      setTimeout(() => {
        setShowAlert({ message: '', isError: false })
      }, 3000)
      handleCloseD()
    }
  })

  if(result.loading) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    )
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
      result.refetch()
      setOpen(false)
  };
  const handleOpenE = (row) => {
      setAccount(row)
      setOpenE(true)
  };
  const handleCloseE = () => {
      result.refetch()
      setOpenE(false)
  };
  const handleOpenD = (row) => {
    setAccount(row)
    setOpenD(true)
  };
  const handleCloseD = () => {
      result.refetch()
      setOpenD(false)
  };


  const bankingAlert = (message, isError = false) => {
    setShowAlert({ message: message, isError: isError})
    setTimeout(() => {
      setShowAlert({ message: '', isError: false })
    }, 3000)
  }

  const handleDelete = () => {
    if(!account) {
      return
    }
    deleteAccount({ variables: { id: account.id } })
  }

  const accounts = result.data.banking_accounts

  return (
    <div>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to='/' >
              Dashboard
            </Link>
            <span>
              Banking Accounts
            </span>
          </Breadcrumbs>
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }} >
          <Button onClick={handleOpen} variant="contained" sx={{ height: 50 }}>{open? 'Close' : 'Add One'}</Button>
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
          <TableContainer sx={{ maxHeight: '75vh' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: 70 }} >
                    Service Name
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Receiver Name
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Account Number
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  accounts.map((row, index) => (
                    <TableRow onClick={() => null} key={index} hover role="checkbox" tabIndex={-1} >
                        <TableCell>
                            {row.payment_service_name}
                        </TableCell>
                        <TableCell>
                            {row.receiver_name}
                        </TableCell>
                        <TableCell >
                            {row.account_number}
                        </TableCell>
                        <TableCell >
                            <Button onClick={() => handleOpenE(row)} color="primary" >Edit</Button>
                            <Button onClick={() => handleOpenD(row)} color="error" >Remove</Button>
                        </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
          <Modal
            keepMounted
            open={openD}
            onClose={handleCloseD}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
            >
            <Box sx={styleD}>
            <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                Confirmation
            </Typography>
            <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                Are you sure want to remove "{account?.receiver_name}'s account"?
            </Typography>
            <Box sx={{ textAlign: 'right', mt: 2 }}>
                <Button color='secondary' onClick={handleCloseD} >Cancel</Button>
                <Button onClick={handleDelete} >Confirm</Button>
            </Box>
            </Box>
          </Modal>
        </Box>
        <div style={{ minHeight: 'auto' }}>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <CreateBankingAccount handleClose={handleClose} bankingAlert={bankingAlert} />
              </Box>
            </Modal>
        </div>
        <div style={{ minHeight: 'auto' }}>
            <Modal
                open={openE}
                onClose={handleCloseE}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                  <UpdateBankingAccount bankingAlert={bankingAlert} handleClose={handleCloseE} account={account} />
                </Box>
            </Modal>
        </div>
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