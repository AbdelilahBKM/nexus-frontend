"use client";
// src/hooks/useAuth.ts
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { loadAuthState } from "@/store/reducers/authReducer";

const useAuth = () => {
    const dispatch = useDispatch();
    const {isAuthenticated, user_id, username, email} = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(loadAuthState());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated !== undefined) {
            setLoading(false);
            if (!isAuthenticated) {
                router.replace("/auth");
            }
        }
    }, [isAuthenticated,user_id, username, router]);

    return { isAuth: isAuthenticated, user_id, username, email, loading };
};

export default useAuth;