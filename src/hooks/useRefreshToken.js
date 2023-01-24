import { useDispatch, useSelector } from "react-redux";
import axios from "../api/axios";
import { authActions} from '../store/auth-slice'

const useRefreshToken = () => {
    const dispatch = useDispatch();
    // const accessToken = useSelector(state => state.auth.accessToken);

    const refresh = async () => {
        const response = await axios.get(`/refresh`, {
            // headers: {"Authorization" : `Bearer ${accessToken}`},
            withCredentials: true
        });

        if(response?.data?.success){
            console.log('new Token', response?.data?.data)
            dispatch(authActions.setToken(response?.data?.data))
        }

        return response.data.data;
    };

    return refresh;
};

export default useRefreshToken;