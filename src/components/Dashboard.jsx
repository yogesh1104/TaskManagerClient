import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useQuery , useMutation} from '@apollo/client/react'
import {MY_TASKS , CREATE_TASK , UPDATE_TASK , DELETE_TASK} from '../grapgql/task'

export default function Dashboard() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const[error , setError] = useState('')

    const navigate = useNavigate()

    const {data , loading , error : queryError } = useQuery(MY_TASKS)
    const [createTask , {loading: createLoading}] = useMutation(CREATE_TASK , {
        refetchQueries : [{query : MY_TASKS}]
    })
    const [updateTask , {loading: updateLoading}] = useMutation(UPDATE_TASK , {
        refetchQueries : [{query : MY_TASKS}]
    })
    const [deleteTask , {loading: deleteLoading}] = useMutation(DELETE_TASK , {
        refetchQueries : [{query : MY_TASKS}]
    })

    async function handleCreate(e) {
        e.preventDefault()
        setError('')

        try {
            await createTask({ variables: { title, description } })
            setTitle('')
            setDescription('')
        } catch (error) {
            setError(error.message)
        }
    }

    async function handleToggle(task) {
        try{
            await updateTask({ variables: { id: task.id, completed: !task.completed } })
        } catch (error) {
            setError(error.message)
        }
    }

    async function handleDelete(id) {
        try{
            await deleteTask({ variables: { id } })
        } catch (error) {
            setError(error.message)
        }
    }

    async function handleLogout() {
        localStorage.removeItem('token')
        navigate('/')
    }
    
    if(loading) return <p>Loading...</p>
    if(queryError) return <p>Error: {queryError.message}</p>

    return(
        <div>
            <h1>My Tasks</h1>
            <button onClick={handleLogout}>Logout</button>
            <form onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit" disabled={createLoading}>{createLoading ? "Creating" : "Add Task"}</button>
            </form>

            {error && <p style={{color: 'red'}}>{error}</p>}

            <ul>
                {data.mytasks.map((task) => (
                    <li key={task.id}>
                        <span style={{textDecoration: task.completed ? 'line-through' : 'none'}}>
                            {task.title} - {task.description}
                        </span>
                        <button onClick={() => handleToggle(task)} disabled={updateLoading}>
                            {updateLoading ? "Updating" : task.completed ? "Mark Incomplete" : "Mark Complete"}
                        </button>
                        <button onClick={() => handleDelete(task.id)} disabled={deleteLoading}>
                            {deleteLoading ? "Deleting" : "Delete"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}