import {useForm} from "react-hook-form";
import {Button, FormControl, FormErrorMessage, Textarea} from "@chakra-ui/react";
import React from "react";
import {useGraphQL} from "context/graphqlConext";


interface FormData {
    cardId: string;
    comment: string
}

interface CardCommentFormProps {
    cardId: string;
    refetchCard: any
}


export const CardCommentForm = ({cardId, refetchCard}: CardCommentFormProps) => {
    const {createCardCommentMutation} = useGraphQL()
    const {register, handleSubmit, formState: {errors}, setValue} = useForm<FormData>()

    const onSubmit = async (data: FormData) => {
        const response = await createCardCommentMutation({
            variables: {
                cardId: cardId,
                comment: data.comment
            }
        })
        if (response.data?.createCardComment) {
            refetchCard()
            setValue('comment', '')
        }
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.comment} mb='4'>
            <Textarea  {...register('comment', {required: 'Comment text is required'})} placeholder='Write your commetn here'/>
            <FormErrorMessage>{errors.comment?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
            <Button type='submit' colorScheme='blue' mr={3}>Send comment</Button>
        </FormControl>
    </form>


}