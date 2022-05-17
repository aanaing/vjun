import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from '@apollo/client'
import { REVIEWS_BY_PRODUCT_ID, DELETE_BY_ID } from '../../gql/review'
import { Paper, Typography, Card, CardContent, Button, Box, TablePagination, Modal} from '@mui/material'
import moment from "moment";

import StarIcon from '@mui/icons-material/Star';

const style = {
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

const Reviews = ({ product_id, productAlert }) => {

    const [ count, setCount ] = useState(0)
    const [ page, setPage ] = useState(0)
    const [ rowsPerPage, setRowsPerPage ] = useState(10)
    const [ offset, setOffset ] = useState(0)
    const [ open, setOpen ] = useState(false);
    const [ review, setReview ] = useState(null)
    
    const result = useQuery(REVIEWS_BY_PRODUCT_ID, { variables: { id: product_id, limit: rowsPerPage, offset: offset } })

    const [ deleteReview ] = useMutation(DELETE_BY_ID, {
        onError: (error) => {
          console.log('error : ', error)
          productAlert('Error on server', true)
        },
        onCompleted: () => {
          productAlert('Review have been removed.', false)
          handleClose()
        },
    })
  

    useEffect(() => {
        if( result.data) {
          setCount(Number(result.data?.product_reviews_aggregate.aggregate.count))
        }
    }, [result])

    if(result.loading) {
        return (
          <div>
            <em>Loading...</em>
          </div>
        )
    }

    const handleOpen = (r) => {
        setReview(r)
        setOpen(true)
    };
    const handleClose = () => {
      result.refetch()
      setOpen(false)
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setOffset(rowsPerPage * newPage)
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0);
    };

    const handleDelete = () => {
        deleteReview({ variables: {id: review.id} })
    }
    
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={3} >
            <Typography variant='h6' component='h4' sx= {{ m: 3 }} >Reviews</Typography>
            {
                result.data?.product_reviews.map((review, index) => (
                    <Card variant="outlined" key={index}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }} >
                                        <Typography variant="h6" component="div" >
                                            {review.user.name}
                                        </Typography>
                                        <Typography sx={{ mx: 3 }} color="text.secondary">
                                            {moment(review.updated_at).fromNow()}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        {
                                            Array.apply(0, Array(review.star_rating)).map((s, index) => (
                                                <StarIcon key={index} />
                                            ))
                                        }
                                    </Box>
                                </Box>
                                <Button size="small" color="warning" onClick={() => handleOpen(review)} >Delete</Button>
                            </Box>
                            <Typography variant="body2" sx={{ my: 2 }} >
                                {review.review_body_text}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            }
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                    Remove proudct
                </Typography>
                <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                    Are you sure want to remove review?
                </Typography>
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                    <Button color='secondary' onClick={handleClose} >Cancel</Button>
                    <Button onClick={handleDelete} >Confirm</Button>
                </Box>
                </Box>
            </Modal>
            <TablePagination
                rowsPerPageOptions={[ 10, 25, 100]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default Reviews