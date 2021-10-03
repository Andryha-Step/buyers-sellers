import React, {useEffect, useState} from 'react';
import Auth from './Components/Auth'
import Dashboard from './Components/Dashboard'
import styled from 'styled-components';
import firebase from './firebase'
import CircularProgress from '@material-ui/core/CircularProgress';

function App() {

	const [appState, setAppState] = useState('');

	useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				setAppState('dashboard')
			} else {
				setAppState('auth')
			}
		});

	}, [])

	return (
		<Container>
			{
				appState === 'auth' && <Auth handleSuccess={() => setAppState('dashboard')} />
			}
			{
				appState === 'dashboard' && <Dashboard />
			}
			{
				!appState && <div style={{height: '100vh', display: 'flex', alignItems: 'center'}}>
					<CircularProgress
						variant="indeterminate"
						disableShrink
						size={40}
						thickness={4}
					/>
				</div>
			}
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	justify-content: center;
	width: 100vw;
`

export default App;
