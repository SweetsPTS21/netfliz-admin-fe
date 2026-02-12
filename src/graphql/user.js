import { gql } from '@apollo/client'

export const GET_ALL_USERS = gql`
    query GetAllUsers($request: UserFilterRequest!) {
        getAllUser(request: $request) {
            page
            pageSize
            total
            totalPages
            items {
                id
                email
                firstName
                lastName
                phone
                role
                status
                createdAt
            }
        }
    }
`

export const CREATE_USER = gql`
    mutation CreateUser($user: UserInput!) {
        createUser(user: $user) {
            id
            email
            firstName
            lastName
            role
            status
            createdAt
        }
    }
`

export const UPDATE_USER_BY_ID = gql`
    mutation UpdateUserById($id: ID!, $user: UserInput!) {
        updateUserById(id: $id, user: $user) {
            id
            email
            firstName
            lastName
            role
            status
            createdAt
        }
    }
`

export const DELETE_USER_BY_ID = gql`
    mutation DeleteUserById($id: ID!) {
        deleteUserById(id: $id)
    }
`
