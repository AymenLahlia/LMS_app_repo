import React, { useContext } from 'react'
import { AuthContext } from '../context/Auth'
import { Navigate as Navifigate } from 'react-router-dom'

export const RequireAuth = ({children}) => {
    const {user} = useContext(AuthContext);

    if(!user){
        return <Navifigate to={"/account/login"}/>;
    }

  return children;
}
