import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client';
import {onError} from "@apollo/client/link/error";
import {setContext} from '@apollo/client/link/context';
import { globalEvents } from 'utils/events';

const httpLink = createHttpLink({
    uri: 'http://0.0.0.0:5005/graphql',
});

const authLink = setContext(() => {
    const token = localStorage.getItem('token');

    console.log('token', token)

    return {
        headers: {
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});


const errorLink = onError(({graphQLErrors, networkError}) => {
    if (networkError && 'statusCode' in networkError && networkError.statusCode === 401) {
        console.log('Unauthorized, status code - 401', networkError)
        globalEvents.emit('logout');
    }
});

export const client = new ApolloClient({
    link: errorLink.concat(authLink)
                   .concat(httpLink),
    cache: new InMemoryCache(),
});
