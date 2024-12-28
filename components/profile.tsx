import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { api_url, storage_url } from "@/utils/globalVariables"
import { logout } from "@/store/reducers/authReducer"
import { useRouter } from "next/navigation"
import IUser from "@/types/User"
import { AlertDestructive } from "./alerts/AlertDestructive"
import { AlertDefault } from "./alerts/AlertDefault"
import LoadingScreen from "./loading-screen"


export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user_id, access_token } = useSelector((state: RootState) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<IUser | null>(null);
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${api_url}/UserIdentity/${user_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    dispatch(logout());
                    router.replace("/auth");
                    return;
                }
                const data = await response.json();
                setUserData(data);
                setUsername(data.userName);
                setFirstName(data.firstName || "");
                setLastName(data.lastName || "");
                setEmail(data.email);
                setBio(data.bio || "");
                setProfileImage(data.profilePicture ?? null); // Set profile image on load if available
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleInputChange = async () => {
        setErrorMsg("");
        setSuccessMsg("");
        if (firstName === "" || lastName === "" || email === "") {
            setErrorMsg("First Name, Last Name, and Email are required");
            return;
        }
        try {
            const response = await fetch(`${api_url}/UserIdentity/${user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    userName: username,
                    email: email,
                    bio: bio
                })
            });
            if (!response.ok) {
                if (response.status === 401) {
                    dispatch(logout());
                    router.replace("/auth");
                    return;
                }
                const ErrorData = await response.json();
                console.log(ErrorData);
                setErrorMsg("Failed to update user data: " + ErrorData);
                return;
            }
            setSuccessMsg("User data updated successfully, please login to see changes");
            dispatch(logout());
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            if (file.size > 10 * 1024 * 1024) {
                setErrorMsg('File size exceeds the limit of 10MB.');
                return;
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setErrorMsg('Invalid file type. Please upload a valid image.');
                return;
            }
            try {
                const response = await fetch(`${api_url}/upload/upload-image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const result = await response.json();
                const fileName = result.filePath;
                console.log('Uploaded image:', result);
                const saveImageResponse = await fetch(`${api_url}/UserIdentity/${user_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        userName: username,
                        email: email,
                        bio: bio,
                        profilePicture: fileName
                    })
                });
                if (!saveImageResponse.ok) {
                    throw new Error('Failed to save image');
                }
                setSuccessMsg("Profile picture updated successfully");
                dispatch(logout());
            } catch (error) {
                console.error('Error uploading image:', error);
                setErrorMsg("Failed to upload profile picture");
            }
        }
    };

    return loading ? <LoadingScreen /> : !userData ? null : (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4">
                {errorMsg && <AlertDestructive message={errorMsg} />}
                {successMsg && <AlertDefault message={successMsg} />}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center mb-6">
                        <Avatar className="w-32 h-32 mb-4">
                            <AvatarImage src={profileImage ? `${storage_url}/${profileImage}`: undefined} alt={userData.userName} />
                            <AvatarFallback>{userData.userName[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {!isEditing && <h2 className="text-2xl font-semibold">{userData.userName}</h2>}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="mt-2"
                        >
                            Change Profile Picture
                        </Button>
                    </div>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    disabled={!isEditing}
                                    rows={4}
                                />
                            </div>
                        </div>
                        {isEditing ? (
                            <div className="mt-6 flex justify-end space-x-4">
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="submit" onClick={handleInputChange}>Save Changes</Button>
                            </div>
                        ) : (
                            <div className="mt-6 flex justify-end">
                                <Button type="button" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
