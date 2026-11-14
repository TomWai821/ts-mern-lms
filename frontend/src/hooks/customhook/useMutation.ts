import { useContext } from "react";
import { useModal } from "../../Context/ModalContext";
import { AlertContext } from "../../Context/AlertContext";

type syncTask = () => Promise<void>;

export const useMutation = () => 
{
    const { handleClose } = useModal();
    const alertContext = useContext(AlertContext);

    const MutationFeedback = async (response: Response, result: any) => 
    {
        if (alertContext && alertContext.setAlertConfig) 
        {
            if(!response.ok)
            {
                alertContext.setAlertConfig({ AlertType: "error", Message: result.error as string });
                return;
            }

            alertContext.setAlertConfig({ AlertType: "success", Message: result.message as string });
            setTimeout(() => { handleClose() }, 2000);
        }
    }
    
    const executeMutationAndSync = async(response: Response, syncTasks: syncTask[] = []) =>
    {
        const wsUrl = process.env.NEXT_PUBLIC_WEB_SOCKET_SERVER;

        const isWsActive = Boolean( wsUrl && wsUrl !== "undefined" && wsUrl !== "null");

        if (response.ok && !isWsActive) 
        {
            await Promise.all(syncTasks.map(task => task()));
        }

        return response;
    }

    return {MutationFeedback, executeMutationAndSync}
}