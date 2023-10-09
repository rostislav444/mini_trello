import {Button, Heading, Box, ModalBody, ModalFooter, Tag, Text, Flex} from "@chakra-ui/react";
import React from "react";
import {CardState} from "interfaces/card";
import {CardComments} from "components/App/Dashboard/Card/Body/Data/Comments";


interface CardBodyDataProps {
    card: CardState,
    onClose: any,
    refetchCard: any
}

export const CardBodyData = ({card, onClose, refetchCard}: CardBodyDataProps) => {
    return <>
        <ModalBody>
            <Heading size="xs">Description</Heading>
            <Text mt={2}>{card.description}</Text>
            <Box mt={4}>
                {card?.assignees?.map((assignee) => (
                    <Tag mr={2} mb={2} size={'md'} key={assignee.id} variant='solid' colorScheme='blue'>
                        {assignee.firstName}
                    </Tag>
                ))}
            </Box>
            <Flex mt={2} alignItems='center'>
                <Heading size="xs">Priority: </Heading>
                <Text ml={2}>{card.priority}</Text>
            </Flex>
            <CardComments cardId={card.id} comments={card?.comments || []} refetchCard={refetchCard} />
        </ModalBody>
        <ModalFooter>
            <Button onClick={onClose} variant='ghost'>Close</Button>
        </ModalFooter>
    </>
}