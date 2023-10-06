import {Box, Flex, Heading} from "@chakra-ui/react";
import {CreateCard} from "components/App/Dashboard/Columns/Card/Create";
import {Card} from "components/App/Dashboard/Columns/Card";
import {ColumnState} from "interfaces/dashboard";
import React from "react";
import {Droppable} from "react-beautiful-dnd";

interface DashboardColumnsProps {
    column: ColumnState,
    assignees: {
        id: string,
        firstName: string
        email?: string | undefined;
    }[]
    bgColor: string,
    refetch: any,
}


export const Column = ({column, assignees, bgColor, refetch}: DashboardColumnsProps) => {
    return (
        <Box minH={'calc(100vh - 220px)'} minW={'280px'} bg={bgColor} p={4} borderRadius={4} mr={4}>
            <Flex justifyContent="space-between" alignItems="center">
                <Heading size="md">
                    {column.title}
                </Heading>
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
                        backgroundColor={'whiteAlpha.50'}
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
                            />
                        ))}
                        {provided.placeholder}

                    </Box>
                )}
            </Droppable>
        </Box>
    )
}