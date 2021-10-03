import React, {useState} from 'react';
import firebase from '../firebase'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';


export default function Auth(props) {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const dbRef = firebase.database().ref();

    const handleInput = ({target: { value, id }}) => {
        setError(null);
        if (id === 'login') {
            setLogin(value)
        }

        if (id === 'password') {
            setPassword(value)
        }
    }

    const handleLoginButton = async () => {
        try {
            setError(null);
            setLoading(true);
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            const userCredential = await firebase.auth().signInWithEmailAndPassword(login, password)
            const userSnap = await dbRef.child('users').child(userCredential.user.uid).get()

            if (!(userSnap.exists() && userSnap.val().userType === 'admin')) {
                return setError('You are not an admin')
            }

            props.handleSuccess();
        } catch(err) {
            if (err.code === "auth/wrong-password") {
                setPassword('')
            }

            if (err.message) {
                return setError(err.message)
            }
            
            setError('Unknown error')
        } finally {
            setLoading(false);
        }
    }

    return (<Container>
        {
            !isLoading && <>
                <Title style={{marginBottom: '1.5rem'}}>Buyers&Seller Dashboard</Title>
                {
                    error && <Error>{error}</Error>
                }
                <TextField id="login" label="Login" variant="outlined" fullWidth style={{marginBottom: '.5rem', backgroundColor: 'white'}} value={login} onChange={handleInput}/>
                <TextField type="password" id="password" label="Password" variant="outlined" fullWidth style={{marginBottom: '1rem', backgroundColor: 'white'}} value={password} onChange={handleInput}/>
                <Button fullWidth style={{backgroundColor: '#3eadac', color: 'white'}} variant='contained' onClick={handleLoginButton}>Login</Button>
            </>
        }
        {
            isLoading && <CircularProgress
                variant="indeterminate"
                disableShrink
                size={40}
                thickness={4}
            />
        }
    </Container>)
}

const Container = styled.div`
    height: 100vh;
    min-width: 30rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const Title = styled.span`
    font-family: 'Roboto';
    font-size: 2rem;
    width: 100%;
`

const Error = styled.span`
    font-family: 'Roboto';
    color: #B00020;
    font-size: .9rem;
    width: 100%;
    margin-bottom: 1rem;
`