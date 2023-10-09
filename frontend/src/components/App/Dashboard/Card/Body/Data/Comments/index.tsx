import {CardCommentState} from "interfaces/cardCommets";
import {CardCommentForm} from "components/App/Dashboard/Card/Body/Data/Comments/Form";

import {Avatar, Box, Card, CardBody, CardHeader, Flex, Heading, Text, useColorModeValue} from "@chakra-ui/react";
import {DeleteIcon} from "@chakra-ui/icons";
import {useUser} from "context/userContext";
import {useGraphQL} from "context/graphqlConext";

interface CardCommentsProps {
    comments: CardCommentState[]
    cardId: string,
    refetchCard: any
}


export const CardComments = ({comments, cardId, refetchCard}: CardCommentsProps) => {
    const {user} = useUser()
    const {deleteCardCommentMutation} = useGraphQL()
    const bg = useColorModeValue('gray.100', 'whiteAlpha.100')

    const handleDelete = async (commentId: string) => {
        const response = await deleteCardCommentMutation({
            variables: {
                id: commentId
            }
        })
        if (response.data?.deleteCardComment) {
            refetchCard()
        }
    }

    return <Box mt={4}>
        <Heading size='xs' mb={4}>Comments ({comments.length}):</Heading>
        {comments.length ? <Box maxH={400} overflowY='auto' mt={4} mb={2}>
            {comments.map(comment => {
                const timeNormalized = new Date(comment.createdAt).toLocaleString()
                return <Card maxW='md' mb={2} bg={bg}>
                    <CardHeader p={3} pb={2}>
                        <Flex>
                            <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                                <Avatar size={'sm'} name={`${comment.user.firstName} ${comment.user.lastName}`}/>
                                <Box>
                                    <Heading size='sm'>{comment.user.firstName} {comment.user.lastName}</Heading>
                                    <Text fontSize='xs'>{timeNormalized}</Text>
                                </Box>
                            </Flex>
                            {
                                user?.id === comment.user.id && <DeleteIcon onClick={() => handleDelete(comment.id)} cursor='pointer'/>
                            }
                        </Flex>
                    </CardHeader>
                    <CardBody p={3} pt={0}>
                        <Text>{comment.comment}</Text>
                    </CardBody>
                </Card>
            })}
        </Box> : null}
        <CardCommentForm cardId={cardId} refetchCard={refetchCard}/>
    </Box>
}