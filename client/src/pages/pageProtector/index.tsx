import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

type props = {
    children: JSX.Element,
    redirectUrl?: string
}
const PageProtector = ({children, redirectUrl = "/signin"}: props) => {
    const { isAuthenticated } = useAuth();

    if(!isAuthenticated){
        return <Navigate to={redirectUrl}/>
    }
    return (
        <div>
            {children}
        </div>
    )
}
export default PageProtector;