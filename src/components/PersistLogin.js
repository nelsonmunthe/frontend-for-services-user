import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import { useSelector } from "react-redux";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const accessToken = useSelector(state =>  state.auth.accessToken);

    useEffect(() => {
        let isMounted = true;
        
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        // persist added here AFTER tutorial video
        // Avoids unwanted call to verifyRefreshToken
        if(!accessToken) {
            verifyRefreshToken()
        }  else {

            setIsLoading(false);
        }

        return () => isMounted = false;

    }, [accessToken, refresh])

    return (
        <>
            {!accessToken
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin