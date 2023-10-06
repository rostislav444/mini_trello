import {CardState} from "interfaces/card";
import {Box, Flex, FormControl, FormLabel, Grid, GridItem, Heading, Modal, ModalContent, ModalHeader, ModalOverlay, Switch, Icon} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {COLUMN_CARD} from "graphql/queries/getColumnCards";
import {useLazyQuery} from "@apollo/client";
import {CardBodyData} from "components/App/Dashboard/Columns/Card/Body/Data";
import {CardForm} from "components/App/Dashboard/Columns/Card/Body/Form";
import {useNavigate, useParams} from "react-router-dom";
import {Draggable} from "react-beautiful-dnd";
import {CircleIcon} from "components/UI/Icons";


interface CardProps extends CardState {
    dashboardAssignees: {
        id: string;
        firstName: string;
    }[];
    columnId: string;
    order: number;
}

export const Card = ({id, columnId, order, title, priority, dashboardAssignees}: CardProps) => {
    const navigate = useNavigate();
    const {cardId} = useParams();
    const [loadCard, {loading, error, data, refetch}] = useLazyQuery(COLUMN_CARD, {variables: {cardId: id}})
    const [card, setCard] = React.useState<CardState | null>(null)
    const [editMode, setEditMode] = React.useState<boolean>(false)


    useEffect(() => {
        if (cardId === id) loadCard()
    }, [cardId, id])

    useEffect(() => {
        if (data) setCard(data.card)
    }, [data]);

    const onFulfilled = () => {
        refetch()
        setEditMode(false)
    }

    const onOpen = () => navigate(`card/${id}`)
    const onClose = () => navigate(``)


    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'LOW':
                return 'green.500'
            case 'MEDIUM':
                return 'yellow.500'
            case 'HIGH':
                return 'red.500'
            default:
                return 'gray.500'
        }
    }

    return <>
        <Draggable draggableId={id} index={order}>
            {(provided) => (
                <Grid
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    cursor='pointer'
                    onClick={onOpen}
                    bg={'whiteAlpha.50'}
                    p={4}
                    borderRadius={4}
                    mb={2}
                    gridTemplateColumns='1fr 12px'
                >
                    <GridItem>
                         <Heading size="sm">{title}</Heading>
                    </GridItem>
                    <GridItem>
                        <CircleIcon color={getPriorityColor(priority)} />
                    </GridItem>
                </Grid>
            )}
        </Draggable>

        <Modal isOpen={cardId === id} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Heading size="md">{card?.title || title}</Heading>
                        <Box>
                            <FormControl display='flex' alignItems={'center'}>
                                <FormLabel mb='0'>
                                    {editMode ? 'Edit' : 'View'}
                                </FormLabel>
                                <Switch onChange={() => setEditMode(!editMode)}/>
                            </FormControl>
                        </Box>
                    </Flex>
                </ModalHeader>
                {card ? <Box>
                    {editMode ?
                        // TO DO integrate usersList in update function to select assignees
                        <CardForm card={card} usersList={dashboardAssignees} onFulfilled={onFulfilled} create={false} onClose={onClose}/> :
                        <CardBodyData card={card} onClose={onClose}/>
                    }
                </Box> : <p>Loading...</p>}
            </ModalContent>
        </Modal>
    </>
}
