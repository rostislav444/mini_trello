import {Button, Heading, Box, ModalBody, ModalFooter, Tag, Text} from "@chakra-ui/react";
import React from "react";
import {CardState} from "interfaces/card";


export const CardBodyData = ({card, onClose}: { card: CardState, onClose: any }) => {
    return <>
        <ModalBody>
            <Heading size="sm">{card.title}</Heading>
            <Text mt={4}>{card.description}</Text>
            <Box mt={4}>
                {card?.assignees?.map((assignee) => (
                    <Tag mr={2} mb={2} size={'md'} key={assignee.id} variant='solid' colorScheme='blue'>
                        {assignee.firstName}
                    </Tag>
                ))}
            </Box>

        </ModalBody>
        <ModalFooter>
            <Button onClick={onClose} variant='ghost'>Close</Button>
        </ModalFooter>
    </>
}