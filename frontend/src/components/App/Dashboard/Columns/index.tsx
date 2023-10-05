import {Flex, useColorMode} from "@chakra-ui/react";
import {ColumnState} from "interfaces/dashboard";
import {Column} from "components/App/Dashboard/Columns/Column";
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

interface DashboardColumnsProps {
    columns: ColumnState[],
    assignees: {
        id: string,
        firstName: string
        email?: string | undefined;
    }[],
    refetch: any
}


export const DashboardColumns = ({columns, assignees, refetch}: DashboardColumnsProps) => {
    const {colorMode} = useColorMode();
    const bgColor = colorMode === "dark" ? "gray.700" : "gray.100";

    const moveCard = (props: any) => {
        console.log('props', props)
    };

    return <DndProvider backend={HTML5Backend}>
        <Flex mt={6} overflowX={'auto'} alignItems="flex-start">{
            columns.map((column, index) => (
                <Column key={index} column={column} assignees={assignees} bgColor={bgColor} refetch={refetch} moveCard={moveCard}/>
            ))
        }</Flex>
    </DndProvider>


}