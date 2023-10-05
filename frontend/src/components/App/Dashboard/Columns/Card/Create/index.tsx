import {Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure,} from '@chakra-ui/react'
import React from "react";
import {CardForm} from "components/App/Dashboard/Columns/Card/Body/Form";
import {useNavigate} from "react-router-dom";


interface CreateCardProps {
    columnId: string;
    columnTitle: string;
    dashboardAssignees: {
        id: string;
        firstName: string;
    }[];
    onCreate: any;
}

interface FormData {
    title: string;
    description?: string;
    assignee: string[];
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
}


export const CreateCard = ({columnId, columnTitle, dashboardAssignees, onCreate}: CreateCardProps) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const navigate = useNavigate();

    const onFulfilled = (id: string) => {
        console.log('Card created: ', id)
        onCreate();
        onClose();
        if (id) {
            navigate(`card/${id}`)
        }
    }

    return (
        <>
            <Button onClick={onOpen}>+</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Add card in "{columnTitle}"</ModalHeader>
                    <ModalCloseButton/>
                    <CardForm
                        columnId={columnId}
                        usersList={dashboardAssignees.map(user => ({...user, selected: false}))}
                        onFulfilled={onFulfilled} create={true}
                        onClose={onClose}
                    />
                </ModalContent>
            </Modal>
        </>
    )
}

