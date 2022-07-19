import { Navigate } from "react-router-dom";

type props = {
    children: JSX.Element,
    redirectUrl?: string
}
const PageProtector = ({children, redirectUrl = "/signin"}: props) => {
    // verifica se esta logado
    const is_authenticated = false;

    if(!is_authenticated){
        return <Navigate to={redirectUrl}/>
    }
    
    return (
        <div>
            {children}
        </div>
    )
}
export default PageProtector;