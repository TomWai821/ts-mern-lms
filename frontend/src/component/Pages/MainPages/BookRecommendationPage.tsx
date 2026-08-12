import { Fragment } from "react/jsx-runtime";
import { useRecommendBookContext } from "../../../Context/Book/RecommendBookContext";
import SuggestBookPanelTemplate from "../../Templates/SuggestBookPanelTemplate";

const BookRecommendationPage = () => 
{
    const { suggestBook } = useRecommendBookContext();
    
    const titles = ["Recommand For You", "New Publish", "Most Popular"];

    return(
        <Fragment>
        {
            titles.map((title, index) => 
                (
                    <SuggestBookPanelTemplate key={index} value={index} title={title} data={suggestBook[index]}/>
                )
            )
        }
        </Fragment>
    )
}

export default BookRecommendationPage