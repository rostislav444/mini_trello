import {Box, Flex, Heading, useColorModeValue} from "@chakra-ui/react";
import {CreateCard} from "components/App/Dashboard/Columns/Column/Card/Create";
import {Card} from "components/App/Dashboard/Columns/Column/Card";
import React from "react";
import {Droppable} from "react-beautiful-dnd";
import {ColumnState} from "interfaces/column";
import {EditColumn} from "components/App/Dashboard/Columns/Column/Edit";

interface DashboardColumnsProps {
    column: ColumnState,
    assignees: {
        id: string,
        firstName: string
        email?: string | undefined;
    }[]
    refetch: any,
    totalColumns: number,
}


export const Column = ({column, assignees, refetch, totalColumns}: DashboardColumnsProps) => {
    const bg = useColorModeValue('white', 'gray.700')


    return (
        <Box minH={'calc(100vh - 220px)'} minW={'320px'} bg={bg} p={4} borderRadius={4} mr={4}>
            <Flex justifyContent="space-between" alignItems="center">
                <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="md">
                        {column.title}
                    </Heading>
                    <EditColumn column={column} refreshDashboard={refetch} totalColumns={totalColumns}/>
                </Flex>
                <CreateCard
                    columnId={column.id}
                    columnTitle={column.title}
                    dashboardAssignees={assignees || []}
                    onCreate={refetch}
                />
            </Flex>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        minH={'calc(100vh - 300px)'}
                        h={'100%'}
                        borderRadius={4}
                        mt={4}

                    >
                        {column?.cards?.map((card, index) => (
                            <Card
                                {...card}
                                columnId={column.id}
                                order={index}
                                key={card.id}
                                dashboardAssignees={assignees || []}
                                refetchDashboard={refetch}
                            />
                        ))}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </Box>
    )
}