import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DataGrid } from '@material-ui/data-grid';
import firebase from '../firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

export default function Dashboard() {

    const [data, setData] = useState(null);
    const [propertyModal, setPropertyModal] = useState(null);
    const [deletingModal, setDeletingModal] = useState(null);
    const [selectionModel, setSelectionModel] = useState(null);

    // 'interests' | 'property'
    const [displayMode, setDisplayMode] = useState('interests');

    const fetchData = () => {
        firebase.database().ref().child('AllSellerHomes').on('value', async propertySnap => {
            console.log('VALUE')
            const propertyObjects = Object.entries(propertySnap.val() || {}).map(ent => ({...ent[1], id: ent[0]})) // Convert to array
            const propertyObjectsWithSellers = await Promise.all(propertyObjects.map(async property => { // Fetching seller
                const interestsID = Object.entries(
                    (await firebase.database().ref().child('InterestedUsers').child(property.id).child('userId').get()).val() || {}).map(el => ({...el[1], id: el[0]})
                )
                return {
                    ...property, 
                    seller: typeof property.sellerId === 'string' ? (await firebase.database().ref().child('users').child(property.sellerId).get()).val() : null,
                    interestsID,
                    interests: await Promise.all(
                        interestsID.map( 
                            async interest => ({...(await firebase.database().ref().child('users').child(interest.buyerId).get()).val(), id: interest.buyerId, interestID: interest.id}) 
                        )
                    )
                }
            }))
            setData(propertyObjectsWithSellers)
        })
    }

    const handleModalClose = ({target: {id}}) => {
        if (id === 'modalInner') {
            setPropertyModal(null)
        }
    }

    const handleRowClick = async ({ row }) => {
        if (displayMode === 'property') {
            setPropertyModal(row); 
        }
        if (displayMode === 'interests') {
            setPropertyModal(row.property); 
        }
    }

    const handleDeleteSelected = async (confirmed) => {
        if (!confirmed) return setDeletingModal('confirm');
        setSelectionModel(null);
        setDeletingModal('loading');

        if (displayMode === 'property') {
            // Removing homes in user records
            await Promise.all(selectionModel.map(property_id => {
                return firebase.database().ref().child(`users/${data.find(el => el.id === property_id).sellerId}/homes/${property_id}`).set(null)
            }))

            // Removing homes in AllSellerHomes records
            await firebase.database().ref().child(`AllSellerHomes`).update(selectionModel.reduce((ac, el) => {
                return {...ac, [el]: null}
            }, {}))
        }

        if (displayMode === 'interests') {
            await Promise.all(selectionModel.map(interest => {
                const propertyID = interest.split('__')[0];
                const interestID = interest.split('__')[1];
                const buyerID = interest.split('__')[2];
                console.log('DELETING', propertyID, interestID, buyerID)
                return firebase.database().ref().child('InterestedUsers').child(propertyID).child('userId').child(interestID).remove()
            }))

            await Promise.all(selectionModel.map(async interest => {
                const propertyID = interest.split('__')[0];
                const buyerID = interest.split('__')[2];

                const res = Object.entries((await firebase.database().ref().child('AllSellerHomes').child(propertyID).child('userId').get()).val());
                const id = res.find(el => el[1] === buyerID)[0]
                console.log(id);
                await firebase.database().ref().child('AllSellerHomes').child(propertyID).child('userId').child(id).remove()
            }))
        }

        // I think it's a very bad idea to place whole object in db TWICE, but who am I to decide ¯\_(ツ)_/¯

        setDeletingModal('success');
    }

    const formatData = () => {
        if (displayMode === 'property') {
            return data
        } 

        if (displayMode === 'interests') {
            return (data || []).reduce((ac, property) => {
                if (property.interests && property.interests.length > 0) {
                    return [...ac, ...property.interests.map(interest => ({
                        id: property.id + '__' + interest.interestID + '__' + interest.id,
                        interest,
                        property
                    }))]
                }
                return ac;
            }, [])
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
    
    return (
        <>
            {
                !data && <LoadingContainer>
                    <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        size={40}
                        thickness={4}
                    />
                </LoadingContainer>
            }
            {
                data && <Container>
                    <Header>
                        <Title>
                            Buyers&Sellers Property Dashboard
                            {
                                (selectionModel || {}).length > 0 && 
                                    <Button 
                                        color="primary" 
                                        variant='contained' 
                                        style={{width: 200, marginLeft: '1rem'}} 
                                        onClick={() => handleDeleteSelected(false)}
                                    >
                                            Delete selected
                                    </Button>
                            }
                            <ModeSelector>
                                <ModeSelectorElement selected={displayMode === 'interests'} onClick={() => setDisplayMode('interests')}>Interests</ModeSelectorElement> /
                                <ModeSelectorElement selected={displayMode === 'property'} onClick={() => setDisplayMode('property')}>All Property</ModeSelectorElement> 
                            </ModeSelector>
                        </Title>
                        <CurrentAuth>
                            {firebase.auth().currentUser.email}
                            <Button color="primary" variant='outlined' style={{width: 100}} onClick={() => firebase.auth().signOut()}>Logout</Button>
                        </CurrentAuth>
                    </Header>
                    <div style={{ width: '90vw', height: '85vh' }}>
                        <DataGrid
                            rows={formatData()}
                            columns={(
                                (displayMode === 'property' && ColumnsProperty) ||
                                (displayMode === 'interests' && ColumnsInterests)
                            )}
                            checkboxSelection
                            disableSelectionOnClick
                            autoPageSize
                            onRowClick={handleRowClick}
                            onSelectionModelChange={setSelectionModel}
                            selectionModel={selectionModel}
                            style={{backgroundColor: 'white'}}
                        />
                    </div>
                </Container>
            }
            <Modal 
                open={!!propertyModal}
            >
                <ModalInner
                    id='modalInner'
                    onClick={handleModalClose}
                >
                    {
                        propertyModal && <ModalWindow>
                            <Title style={{marginTop: 0}}>Property</Title>
                            <GridContainer>
                                {
                                    getModalTableFromRow(propertyModal).map(cell => (
                                        <Card>
                                            <CardContent>
                                                <Typography color="textSecondary" gutterBottom>
                                                    {cell.title}
                                                </Typography>
                                                <Typography variant="h5" component="h2">
                                                    {cell.data}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                            </GridContainer>
                            <Title style={{marginTop: 0}}>Seller</Title>
                            <GridContainer>
                                {
                                    propertyModal.seller 
                                        ? getSellerTableFromRow(propertyModal.seller || {}).map(cell => (
                                            <Card>
                                                <CardContent>
                                                    <Typography color="textSecondary" gutterBottom>
                                                        {cell.title}
                                                    </Typography>
                                                    <Typography variant="h5" component="h2">
                                                        {cell.data}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        )) 
                                        : <Typography color="error" gutterBottom>
                                            Seller was not found in database 😢 <br />
                                            Seller ID: {Object.values(propertyModal.userId)[0]}
                                        </Typography>
                                }
                            </GridContainer>
                            <Title style={{marginTop: 0}}>Interests</Title>
                            {
                                propertyModal.interests && propertyModal.interests.length > 0 && propertyModal.interests.map((interest, i) => (
                                    <>
                                        <Typography variant="h5" component="h4" style={{marginBottom: '1rem'}}>
                                            Interest #{i + 1}
                                        </Typography>
                                        <GridContainer style={{gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
                                            {
                                                getBuyerTableFromRow(interest).map(cell => (
                                                    <Card>
                                                        <CardContent>
                                                            <Typography color="textSecondary" gutterBottom>
                                                                {cell.title}
                                                            </Typography>
                                                            <Typography variant="h5" component="h2">
                                                                {cell.data}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                )) 
                                            }
                                        </GridContainer>
                                    </>
                                ))
                            }
                            {
                                propertyModal.interests && propertyModal.interests.length === 0 && 
                                    <Typography variant="h5" component="h2">
                                        No Interests
                                    </Typography>
                            }
                            {
                                !propertyModal.interests && 
                                    <CircularProgress
                                        variant="indeterminate"
                                        disableShrink
                                        size={40}
                                        thickness={4}
                                    />
                            }
                      </ModalWindow>
                    }
                </ModalInner>
            </Modal>

            <Modal 
                open={!!deletingModal}
            >
                <ModalInner
                    deleting
                    id='modalInner'
                    onClick={handleModalClose}
                >
                    <ModalWindow deleting>
                        {
                            deletingModal === 'confirm' && <>
                                <Title style={{marginTop: 0}}>Hands up!</Title>
                                <Typography variant="h5" component="h5" style={{marginBottom: '1rem'}}>
                                    Are you sure to delete {(selectionModel || {}).length} records?
                                </Typography>
                                <Button color="outlined" variant='outlined' onClick={() => setDeletingModal(null)}style={{width: 200, marginRight: '1rem'}}>Not really</Button>
                                <Button color="primary" variant='contained' onClick={() => handleDeleteSelected(true)}style={{width: 200}}>Yeah, absolutely!</Button>
                            </>
                        }
                        {
                            deletingModal === 'loading' && <>
                                <Title style={{marginTop: 0}}>Deleting</Title>
                                <CircularProgress
                                    variant="indeterminate"
                                    disableShrink
                                    size={40}
                                    thickness={4}
                                />
                            </>
                        }
                        {
                            deletingModal === 'success' && <>
                                <Title style={{marginTop: 0}}>Success!</Title>
                                <Button color="outlined" variant='outlined' onClick={() => setDeletingModal(null)}style={{width: 200, marginRight: '1rem'}}>Close</Button>
                            </>
                        }
                    </ModalWindow>
                </ModalInner>
            </Modal>
        </>
    )
}
// address: "Kyiv-Pasazhyrskyi, Kyiv, Ukraine"
// coordinate: {lat: 50.442595, lng: 30.486695}
// id: "-MgPPYLGm8w5rbSTY4l1"
// needBuy: 0
// price: "9000000"
// seller: null
// timeFrame: "5 days"
// userId: "LE4qJg8rKVfbYeyXfva4cTwDCeE2"
// whereNew: "Nowhere"
const Container = styled.div`
    min-width: 30rem;
    display: flex;
    flex-direction: column;
`

const Title = styled.div`
    font-family: 'Roboto';
    font-size: 2rem;
    width: 100%;
    margin: 2rem 0;
    display: flex;
    align-items: center;
`

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

const Header = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const CurrentAuth = styled.div`
    display: flex;
    align-items: center;
    && > * {
        margin: 0 1rem;
    }
`

const ModalInner = styled.div`
    width: 100vw;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow: auto;
    padding: 10vh 0;
    ${
        ({ deleting }) => deleting && `
            align-items: center;
        `
    }
`

const ModalWindow = styled.div`
    background-color: white;
    border-radius: 5px;
    padding: 3rem;
    max-width: 50rem;
    min-width: 60vw;
    min-height: 70vh;
    ${
        ({ deleting }) => deleting && `
            max-width: unset;
            max-height: unset;
            min-width: unset;
            min-height: unset;
        `
    }
`

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 1rem;
    margin-bottom: 3rem;
`

const ModeSelector = styled.div`
    display: flex;
    flex-direction: row;
    font-size: 1rem;
    align-items: center;
`

const ModeSelectorElement = styled.div`
    margin: 0 1rem;
    ${({ selected }) => !selected && `
        text-decoration: underline;
        color: #28a8e9;
        cursor: pointer;
    `}
` 

const ColumnsProperty = [
    {
        field: 'address',
        headerName: 'Address',
        width: 300,
    },
    {
        field: 'price',
        headerName: 'Price',
        width: 150,
        valueGetter: ({ row }) => formatMoney(row.price)
    },
    {
        field: 'fullName',
        headerName: 'Seller name',
        sortable: false,
        width: 160,
        valueGetter: (params) => `${params.row.seller?.firstName || 'Deleted user'} ${params.row.seller?.lastName || ''}`,
    },
    {
        field: 'email',
        headerName: 'Seller email',
        sortable: false,
        width: 250,
        valueGetter: (params) => `${params.row.seller?.email || ''}`,
    },
    {
        field: 'phone',
        headerName: 'Seller phone',
        sortable: false,
        width: 250,
        valueGetter: (params) => `${params.row.seller?.mobileNumber || ''}`,
    },
    {
        field: 'int',
        headerName: 'Interests count',
        sortable: true,
        width: 180,
        valueGetter: (params) => `${params.row.interestsID?.length || '0'}`,
    },
    {
        field: 'id',
        headerName: 'ID in database',
        sortable: true,
        width: 250,
    },
]

const ColumnsInterests = [
    {
        field: 'address',
        headerName: 'Address',
        width: 300,
        valueGetter: ({ row }) => formatMoney(row.property.address)
    },
    {
        field: 'price',
        headerName: 'Price',
        width: 150,
        valueGetter: ({ row }) => formatMoney(row.property.price)
    },
    {
        field: 'SellerFullName',
        headerName: 'Seller full name',
        sortable: false,
        width: 160,
        valueGetter: (params) => `${params.row.property?.seller?.firstName || 'Deleted user'} ${params.row.property?.seller?.lastName || ''}`,
    },
    {
        field: 'email',
        headerName: 'Seller email',
        sortable: false,
        width: 200,
        valueGetter: (params) => `${params.row.property?.seller?.email || ''}`,
    },
    {
        field: 'BuyerFullName',
        headerName: 'Buyer full name',
        sortable: false,
        width: 160,
        valueGetter: (params) => `${params.row.interest?.firstName || 'Deleted user'} ${params.row.interest?.lastName || ''}`,
    },
    {
        field: 'BuyerEmail',
        headerName: 'Buyer email',
        sortable: false,
        width: 200,
        valueGetter: (params) => `${params.row.interest?.email || ''}`,
    },
    {
        field: 'interests',
        headerName: 'Interests on this property',
        sortable: false,
        width: 250,
        valueGetter: (params) => `${params.row.property?.interests?.length || ''}`,
    },
]

function formatMoney(val) {
    return isNaN(parseInt(val.replace(/[^0-9.]/g, ''))) ? (val || '—') : `$${parseInt(val.replace(/[^0-9.]/g, '')).toLocaleString()}`
}

// address: "Kyiv-Pasazhyrskyi, Kyiv, Ukraine"
// coordinate: {lat: 50.442595, lng: 30.486695}
// id: "-MgPPYLGm8w5rbSTY4l1"
// needBuy: 0
// price: "9000000"
// seller: null
// timeFrame: "5 days"
// userId: "LE4qJg8rKVfbYeyXfva4cTwDCeE2"
// whereNew: "Nowhere"

function getModalTableFromRow(row) {
    return [
        {
            title: 'Adress',
            data: row.address,
        },
        {
            title: 'Coordinates',
            data: row.coordinate ? `${row.coordinate.lat.toFixed(7)}, ${row.coordinate.lng.toFixed(7)}` : '—'
        },
        {
            title: 'Price',
            data: isNaN(parseInt(row.price.replace(/[^0-9.]/g, ''))) ? (row.price || '—') : `$${parseInt(row.price.replace(/[^0-9.]/g, '')).toLocaleString()}`
        },
        {
            title: 'Time Frame to sell',
            data: row.timeFrame
        },
        {
            title: 'Need to buy another home?',
            data: !!row.needBuy ? 'Yes' : 'No'
        },
        {
            title: 'Where need to buy another home?',
            data: row.whereNew || '—'
        },
    ]
}

// {
//     "email" : "Seller@test.com",
//     "firstName" : "Ilya",
//     "homes" : {
//       "-MgeX2jJRuKQcoQ_HQjK" : {
//         "address" : "Kyiv Food Market, Moskovska Street, Kyiv, Ukraine",
//         "coordinate" : {
//           "lat" : 50.44224850000001,
//           "lng" : 30.5445022
//         },
//         "needBuy" : 0,
//         "price" : "12",
//         "timeFrame" : "12",
//         "whereNew" : "21"
//       },
//       "-Mgekj9mnOOlpZR3utYn" : {
//         "address" : "Boryspil' airport (KBP), Boryspil', Kyiv Oblast, Ukraine",
//         "coordinate" : {
//           "lat" : 50.33822199999999,
//           "lng" : 30.8939274
//         },
//         "needBuy" : 1,
//         "price" : "123",
//         "timeFrame" : "123",
//         "whereNew" : "123"
//       },
//       "-Mgem_Ni6DF2AV0LgGKy" : {
//         "address" : "Kyiv Food Market, Moskovska Street, Kyiv, Ukraine",
//         "coordinate" : {
//           "lat" : 50.44224850000001,
//           "lng" : 30.5445022
//         },
//         "needBuy" : 0,
//         "price" : "213",
//         "timeFrame" : "3213",
//         "whereNew" : "21313"
//       }
//     },
//     "isPrimary" : "Yes",
//     "lastName" : "Seller",
//     "mobileNumber" : "2123121231",
//     "mortgage" : "Yes",
//     "payment" : "standart",
//     "userType" : "Seller"
//   }
  

function getSellerTableFromRow(row) {
    return [
        {
            title: 'Full name',
            data: (row.firstName || '') + ' ' + (row.lastName || ''),
        },
        {
            title: 'Email',
            data: row.email || '—'
        },
        {
            title: 'Are you currently on your mortgage?',
            data: row.mortgage
        },
        {
            title: 'Phone number',
            data: row.mobileNumber
        },
        {
            title: 'Is the property is primary residence?',
            data: row.isPrimary || '—'
        },
        {
            title: 'ID in database',
            data: row.id || '—'
        },
    ]
}

// {
//     "email" : "Buyer@test.com",
//     "financing" : "VA Loan",
//     "firstName" : "Ilya",
//     "homeParam" : {
//       "bathrooms" : [ "1", "2" ],
//       "bedrooms" : [ "1", "2" ],
//       "homePrice" : [ "1", "2" ],
//       "homeSize" : [ "1", "2" ],
//       "neighborhood" : "123",
//       "town" : "123"
//     },
//     "lastName" : "Buyer",
//     "mobileNumber" : "12323213123",
//     "payment" : "standart",
//     "userType" : "Buyer"
//   }
  

function getBuyerTableFromRow(row) {
    return [
        {
            title: 'Full name',
            data: (row.firstName || '') + ' ' + (row.lastName || ''),
        },
        {
            title: 'Email',
            data: row.email || '—'
        },
        {
            title: 'Phone number',
            data: row.mobileNumber
        },
        {
            title: 'Financing',
            data: row.financing,
        },
        {
            title: 'Required neighborhood',
            data: row.homeParam.neighborhood,
        },
        {
            title: 'Required town',
            data: row.homeParam.town,
        },
        {
            title: 'Required bathrooms',
            data: row.homeParam.bathrooms[0] + ' — ' + row.homeParam.bathrooms[1],
        },
        {
            title: 'Required bedrooms',
            data: row.homeParam.bedrooms[0] + ' — ' + row.homeParam.bedrooms[1],
        },
        {
            title: 'Required price',
            data: formatMoney(row.homeParam.homePrice[0]) + ' — ' + formatMoney(row.homeParam.homePrice[1]),
        },
        {
            title: 'Required home size',
            data: row.homeParam.homeSize[0] + ' — ' + row.homeParam.homeSize[1],
        },
        {
            title: 'ID in database',
            data: row.id,
        },
    ]
}