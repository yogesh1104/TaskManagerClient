import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import {SetContextLink} from '@apollo/client/link/context';

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
});

const authLink = new SetContextLink((previousContext) => {
    const token = localStorage.getItem('token');
    return {
        headers : {
            ...previousContext.headers,
            ...(token ? {Authorization: `Bearer ${token}`} : {})
        }
    }
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});