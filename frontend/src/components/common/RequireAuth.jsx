import React, { useContext } from 'react'
import { AuthContext } from '../context/Auth'
import { Navigate } from 'react-router-dom'

export const RequireAuth = ({children}) => {
    const {user} = useContext(AuthContext);

    if(!user){
        return <Navigate to={"/account/login"}/>;
    }

    return children;
}

export const RequireAdmin = ({children}) => {
    const {user} = useContext(AuthContext);

    if(!user){
        return <Navigate to={"/account/login"}/>;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
    if(userInfo.role !== 'admin'){
        return <Navigate to={"/account/dashboard"}/>;
    }

    return children;
}

export const RequireStudent = ({children}) => {
    const {user} = useContext(AuthContext);

    if(!user){
        return <Navigate to={"/account/login"}/>;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
    if(userInfo.role !== 'student'){
        return <Navigate to={"/account/dashboard"}/>;
    }

    return children;
}
