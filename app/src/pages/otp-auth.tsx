import { useEffect, useState } from 'react';
import { OtpView } from 'src/sections/authentication/otp/otp-auth';
import { CONFIG } from 'src/config-global';
import { useRouter } from 'src/routes/hooks';

export default function Page() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [schoolCode, setSchoolCode] = useState<string | null>(null);

    useEffect(() => {
        const storedUsername = sessionStorage.getItem('otpUsername');
        if (!storedUsername) {
            // Redirect to login if username missing
            router.replace('/login');
            return;
        }
        
        // Get school_code from localStorage
        let storedSchoolCode = '';
        try {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            storedSchoolCode = userData.school_code || '';
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
        }
        
        // If school_code is not in localStorage, try to get it from sessionStorage
        if (!storedSchoolCode) {
            storedSchoolCode = sessionStorage.getItem('schoolCode') || '';
        }
        
        setUsername(storedUsername);
        setSchoolCode(storedSchoolCode);
    }, [router]);

    if (!username) return null; // nothing rendered while redirecting

    return (
        <>
            <title>{`OTP - ${CONFIG.appName}`}</title>
            <OtpView 
                username={username} 
                schoolCode={schoolCode || ''} // Pass schoolCode to OtpView
            />
        </>
    );
}