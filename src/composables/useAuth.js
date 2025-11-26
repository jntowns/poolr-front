import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import apiClient from '../utils/apiClient'
import { showToast } from '../utils/BaseToast'
import { useIdentityStore } from '../stores/identityStore'

export function useAuth() {
    const { t } = useI18n()
    const identityStore = useIdentityStore()
    const router = useRouter()

    const loginForm = reactive({
        email: '',
        password: ''
    })

    const registerForm = reactive({
        realName: '',
        username: '',
        phoneNumber: '',
        email: '',
        password: ''
    })

    const clearToken = () => {
        localStorage.removeItem('token')
    }

    const setAuthData = (data) => {
        localStorage.setItem('token', data.token)
        identityStore.setIdentity(data)
    }

    const login = async () => {
        if (!loginForm.email || !loginForm.password) {
            showToast(t('loginErrorMissingFields'), 'error')
            return false
        }

        try {
            clearToken()
            const response = await apiClient.post('/api/auth/login', loginForm)

            if (response.status !== 200) {
                throw new Error('Failed to login')
            }

            showToast(t('loginSuccess'), 'success')
            setAuthData(response.data)
            router.push('/')
            return true
        } catch (err) {
            console.error(err)
            showToast(t('loginErrorGeneral'), 'error')
            return false
        }
    }

    const register = async () => {
        const { realName, username, phoneNumber, email, password } = registerForm

        if (!realName || !username || !phoneNumber || !email || !password) {
            showToast(t('register.errorFillFields'), 'error')
            return false
        }

        try {
            clearToken()
            const response = await apiClient.post('/api/auth/register', registerForm)

            if (response.status !== 200) {
                throw new Error('Failed to register')
            }

            showToast(t('register.success'), 'success')
            setAuthData(response.data)
            router.push('/')
            return true
        } catch (err) {
            console.error(err)
            showToast(t('register.error'), 'error')
            return false
        }
    }

    const createDemoAccount = async () => {
        try {
            clearToken()
            const response = await apiClient.post('/api/auth/demo')

            if (response.status !== 200) {
                throw new Error('Failed to create demo account')
            }

            showToast(t('demo.toastSuccess'), 'success')
            setAuthData(response.data)
            router.push('/')
            return true
        } catch (err) {
            console.error(err)
            showToast(t('demo.toastError'), 'error')
            return false
        }
    }

    const resetForms = () => {
        loginForm.email = ''
        loginForm.password = ''
        registerForm.realName = ''
        registerForm.username = ''
        registerForm.phoneNumber = ''
        registerForm.email = ''
        registerForm.password = ''
    }

    return {
        loginForm,
        registerForm,
        login,
        register,
        createDemoAccount,
        resetForms
    }
}
