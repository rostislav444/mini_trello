import {CardState} from "interfaces/card";
import {useForm} from "react-hook-form";
import {Button, FormControl, FormErrorMessage, FormLabel, Input, ModalBody, ModalFooter, Radio, RadioGroup, Stack, Textarea} from "@chakra-ui/react";
import {Assignee} from "components/UI/Form/Assignee";
import React from "react";
import {useGraphQL} from "context/graphqlConext";


interface FormData {
    id?: string;
    title: string;
    description?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    assignee: string[];
}

interface CardBodyFormProps {
    card?: CardState;
    columnId?: string;
    usersList: any[];
    onFulfilled: (id: any) => void;
    create: boolean;
    onClose?: any;
}


export const CardForm = ({card, columnId, usersList, onFulfilled, create = true, onClose}: CardBodyFormProps) => {
    const {createCardMutation, updateCardMutation} = useGraphQL()
    const {register, watch, handleSubmit, formState: {errors}, setValue} = useForm<FormData>({
        defaultValues: {
            title: card?.title || '',
            description: card?.description || '',
            priority: card?.priority || 'LOW',
            assignee: card?.assignees?.map(assignee => assignee.id) || []
        }
    })

    const [assignees, setAssignees] = React.useState<any[]>(
        usersList.map(user => ({...user, selected: create ? false : card?.assignees?.some(assignee => assignee.id === user.id)}))
    );
    const priorities = [
        ['LOW', 'blue'], ['MEDIUM', 'green'], ['HIGH', 'red']
    ]
    const formData = watch();


    const onSubmit = async (data: FormData) => {
        const commonPayload = {
            title: data.title,
            description: data.description,
            assignees: assignees.filter(user => user.selected)
                                .map(user => user.id),
            priority: data.priority
        };

        let response;

        if (create) {
            if (!columnId) {
                throw new Error('ColumnId is required');
            }
            // Call the createCardMutation with the payload
            response = await createCardMutation({
                variables: {
                    columnId: columnId, // Assuming columnId exists on the card object
                    ...commonPayload
                }
            });
        } else {
            if (!card?.id) {
                throw new Error('CardId is required');
            }
            // Call the updateCardMutation with the payload and cardId
            response = await updateCardMutation({
                variables: {
                    cardId: card?.id,
                    ...commonPayload
                }
            });
        }

        if (!onFulfilled) {
            throw new Error('onFulfilled is required');
        }

        if (response.data) {
            onFulfilled(response.data.createCard.card.id);
        }
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
            <FormControl id="email" isInvalid={!!errors.title} mb='3'>
                <FormLabel>Title</FormLabel>
                <Input {...register('title', {required: "Title is required"})} placeholder='Title'/>
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl id="description" isInvalid={!!errors.description} mb='4'>
                <FormLabel>Description</FormLabel>
                <Textarea  {...register('description')} placeholder='Description'/>
                <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
            </FormControl>
            <FormControl id="description" isInvalid={!!errors.description} mb='4'>
                <FormLabel>Priorities</FormLabel>
                <RadioGroup value={formData.priority}>
                    <Stack direction='row'>{
                        priorities.map(p => <Radio key={p[0]} colorScheme={p[1]} {...register('priority')} value={p[0]}>{p[0]}</Radio>)
                    }</Stack>
                </RadioGroup>
            </FormControl>
            <Assignee assigneeList={assignees} setAssigneeList={setAssignees}/>
        </ModalBody>
        <ModalFooter>
            <Button type='submit' colorScheme='blue' mr={3}>
                {create ? 'Create' : 'Update'}
            </Button>
            <Button onClick={onClose} variant='ghost'>Close</Button>
        </ModalFooter>
    </form>
}