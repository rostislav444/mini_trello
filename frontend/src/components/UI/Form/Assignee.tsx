import {Button, Checkbox, CheckboxGroup, Flex, FormControl, FormErrorMessage, FormLabel, Grid, GridItem} from "@chakra-ui/react";
import React from "react";


interface SelectUser {
    id: string;
    firstName: string;
    lastName: string;
    selected: boolean;
}

interface AssigneeProps {
    assigneeList: SelectUser[];
    setAssigneeList: any
}

export const Assignee = ({assigneeList, setAssigneeList}: AssigneeProps) => {
    const handleCheckboxChange = (id: string, selected: boolean) => {
        const newAssigneeList = assigneeList.map(a => {
            if (a.id === id) {
                return {
                    ...a,
                    selected: !selected
                }
            }
            return a;
        })
        setAssigneeList(newAssigneeList)
    }

    const handleSelectAllUsers = (selected: boolean) => {
        const newAssigneeList = assigneeList.map(a => {
            return {
                ...a,
                selected
            }
        })
        setAssigneeList(newAssigneeList)
    }

    return <FormControl id="assignee"  mb='4'>
        <Flex mb='2'>
            <FormLabel mt={1}>Assignee</FormLabel>
            <Button size='xs' ml='auto' onClick={() => handleSelectAllUsers(true)}>Select all</Button>
            <Button size='xs' ml='2' onClick={() => handleSelectAllUsers(false)}>Deselect all</Button>
        </Flex>
        <CheckboxGroup colorScheme='blue'>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                {
                    assigneeList.map(u =>
                        <GridItem key={u.id}>
                            <Checkbox onChange={() => handleCheckboxChange(u.id, u.selected)} isChecked={u.selected}>
                                {u.firstName} {u.lastName}
                            </Checkbox>
                        </GridItem>
                    )
                }
            </Grid>
        </CheckboxGroup>
    </FormControl>
}