import {useForm} from "react-hook-form";
import {
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    HStack,
    Input,
    Tag,
    TagCloseButton,
    TagLabel,
    Textarea,
    useColorMode
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {User} from "interfaces/user";
import {useGraphQL} from "../../../context/graphqlConext";
import {useUser} from "../../../context/userContext";
import {Assignee} from "components/UI/Form/Assignee";


interface SelectUser extends User {
    selected: boolean;
}


interface FormData {
    title: string;
    description?: string;
    assignee: string[]
};

export const CreateDashboard = () => {
    const {user} = useUser();
    const {
        usersListQuery,
        dashboardCreateMutation,
        dashboardListQuery
    } = useGraphQL();
    const {
        register,
        watch,
        handleSubmit,
        formState: {errors},
        setValue
    } = useForm<FormData>();
    const {colorMode} = useColorMode();
    const navigate = useNavigate();

    const [usersList, setUsersList] = useState<SelectUser[]>([]);
    const [columns, setColumns] = useState<string[]>(['To Do', 'In Progress', 'Done']);
    const [newColumn, setNewColumn] = useState<string>('');

    useEffect(() => {
        if (usersListQuery?.data?.users) {
            setUsersList(usersListQuery.data.users
                                       .filter((u: User) => u.id !== user?.id)
                                       .map((u: User) => ({...u, selected: false})));
        }
    }, [usersListQuery?.data?.users]);


    const onSubmit = async (data: FormData) => {
        try {
            const response = await dashboardCreateMutation({
                variables: {
                    title: data.title,
                    description: data.description,
                    assignees: usersList.filter(u => u.selected).map(u => u.id),
                    columns: columns
                }
            });
            const dashboardId = response?.data?.createDashboard.dashboard.id;
            if (dashboardId) {
                await dashboardListQuery.refetch();
                navigate(`/dashboard/${dashboardId}`);
            }
        } catch (error) {
            console.error('Error creating dashboard:', error);
        }
    }

    const handleRemoveColumn = (column: string) => {
        setColumns(columns.filter(col => col !== column));
    }

    const handleAddColumn = () => {
        if (newColumn === '') {
            return;
        }
        setColumns([...columns, newColumn]);
        setNewColumn('');
    }

    const handleCheckboxChange = (id: string, selected: boolean) => {
        const selectedUsers = usersList.map(user => {
            if (user.id === id) {
                return {...user, selected: !selected}
            }
            return user;
        })
        setUsersList(selectedUsers)
        setValue('assignee', selectedUsers.filter(user => user.selected)
                                          .map(user => user.id));
    }

    const handleSelectAllUsers = (value = true) => {
        const selectedUsers = usersList.map(user => ({...user, selected: value}))
        setUsersList(selectedUsers)
        setValue('assignee', selectedUsers.filter(user => user.selected)
                                          .map(user => user.id));
    }

    // box color transparent gray
    const bgColor = colorMode === "dark" ? "gray.700" : "gray.100";

    return <Box bg={bgColor} w='100%' mt={8} borderRadius='md' boxShadow='md' p='4'>
        <Heading size='lg' mb='4'>Create dashboard</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <FormControl id="columns" mb='4'>
                <FormLabel>Columns</FormLabel>
                <HStack spacing={4}>
                    {columns.map((col) => (
                        <Tag
                            size={'md'}
                            key={col.toLowerCase()}
                            borderRadius='full'
                            variant='solid'
                            colorScheme='blue'
                        >
                            <TagLabel>{col}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveColumn(col)}/>
                        </Tag>
                    ))}
                </HStack>

            </FormControl>
            <FormControl mb='4'>
                <Grid templateColumns="1fr 120px" gap={4}>
                    <Input
                        value={newColumn}
                        onChange={e => setNewColumn(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddColumn();
                            }
                        }}
                        placeholder='Add column'
                    />
                    <Button type="button" onClick={handleAddColumn} colorScheme="blue">Add</Button>
                </Grid>
            </FormControl>
            <Assignee assigneeList={usersList} setAssigneeList={setUsersList}/>
            <Button w="100%" type="submit" colorScheme="blue" mt='4'>Submit</Button>
        </form>
    </Box>
}
