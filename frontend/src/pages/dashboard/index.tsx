import {DASHBOARD_BY_ID} from "graphql/queries/getDashboardById";
import {useParams} from "react-router-dom";
import {Box, Flex, Heading, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger} from "@chakra-ui/react";
import {useQuery} from "@apollo/client";
import {Columns} from "components/App/Dashboard/Columns";
import {CreateColumn} from "components/App/Dashboard/Columns/Column/Create";
import {InfoOutlineIcon} from "@chakra-ui/icons";
import {useEffect} from "react";


export const Dashboard = () => {
    const {dashboardId} = useParams();
    const {loading, error, data, refetch, networkStatus} = useQuery(DASHBOARD_BY_ID, {variables: {dashboardId},})

    useEffect(() => {
        refetch()
    }, []);

    if (loading) {
        return <Heading>Loading</Heading>
    }

    if (!data?.dashboard[0]) {
        return <Heading>No Dashboard found</Heading>
    }

    const dashboard = data?.dashboard[0]

    return <Box mt={12}>
        <Flex justifyContent="space-between" alignItems="center">
            <Flex justifyContent="space-start" alignItems="center">
                <Heading>{dashboard?.title}</Heading>
                {dashboard?.description ? <Popover>
                    <PopoverTrigger>
                        <InfoOutlineIcon cursor={'pointer'} opacity={0.3} w={6} h={6} ml={4}/>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow/>
                        <PopoverCloseButton/>
                        <PopoverHeader>Description</PopoverHeader>
                        <PopoverBody maxH={240} overflowY={'auto'}>{dashboard?.description}</PopoverBody>
                    </PopoverContent>
                </Popover> : null}

            </Flex>
            <CreateColumn refetch={refetch} totalColumns={dashboard?.columns?.length || 0}/>
        </Flex>
        <Columns key={dashboard.id} dashboard={dashboard} refetch={refetch} networkStatus={networkStatus}/>
    </Box>

}
