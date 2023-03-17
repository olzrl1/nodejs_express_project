import React from "react";
import { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { auth } from '../_actions/user_action';

export default function Auth(SpecificComponent, option, adminRoute = null){

    function AuthenticationCheck() {
        const dispatch = useDispatch();

        useEffect(() => {

            dispatch(auth()).then(response => {
                console.log(response)
                //로그인 하지 않은 상태 
                if (!response.payload.isAuth) {
                    if (option) {
                        document.location.href="/login"
                    }
                 } 
                else {
                    //로그인 한 상태 
                    if (adminRoute && !response.payload.isAdmin) {
                        document.location.href="/"
                    } 
                    else {
                        if (option === false)
                            document.location.href="/"
                    }
                }
            })
        }, [])
        
        return(
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}

