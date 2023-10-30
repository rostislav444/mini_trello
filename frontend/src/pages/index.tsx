import {Layout} from 'components/Shared/Layout';
import {useEffect, useState} from "react";
import {Login} from "./login";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {CreateDashboard} from "./dashboard/create";
import {Dashboard} from "./dashboard";
import {useUser} from "context/userContext";
import {globalEvents} from 'utils/events';
import {client, serverUrl} from "utils/ApolloClient";


const router = createBrowserRouter([
    {
        path: "/",
        element: <CreateDashboard/>,
    },
    {
        path: "/dashboard/:dashboardId",
        element:
            <Dashboard/>,
        children: [
            {
                path: "card/:cardId",
                element: <Dashboard/>,
            }
        ]
    }
].map((route) => ({...route, element: <Layout>{route.element}</Layout>,})));


export const Main = () => {
    const {token, logout} = useUser();
    const [isTokenValid, setIsTokenValid] = useState(false);

    // Check token validity
    useEffect(() => {
        if (token) {
            fetch(serverUrl + '/check_token', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        setIsTokenValid(true);
                    } else {
                        setIsTokenValid(false);
                        logout();
                    }
                })
                .catch(() => {
                    setIsTokenValid(false);
                    logout();
                });
        }
    }, [token, logout]);

    // Listen for logout event
    useEffect(() => {
        const handleLogout = () => {
            logout();
        };

        globalEvents.on('logout', handleLogout);

        return () => {
            globalEvents.off('logout', handleLogout);
        };
    }, [logout]);

    // Listen for token changes
    useEffect(() => {
        if (!token || !isTokenValid) return;
        if (token && isTokenValid) {
            client.resetStore();
        }
    }, [token, isTokenValid]);

    if (!token || !isTokenValid) return <Login/>;

    return (
        <RouterProvider router={router}/>
    );
}
