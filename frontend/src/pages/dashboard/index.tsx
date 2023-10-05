import {DASHBOARD_BY_ID} from "graphql/queries/getDashboardById";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {DashboardState} from "interfaces/dashboard";
import {Box, Button, Flex, Heading} from "@chakra-ui/react";
import {useQuery} from "@apollo/client";
import {DashboardColumns} from "components/App/Dashboard/Columns";


export const Dashboard = () => {
    const navigate = useNavigate();
    const {dashboardId} = useParams();
    const {loading, error, data, refetch} = useQuery(DASHBOARD_BY_ID, {variables: {dashboardId}})
    const [dashboard, setDashboard] = useState<DashboardState | null>(null);

    useEffect(() => {
        if (data) {
            if (!data.dashboard[0]) {
                navigate('/')
            }
            setDashboard(data.dashboard[0])
        }
    }, [data, error]);


    return (
        !loading ? <Box mt={12}>
            <Flex justifyContent="space-between" alignItems="center">
                <Heading>{dashboard?.title}</Heading>
                <Button colorScheme="blue">Add Column</Button>
            </Flex>
            <DashboardColumns columns={dashboard?.columns || []} assignees={dashboard?.assignees || []} refetch={refetch}/>
        </Box> : <p>'Loading...'</p>
    )
}
