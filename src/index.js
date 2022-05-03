import ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom";
import App from './App'

import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const authLink = setContext((_, { headers }) => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    const loggedUserParsed = JSON.parse(loggedUserJSON)
    return {
        headers: {
            ...headers,
            Authorization: loggedUserParsed ? `Bearer ${loggedUserParsed.token}` : null,
            'x-hasura-admin-secret': 'myadminsecretkey'
        }
    }
})

const errorLink = onError(({graphQLErrors, networkError}) => {
    if(graphQLErrors) {
        graphQLErrors.forEach(({extensions}) => {
            if(extensions.code === 'invalid-headers' || extensions.code === 'invalid-jwt') {
                window.location.assign(`${window.location.origin}/login`)
            }
        })
    }
    if(networkError) {
        console.log(`[Network error]: ${networkError}`);
        alert('network connection problem');
    }
})

const httpLink = new HttpLink({ uri: 'http://157.230.33.232:8000/v1/graphql' })

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(authLink).concat(httpLink)
})

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>
, document.getElementById('root'))