"use client"
import ProfilePage from "@/components/profile";
import useAuth from "@/hooks/authHook";
import { useEffect, useState } from "react";

const Profile = () => {
    const { isAuth } = useAuth();
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    if (!isAuth) {
        return null;
    }

    return isClient ? <ProfilePage /> : null;
};

export default Profile;