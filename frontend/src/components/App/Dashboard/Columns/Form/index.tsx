import {useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {ColumnState} from "interfaces/dashboard";


interface FormData {
    dashboardId: string;
    title: string;
}

interface ColumnFormProps {
    onFulfilled: (data: any) => void;
    column?: ColumnState;
    create: boolean;
    totalColumns: number;
}


export const ColumnForm = ({onFulfilled, column, totalColumns, create=true }: ColumnFormProps) => {
     const {dashboardId} = useParams();
     const {register, watch, handleSubmit, formState: {errors}, setValue} = useForm<FormData>({
        defaultValues: {
            dashboardId,
            title: column?.title || '',
        }
    })

    const onSubmit = async (data: FormData) => {
        const commonPayload = {
            title: data.title,
        };

        if (!onFulfilled) {
            throw new Error('onFulfilled is required');
        }

        let response;

        if (create) {
            response = await onFulfilled(commonPayload);
        } else {
            response = await onFulfilled({...commonPayload, id: column?.id});
        }


    }


    return <form>

    </form>
}