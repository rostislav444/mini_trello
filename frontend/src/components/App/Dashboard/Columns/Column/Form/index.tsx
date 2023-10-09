import {useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    ModalBody,
    ModalFooter,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Textarea
} from "@chakra-ui/react";
import React from "react";
import {ColumnState} from "interfaces/column";
import {useGraphQL} from "context/graphqlConext";


interface FormData {
    id?: string;
    dashboardId: string;
    title: string;
    description?: string;
    order: number;
}

interface ColumnFormProps {
    onFulfilled: (data: any) => void;
    column?: ColumnState;
    create: boolean;
    totalColumns: number;
    onClose: any;
}


export const ColumnForm = ({onFulfilled, column, totalColumns, onClose, create = true}: ColumnFormProps) => {
    const {createColumnMutation, updateColumnMutation, deleteColumnMutation} = useGraphQL()
    const {dashboardId} = useParams();
    const {register, watch, handleSubmit, formState: {errors}, setValue} = useForm<FormData>({
        defaultValues: {
            dashboardId,
            title: column?.title || '',
            description: column?.description || '',
            order: create ? totalColumns + 1 : column?.order
        }
    })

    const watchOrder = watch('order');

    const onSubmit = async (data: FormData) => {
        const commonPayload = {
            title: data.title,
            description: data.description,
            order: data.order,
        };

        if (!onFulfilled) {
            throw new Error('onFulfilled is required');
        }

        if (create) {
            if (!dashboardId) {
                throw new Error('dashboardId is required');
            }

            const response = await createColumnMutation({
                variables: {
                    dashboardId,
                    ...commonPayload,
                }
            });

            if (response?.data?.createColumn?.column) {
                onFulfilled(response.data.createColumn.column.id);
            }
        } else {
            if (!column) {
                throw new Error('column is required');
            }

            const response = await updateColumnMutation({
                variables: {
                    id: column.id,
                    ...commonPayload,
                }
            });

            if (response?.data?.updateColumn?.column) {
                onFulfilled(response.data.updateColumn.column.id);
            }
        }
    }

    const handleDelete = async () => {
        if (!column) {
            throw new Error('column is required');
        }

        const response = await deleteColumnMutation({
            variables: {
                id: column.id,
            }
        });

        if (response.data?.deleteColumn?.column?.id) {
            onFulfilled(response.data.deleteColumn.column.id);
        }
    }


    return <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
            <FormControl isInvalid={!!errors.title} mb='3'>
                <FormLabel>Title</FormLabel>
                <Input {...register('title', {required: "Title is required"})} placeholder='Title'/>
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.description} mb='4'>
                <FormLabel>Description</FormLabel>
                <Textarea  {...register('description')} placeholder='Description'/>
                <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.order} mb='3'>
                <FormLabel>Position</FormLabel>
                <NumberInput defaultValue={watchOrder} min={1} max={create ? totalColumns + 1 : totalColumns}>
                    <NumberInputField {...register('order', {required: "Title is required"})}  />
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.order?.message}</FormErrorMessage>
            </FormControl>
        </ModalBody>
        <ModalFooter>
            {!create && <Button colorScheme='red' mr={3} onClick={handleDelete}>Delete</Button>}
            <Button type='submit' colorScheme='blue' mr={3}>
                {create ? 'Create' : 'Update'}
            </Button>
            <Button onClick={onClose} variant='ghost'>Close</Button>
        </ModalFooter>
    </form>
}