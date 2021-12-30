import React, { useState } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MultipleValueTextInput from 'react-multivalue-text-input';
import firebase, {secondary} from '../firebase'

const CreateAgentModal = ({open, onClose}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [zipCodes, setZipCodes] = useState([]);
  const [info, setInfo] = useState('');

  console.log(`zipCodes`, login)

  const onSubmit = () => {
    if (!login || !password || !zipCodes.length) {
      alert('All fields are required');
      return;
    }

    secondary.auth().createUserWithEmailAndPassword(login, password).then(({user}) => {
      console.log(`user`, user)
      if (user.uid) {
        const userId = user.uid;
        secondary
          .database()
          .ref('users/' + userId + '/')
          .set({
            userType: 'agent',
            email: login,
            info,
            zipCodes,
            createAt: Date.now()
          })
          .catch(error => {
            console.log('Storing Error', error);
          });
          onClose();
          secondary.auth().signOut()
      }
    }).catch(error => {
      alert(error.message);
    })
  }

  return (
    <>
      {open && (
        <>
          <BackDrop onClick={onClose}/>
          <ModalInner>
            <h1 style={{marginTop: 0}}>Create a new agent!</h1>
            <TextField id="login" label="Login" variant="outlined" fullWidth style={{marginBottom: '.5rem', backgroundColor: 'white'}} value={login} onChange={(v) => setLogin(v.target.value)}/>
            <TextField type="password" id="password" label="Password" variant="outlined" fullWidth style={{marginBottom: '1rem', backgroundColor: 'white'}} value={password} onChange={(v) => setPassword(v.target.value)}/>
            <TextField id="info" label="Short info" variant="outlined" fullWidth style={{marginBottom: '1rem', backgroundColor: 'white'}} value={info} onChange={(v) => setInfo(v.target.value)}/>
            <h3 style={{marginTop: 0}}>Zip Codes</h3>
            <MultipleValueTextInput
              values={zipCodes}
              onItemAdded={(i) => setZipCodes([...zipCodes, i])}
              onItemDeleted={(i) => setZipCodes(zipCodes.filter(zip => zip !== i))}
              name="item-input"
              placeholder="Enter zip codes here; separate them with COMMA or ENTER."
              className="zip-input"
            />
            <Button fullWidth style={{backgroundColor: '#3eadac', color: 'white'}} onClick={onSubmit} variant='contained' >Create agent</Button>
          </ModalInner>
        </>
      )}

    </>
  )
}

export default CreateAgentModal

const BackDrop = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`

const ModalInner = styled.div`
    z-index: 10000;
    position: absolute;
    background-color: white;
    overflow: auto;
    border-radius: 5px;
    padding: 3rem;
    max-width: 50rem;
    min-width: 60vw;
    height: 60vh;
    top: 0;
    bottom: 0;
    transform: translateY(5%);
    ${
        ({ deleting }) => deleting && `
            max-width: unset;
            max-height: unset;
            min-width: unset;
            min-height: unset;
        `
    }
`