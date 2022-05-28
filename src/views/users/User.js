import React, { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { USER, UPDATE_USER, UPDATE_MEMBER_TIRE, UPDATE_POINT } from '../../gql/users'

import { Breadcrumbs, Typography, Box, Paper, Card, CardHeader, CardContent, CardMedia, ListItem, ListItemText,
  CardActions, Button, Alert, FormControl, MenuItem, InputLabel, Select, TextField
} from '@mui/material'
import AddressTable from '../../components/users/AddressTable'

let timeId  = null

const User = () => {

    const { id } = useParams()

    const result = useQuery(USER, { variables: {id: id} })

    const [ tier, setTier ] = useState('')
    const [ point, setPoint ] = useState('')
    const [ errorPoint, setErrorPoint ] = useState('')
    const [ showAlert, setShowAlert ] = useState({ message: '', isError: false });

    const [ editUser ] = useMutation(UPDATE_USER, {
      onError: (error) => {
        console.log('error : ', error)
        setShowAlert({ message: 'Error on server', isError: true })
        setTimeout(() => {
          setShowAlert({ message: '', isError: false })
        }, 3000)
      },
      onCompleted: () => {
        setShowAlert({ message: 'User have been updated.', isError: false })
        setTimeout(() => {
          setShowAlert({ message: '', isError: false })
        }, 3000)
      },
      refetchQueries: [User]
    })

    const [ editMemberTire ] = useMutation(UPDATE_MEMBER_TIRE, {
      onError: (error) => {
        console.log('error : ', error)
        setShowAlert({ message: 'Error on server', isError: true })
        setTimeout(() => {
          setShowAlert({ message: '', isError: false })
        }, 3000)
      },
      onCompleted: () => {
        setShowAlert({ message: 'User\'s member tire have been updated.', isError: false })
        setTimeout(() => {
          setShowAlert({ message: '', isError: false })
        }, 3000)
      },
      refetchQueries: [User]
    })

    const [ editPoint ] = useMutation(UPDATE_POINT, {
      onCompleted: () => {
        setShowAlert({ message: 'User\'s member tire have been updated.', isError: false })
        setTimeout(() => {
          setShowAlert({ message: '', isError: false })
        }, 3000)
      },
      refetchQueries: [User]
    })

    useEffect(() => {
      if(result.data) {
        setPoint(result.data.users_by_pk.loyalty_points)
      }
    }, [result.data])

    if(result.loading) {
      return (
        <div>
          <em>Loading...</em>
        </div>
      )
    }

    const user = result.data.users_by_pk

    const updateMemberTire = (e) => {
      setTier(e.target.value)
      editMemberTire({ variables: { id: user.id, tier: e.target.value } })
    }

    const updatePoint = (e) => {
      setErrorPoint('')
      if(timeId) {
        clearTimeout(timeId)
      }
      setPoint(e.target.value)
      let p = e.target.value
      if(!p || isNaN(+p)) {
        setErrorPoint('Point must be at least 0')
        return
      }
      timeId = setTimeout(() => {
        editPoint({ variables: { id: user.id, point: p } })
      }, 2500)
    }

    return (
        <div>
          <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
              <Link to="/">
                Dashboard
              </Link>
              <Link to="/users">
                Users
              </Link>
              <span>
                {id}
              </span>
            </Breadcrumbs>
          </div>
          <Typography variant='h4' component='h2' sx= {{ m: 3 }} >Products</Typography>
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
              <Paper elevation={3} >
                  <Card>
                      <CardHeader>
                          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Product</Typography>
                      </CardHeader>
                      <CardContent sx={{ display: 'flex' }}>
                          <CardMedia sx={{ flex: 1 }}
                              component="img"
                              height="194"
                              image={user.image_url}
                              alt="User"
                          />
                          <Paper sx={{flex: 4, mx: 3, py: 5, display: 'flex', justifyContent: 'space-around' }}>
                            <Box>
                              <ListItem>
                                <ListItemText
                                  primary="ID"
                                  secondary={user.id}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Name"
                                  secondary={user.name}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Address"
                                  secondary={user.address}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Phone"
                                  secondary={user.phone}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Loyalty Points"
                                  secondary={user.loyalty_points}
                                />
                              </ListItem>
                            </Box>
                            <Box>
                              <ListItem>
                                <ListItemText
                                primary="Member ID"
                                secondary={user.member_id}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                primary="Member Tier"
                                secondary={user.member_tier}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Member Start Date"
                                  secondary={user.member_start_date}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Created At"
                                  secondary={user.created_at}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Updated At"
                                  secondary={user.updated_at}
                                />
                              </ListItem>
                            </Box>
                          </Paper>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between' }}>
                        <Box>
                          <FormControl sx={{ m: 2, width: 200 }} variant="outlined">
                            <InputLabel id="tier">Change Member Tier</InputLabel>
                            <Select
                              labelId="tier"
                              value={tier}
                              label="Change Member Tier"
                              onChange={updateMemberTire}
                            >
                              <MenuItem value='' >NORMAL USER</MenuItem>
                              <MenuItem value="MEMBER" >Member</MenuItem>
                              <MenuItem value="VIP" >VIP</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl sx={{ m: 2, width: 200 }} variant="outlined">
                            <TextField id="point" label="Change Loyalty Point"
                                value={point}
                                onChange={updatePoint}
                                error={errorPoint? true: false}
                                helperText={errorPoint}
                            />
                          </FormControl>
                        </Box>
                        {
                          user.disabled ? (
                            <Button variant="outlined" color="success" onClick={() => editUser({ variables: { id: user.id, disabled: false } })}>
                              Enable
                            </Button>
                          ) : (
                            <Button variant="outlined" color="error" onClick={() => editUser({ variables: { id: user.id, disabled: true } })}>
                              Disable
                            </Button>
                          )
                        }
                      </CardActions>
                  </Card>
              </Paper>
              <AddressTable addresses={user.addresses} />
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

export default User