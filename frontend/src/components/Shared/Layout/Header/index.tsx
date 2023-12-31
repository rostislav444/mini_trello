import {useEffect, useState} from 'react';
import {Avatar, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {ColorModeSwitcher} from "../../../UI/ColorModeSwitcher";
import {useNavigate, useParams} from "react-router-dom";
import {useGraphQL} from "../../../../context/graphqlConext";
import {DashboardState} from "interfaces/dashboard";
import {useUser} from "../../../../context/userContext";


export const Header: React.FC = () => {
    const {user, logout} = useUser();
    const {dashboardId} = useParams();
    const navigate = useNavigate();
    const {dashboardListQuery} = useGraphQL();
    const [dashboardList, setDashboardList] = useState<DashboardState[]>([]);
    const selectedDashboard = dashboardList.find(dashboard => dashboard.id === dashboardId)

    useEffect(() => {
        if (dashboardListQuery && dashboardListQuery.data) {
            setDashboardList(dashboardListQuery.data.dashboard.map((dashboard: any) => {
                return ({...dashboard, selected: dashboard.id === dashboardId})
            }));
        }
    }, [dashboardListQuery, dashboardId]);

    const handleDashboardClick = (dashboardId: string) => {
        navigate(`/dashboard/${dashboardId}`);
    }

    return (
        <>
            <Flex h='100%'>
                <Flex w='100%' align='center'>
                    {dashboardList.length > 0 &&
                        <Menu>
                            {({isOpen}) => (
                                <>
                                    <MenuButton variant="ghost" mr={4} isActive={isOpen} as={Button} rightIcon={<ChevronDownIcon/>}>
                                        {selectedDashboard ? selectedDashboard?.title : 'Select dashboard'}
                                    </MenuButton>
                                    <MenuList>
                                        {dashboardList.map(dashboard => (
                                            <MenuItem
                                                // bg={dashboard.id === dashboardId ? bgColorSelected : bgColor}
                                                key={dashboard.id}
                                                onClick={() => handleDashboardClick(dashboard.id)}
                                            >
                                                <Text>{dashboard.title}</Text>
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </>
                            )}
                        </Menu>
                    }
                    <Button colorScheme="blue" onClick={() => navigate('/')}>Create dashboard</Button>
                </Flex>
                <Flex flex='1' align='center'>
                    <Avatar w='36px' h='36px' bg='teal.500'/>
                    <Text whiteSpace='nowrap' ml='4'>{user?.firstName} {user?.lastName}</Text>
                    <Button ml='6' variant="ghost" onClick={logout}>Logout</Button>
                    <ColorModeSwitcher/>
                </Flex>
            </Flex>
        </>
    );
}

