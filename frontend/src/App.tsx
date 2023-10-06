import * as React from "react";
import {ChakraProvider, theme} from "@chakra-ui/react";
import {Main} from "./pages";
import {ApolloProvider} from '@apollo/client';
import {client} from 'utils/ApolloClient';
import {GraphQLProvider} from "./context/graphqlConext";
import {UserProvider} from "./context/userContext";

export const App = () => (
    <ChakraProvider theme={theme}>
        <UserProvider>
            <ApolloProvider client={client}>
                <GraphQLProvider>
                    <Main/>
                </GraphQLProvider>
            </ApolloProvider>
        </UserProvider>
    </ChakraProvider>
);
