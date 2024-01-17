import React from 'react';
import './App.css';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

// create a new Apollo Client instance
const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', 
  cache: new InMemoryCache(),
});
// then we will create the App component
function App() {
  return (
    <ApolloProvider client={client}>
      <>
        <Navbar />
        <Outlet />
      </>
    </ApolloProvider>
  );
}

export default App;
