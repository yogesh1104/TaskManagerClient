import {gql} from '@apollo/client';

export const MY_TASKS = gql`
    query MyTasks {
        mytasks {
            id
            title
            description
            completed
            createdAt
            updatedAt
        }
    }
`;

export const CREATE_TASK = gql`
    mutation CreateTask($title: String!, $description: String!) {
        createTask(title: $title, description: $description) {
            id
            title
            description
            completed
            createdAt
            updatedAt
        }
    }
`;
    
export const UPDATE_TASK = gql`
    mutation UpdateTask($id: ID!, $title: String, $description: String, $completed: Boolean) {
        updateTask(id: $id, title: $title, description: $description, completed: $completed) {
            id
            title
            description
            completed
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_TASK = gql`
    mutation DeleteTask($id: ID!) {
        deleteTask(id: $id) {
            id
        }
    }
`;