import React from 'react';
import {Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input} from '@chakra-ui/react';
import {useForm} from 'react-hook-form';
import {ColorModeSwitcher} from "components/UI/ColorModeSwitcher";
import {useUser} from "../../context/userContext";

type FormData = {
    email: string;
    password: string;
};

export const Login = () => {
    const {login} = useUser();
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>();


    const onSubmit = async (data: FormData) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            if (responseData.token) {
                login(responseData.user, responseData.token);
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <Box  w='100%' h='100vh' display='flex' justifyContent='center' alignItems='center'>
            <ColorModeSwitcher position='fixed' right={4} top={4} />
             <Box bg='whiteAlpha.50' w='400px' borderRadius='md' boxShadow='md' p='4'>
                <Heading size='lg' mb='4'>Login</Heading>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl id="email" isInvalid={!!errors.email} mb='2'>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" {...register('email', {required: "Email is required"})} placeholder='E-mail'/>
                        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl id="password" isInvalid={!!errors.password} mb='2'>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" {...register('password', {required: "Password is required"})} placeholder='Password'/>
                        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                    </FormControl>
                    <Button w="100%" type="submit" colorScheme="blue" mt='4'>Submit</Button>
                </form>
            </Box>
        </Box>
    );
};
