import {extendTheme} from '@chakra-ui/react'
import {mode} from '@chakra-ui/theme-tools'
import type {StyleFunctionProps} from '@chakra-ui/styled-system'


const theme = extendTheme({
        config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
    styles: {
        global: (props: StyleFunctionProps) => ({
            body: {
                color: mode('gray.800', 'whiteAlpha.900')(props),
                bg: mode('gray.100', 'gray.800')(props),
            },
        }),
    },
    components: {
        Button: {
            variants: {
                ghost: (props: StyleFunctionProps) => ({
                    transitionProperty: 'none',
                    bg: mode('gray.200', 'gray.600')(props),
                    _hover: {
                        bg: mode('gray.200', 'gray.500')(props),
                    }
                })
            },
        },
        Menu: {
            baseStyle: (props: StyleFunctionProps) => ({
                transitionProperty: 'none',
                bg: mode('gray.200', 'gray.700')(props),
            }),
        },
    },
});

export default theme