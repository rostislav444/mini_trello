import {ColumnState} from "interfaces/column";
import {EditIcon} from "@chakra-ui/icons";
import React from "react";
import {Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure} from "@chakra-ui/react";
import {ColumnForm} from "components/App/Dashboard/Columns/Column/Form";


interface DashboardColumnsProps {
    column: ColumnState,
    refreshDashboard: any,
    totalColumns: number,
}


export const EditColumn = ({column, refreshDashboard, totalColumns}: DashboardColumnsProps) => {
    const {isOpen, onOpen, onClose} = useDisclosure()

    const onFulfilled = () => {
        refreshDashboard();
        onClose();
    }

    return <>
        <EditIcon ml={4} cursor='pointer' onClick={onOpen}/>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Edit column "{column.title}"</ModalHeader>
                <ModalCloseButton/>
                <ColumnForm column={column} onFulfilled={onFulfilled} create={false} totalColumns={totalColumns} onClose={onClose} />
            </ModalContent>
        </Modal>
    </>
}