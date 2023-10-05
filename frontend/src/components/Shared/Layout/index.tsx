import {ReactNode} from 'react';
import {Grid, GridItem, Box} from "@chakra-ui/react";
import {Header} from "./Header";

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({children}) => {
    return <Box p={8}>
        <Header/>
        <div>
            {children}
        </div>
    </Box>
};

