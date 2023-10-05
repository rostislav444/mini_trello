import {Box, Flex, Heading} from "@chakra-ui/react";
import {CreateCard} from "components/App/Dashboard/Columns/Card/Create";
import {Card} from "components/App/Dashboard/Columns/Card";
import {ColumnState} from "interfaces/dashboard";
import React, {useRef, useState} from "react";
import {ColumnDNDHooks} from "components/App/Dashboard/Columns/Column/hooks";

interface DashboardColumnsProps {
    column: ColumnState,
    assignees: {
        id: string,
        firstName: string
        email?: string | undefined;
    }[]
    bgColor: string,
    refetch: any,
    moveCard: any
}


export const Column = ({column, assignees, bgColor, refetch, moveCard}: DashboardColumnsProps) => {
    const cardRefs  = useRef<any>([])
    const [cards, setCards] = useState(column?.cards || [])
    const {canDrop, isOver, drop} = ColumnDNDHooks({column, cards, setCards, cardRefs})



    return (
        <Box minH={'calc(100vh - 220px)'} minW={'280px'} bg={bgColor} p={4} borderRadius={4} mr={4}>
            <Flex justifyContent="space-between" alignItems="center">
                <Heading size="md">
                    {canDrop ? column.title + ' drag' : column.title + ' drop'}
                </Heading>
                <CreateCard
                    columnId={column.id}
                    columnTitle={column.title}
                    dashboardAssignees={assignees || []}
                    onCreate={refetch}
                />
            </Flex>
            <Box
                p={2}
                minH={20}
                mt={4}
                ref={drop}
                role={'Dustbin'}
                style={{backgroundColor: isOver ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}}
            >
                {
                    cards.map((card, index) => {
                        if (cardRefs.current[index] === undefined) {
                            cardRefs.current[index] = React.createRef<HTMLDivElement>();
                        }

                        return <Card
                            outerRef={cardRefs.current[index]}
                            {...card}
                            columnId={column.id}
                            order={index}
                            key={index} dashboardAssignees={assignees || []}
                            moveCard={moveCard}
                        />
                    })
                }
            </Box>
        </Box>
    )
}