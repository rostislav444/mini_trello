import {Layout} from 'components/Shared/Layout';
import {useEffect} from "react";
import {Login} from "./login";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {CreateDashboard} from "./dashboard/create";
import {Dashboard} from "./dashboard";
import {useUser} from "context/userContext";
import {globalEvents} from 'utils/events';
import {useGraphQL} from "context/graphqlConext";


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
    const {dashboardListQuery} = useGraphQL();
    const {token, logout} = useUser();

    useEffect(() => {
        const handleLogout = () => {
            logout();
        };

        globalEvents.on('logout', handleLogout);

        return () => {
            globalEvents.off('logout', handleLogout);
        };
    }, [logout]);

    useEffect(() => {
        if (token) {
            dashboardListQuery.refetch();
        }
    }, [token, dashboardListQuery]);

    if (!token) return <Login/>;


    return (
        <RouterProvider router={router}/>
    );
};
