import {DASHBOARD_BY_ID} from "graphql/queries/getDashboardById";
import {useParams} from "react-router-dom";
import {Box, Button, Flex, Heading} from "@chakra-ui/react";
import {useQuery} from "@apollo/client";
import {DashboardColumns} from "components/App/Dashboard/Columns";
import {CreateColumn} from "components/App/Dashboard/Columns/Create";


export const Dashboard = () => {
    const {dashboardId} = useParams();
    const {loading, error, data, refetch, networkStatus} = useQuery(DASHBOARD_BY_ID, {variables: {dashboardId},})


    if (loading) {
        return <Heading>Loading</Heading>
    }

    if (!data?.dashboard[0]) {
        return <Heading>No Dashboard found</Heading>
    }

    const dashboard = data?.dashboard[0]

    return <Box mt={12}>
        <Flex justifyContent="space-between" alignItems="center">
            <Heading>{dashboard?.title}</Heading>
            <CreateColumn refetch={refetch} totalColumns={dashboard?.columns?.length || 0}/>
        </Flex>
        <DashboardColumns key={dashboard.id} dashboard={dashboard} refetch={refetch} networkStatus={networkStatus}/>
    </Box>

}
