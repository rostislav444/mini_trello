import * as React from "react";
import {ChakraProvider} from "@chakra-ui/react";
import {Main} from "./pages";
import {ApolloProvider} from '@apollo/client';
import {client} from 'utils/ApolloClient';
import {GraphQLProvider} from "./context/graphqlConext";
import {UserProvider} from "./context/userContext";
import theme from "./theme";

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
