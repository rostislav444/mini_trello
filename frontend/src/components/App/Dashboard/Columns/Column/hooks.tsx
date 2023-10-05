import {useDrop} from "react-dnd";
import {ColumnState} from "interfaces/dashboard";


interface ColumnDNDHooksProps {
    column: ColumnState
    cards: any[]
    setCards: any
    cardRefs: any
}


export const ColumnDNDHooks = ({column, cards, setCards, cardRefs}: ColumnDNDHooksProps) => {
    const [{canDrop, isOver}, drop] = useDrop(() => ({
        accept: 'CARD',
        item: {id: column.id},
        drop: (item, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) {
                console.log('didDrop', item)
                return;
            }
            return {columnId: column.id, orderInColumn: 'column.cards.length'};
        },
        hover: (draggedItem: any, monitor: any) => {
            const initialOffset = monitor.getInitialSourceClientOffset();
            const dif = monitor.getDifferenceFromInitialOffset();
            const dragX = initialOffset.x + dif.x
            const dragY = initialOffset.y + dif.y

            let i = 0
            for (const ref of cardRefs.current) {
                const {x, y, height, width} = ref.current.getBoundingClientRect()

                if (i === 0) {
                    console.log('offset', {x, y, height, width})
                }

                i++
            }

            // const hoverPosition = monitor.getClientOffset();
            // const dif = monitor.getDifferenceFromInitialOffset();
            // console.log('hover', hoverPosition, dif)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));

    return {canDrop, isOver, drop}
}