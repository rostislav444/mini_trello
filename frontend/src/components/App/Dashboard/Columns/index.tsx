import {Flex, useColorMode, useColorModeValue} from "@chakra-ui/react";
import {DashboardState} from "interfaces/dashboard";
import {Column} from "components/App/Dashboard/Columns/Column";
import {DragDropContext} from "react-beautiful-dnd";
import {useGraphQL} from "context/graphqlConext";
import {client} from "utils/ApolloClient";
import {DASHBOARD_BY_ID} from "graphql/queries/getDashboardById";

interface DashboardColumnsProps {
    dashboard: DashboardState,
    refetch: any,
    networkStatus: any
}


export const DashboardColumns = ({dashboard, refetch}: DashboardColumnsProps) => {
    const {columns, assignees} = dashboard;
    const {reorderCardMutation} = useGraphQL();
    const totalColumns = columns?.length || 0;

    const applyReorder = (result: any) => {
        const {destination: dest, source} = result;

        // Start with a shallow copy of columns
        let newColumns = [...(dashboard.columns || [])];

        // Find source and destination columns
        const sourceColumn = newColumns.find(col => col.id === source.droppableId);
        const destColumn = newColumns.find(col => col.id === dest.droppableId);

        // Validate existence
        if (!sourceColumn || !sourceColumn.cards || !destColumn || !destColumn.cards) {
            return;
        }

        // Remove card from source column
        const [movedCard] = sourceColumn.cards.splice(source.index, 1);

        // Add the card to the destination column
        destColumn.cards.splice(dest.index, 0, movedCard);

        // Now update the Apollo cache
        client.writeQuery({
            query: DASHBOARD_BY_ID,
            variables: {dashboardId: dashboard.id},
            data: {
                ...dashboard,
                columns: newColumns
            }
        });
    };

    const saveReorder = async (result: any, variables: any) => {
        const response = await reorderCardMutation({variables});
        if (response.data?.reorderCard?.card?.id) {
            refetch();
        }
    }

    const handleOnDragEnd = (result: any) => {
        const {draggableId, destination, source} = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const variables = {
            cardId: draggableId,
            columnId: destination.droppableId,
            order: destination.index + 1
        }

        applyReorder(result);
        saveReorder(result, variables);

    };


    return <DragDropContext onDragEnd={handleOnDragEnd}>
        <Flex mt={6} overflowX={'auto'} alignItems="flex-start">{
            columns?.map((column, index) => (
                <Column
                    key={column.id}
                    column={column}
                    assignees={assignees || []}
                    refetch={refetch}
                    totalColumns={totalColumns}
                />
            ))
        }</Flex>
    </DragDropContext>
}