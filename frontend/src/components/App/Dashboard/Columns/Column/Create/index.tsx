import {Button, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {ColumnForm} from "components/App/Dashboard/Columns/Column/Form";

interface CreateColumnProps {
    refetch: any;
    totalColumns: number;
}


export const CreateColumn = ({refetch, totalColumns}: CreateColumnProps) => {
    const {isOpen, onOpen, onClose} = useDisclosure()

    const onFulfilled = () => {
        refetch();
        onClose();
    }

    return <>
        <Button colorScheme={'blue'} onClick={onOpen}>Add column</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Create column</ModalHeader>
                <ModalCloseButton/>
                <ColumnForm onFulfilled={onFulfilled} create={true} totalColumns={totalColumns} onClose={onClose} />
            </ModalContent>
        </Modal>
    </>
}