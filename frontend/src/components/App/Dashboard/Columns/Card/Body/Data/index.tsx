import {Button, Heading, HStack, ModalBody, ModalFooter, Tag, Text} from "@chakra-ui/react";
import React from "react";
import {CardState} from "interfaces/card";


export const CardBodyData = ({card, onClose}: { card: CardState, onClose: any }) => {
    return <>
        <ModalBody>
            <Heading size="sm">{card.title}</Heading>
            <Text mt={4}>{card.description}</Text>
            <HStack mt={4} spacing={4}>
                {card?.assignees?.map((assignee) => (
                    <Tag size={'md'} key={assignee.id} variant='solid' colorScheme='teal'>
                        {assignee.firstName}
                    </Tag>
                ))}
            </HStack>

        </ModalBody>
        <ModalFooter>
            <Button onClick={onClose} variant='ghost'>Close</Button>
        </ModalFooter>
    </>
}