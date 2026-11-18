import { Fragment } from "react/jsx-runtime";
import SuggestBookPanelTemplate from "../../../component/Templates/SuggestBookPanelTemplate";
import { GetRecommendationData } from "../../../services/contents/bookRecommendatonService";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../Context/User/AuthContext";
import { RecommendationPanelItem } from "../../../services/contents/bookRecommendatonService";

interface IRecommendationPageConfig
{
    value: number;
    title: "Recommend For You" | "New Publish" | "Most Popular";
    data: RecommendationPanelItem[];
}

const useRecommendationPageConfig = () =>
{
    const { isAuthLoading, isLoggedIn } =  useAuthContext();
    const [panelsConfig, setPanelsConfig] = useState<IRecommendationPageConfig[]>([]);

    useEffect(() => 
    {   
        async function init()
        {
            const { recommendBooks, newPublishBooks, mostPopularBooks } = await GetRecommendationData(isLoggedIn);

            setPanelsConfig(
            [
                { value: 0, title: "Recommend For You", data: recommendBooks },
                { value: 1, title: "New Publish", data: newPublishBooks },
                { value: 2, title: "Most Popular", data: mostPopularBooks }
            ]);
        };

        if(!isAuthLoading)
        {
            init();
        }
    },[isAuthLoading, isLoggedIn]);

    return { panelsConfig };
};

const BookRecommendationPage = () => 
{   
    const { panelsConfig } = useRecommendationPageConfig();

    return(
        <Fragment>
        {
            panelsConfig.map((panel) => 
                (
                    <SuggestBookPanelTemplate key={panel.value} value={panel.value} title={panel.title} recommendationData={panel.data}/>
                )
            )
        }
        </Fragment>
    )
}

export default BookRecommendationPage