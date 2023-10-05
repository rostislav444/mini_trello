import {CardState} from "interfaces/card";
import {Box, Flex, FormControl, FormLabel, Heading, Modal, ModalContent, ModalHeader, ModalOverlay, Switch} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {COLUMN_CARD} from "graphql/queries/getColumnCards";
import {useLazyQuery} from "@apollo/client";
import {CardBodyData} from "components/App/Dashboard/Columns/Card/Body/Data";
import {CardForm} from "components/App/Dashboard/Columns/Card/Body/Form";
import {useNavigate, useParams} from "react-router-dom";
import {useDrag} from 'react-dnd';


interface CardProps extends CardState {
    dashboardAssignees: {
        id: string;
        firstName: string;
    }[];
    moveCard: any;
    columnId: string;
    order: number;
    outerRef: any;
}

export const Card = ({id, columnId, order, title, dashboardAssignees, moveCard, outerRef}: CardProps) => {
    const navigate = useNavigate();
    const {cardId} = useParams();
    const [loadCard, {loading, error, data, refetch}] = useLazyQuery(COLUMN_CARD, {variables: {cardId: id}})
    const [card, setCard] = React.useState<CardState | null>(null)
    const [editMode, setEditMode] = React.useState<boolean>(false)

    const [{isDragging}, drag, dragPreview] = useDrag(() => ({
        type: 'CARD',
        item: {id, columnId, order, ref: outerRef},
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();

            if (item && dropResult) {
                moveCard(item);
            }
        },
        hover: (draggedItem: any, monitor: any) => {
            console.log('Card hover')
        },

        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }));


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

    return <>
        <div ref={dragPreview} style={{opacity: isDragging ? 0.5 : 1}}>
            <div ref={outerRef}>
                <Box cursor='pointer' onClick={onOpen} bg={'whiteAlpha.50'} p={4} borderRadius={4} mb={2} role="Handle" ref={drag}>
                    <Heading size="sm">{title}</Heading>
                </Box>
            </div>
        </div>


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
