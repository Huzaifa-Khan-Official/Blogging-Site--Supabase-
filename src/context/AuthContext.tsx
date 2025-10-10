'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getProfile } from '@/actions/login/actions'

interface AuthContextType {
    user: UserProfile | null
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setUser(null)
                setIsLoading(false)
                return
            }

            const profileData = await getProfile();
            if (profileData) {
                setUser(profileData)
            } else {
                setUser(null)
            }
            setIsLoading(false)
        }

        getSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!session) {
                    setUser(null)
                    setIsLoading(false)
                    return
                }

                const profileData = await getProfile();
                if (profileData) {
                    setUser(profileData)
                } else {
                    setUser(null)
                }
                setIsLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase])

    return (
        <AuthContext.Provider value={{ user, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)