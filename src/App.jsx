import { useState } from 'react'
import { useNavigate , Routes , Route } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { LOGIN, SIGNUP } from './grapgql/auth'
import Dashboard from './components/Dashboard'

function AuthPage() {
  const [isLogin, setIsLogin] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const [login, { loading: loginLoading }] = useMutation(LOGIN)
  const [signup, { loading: signupLoading }] = useMutation(SIGNUP)


  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      if (isLogin) {
        const { data } = await login({ variables: { email, password } })
        localStorage.setItem('token', data.login.token)
      } else {
        const { data } = await signup({ variables: { name, email, password } })
        localStorage.setItem('token', data.signup.token)
      }
      navigate('/dashboard')

    } catch (error) {
      setError(error.message)
    }

  }

  const loading = loginLoading || signupLoading

  return (
    <div>
      <h1>Task Manager</h1>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}
