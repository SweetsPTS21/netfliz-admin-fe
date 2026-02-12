import { gql } from '@apollo/client'

export const GET_MOVIES_BY_FILTER = gql`
    query GetMoviesByFilter($request: MovieFilterRequest!) {
        getMoviesByFilter(request: $request) {
            page
            pageSize
            total
            totalPages
            items {
                id
                title
                year
                rated
                released
                runtime
                genre
                director
                writer
                actors
                plot
                languages
                countries
                awards
                metaScore
                imdbRating
                type
                categories
                images {
                    id
                    type
                    url
                }
                assets {
                    id
                    fileId
                    name
                    format
                    url
                    assetType
                    drm
                    renditions
                }
            }
        }
    }
`

export const GET_MOVIE_BY_ID = gql`
    query GetMovieById($id: ID!) {
        getMovieById(id: $id) {
            id
            title
            year
            rated
            released
            runtime
            genre
            director
            writer
            actors
            plot
            languages
            countries
            awards
            metaScore
            imdbRating
            type
            categories
            images {
                id
                type
                url
            }
            assets {
                id
                fileId
                name
                format
                url
                assetType
                drm
                renditions
            }
        }
    }
`

export const CREATE_MOVIE = gql`
    mutation CreateMovie($movie: MovieInput!) {
        createMovie(movie: $movie) {
            id
            title
            year
            rated
            released
            runtime
            genre
            director
            writer
            actors
            plot
            languages
            countries
            awards
            metaScore
            imdbRating
            type
            images {
                id
                type
                url
            }
            categories
        }
    }
`

export const CREATE_LIST_MOVIE = gql`
    mutation CreateListMovie($movies: [MovieInput!]!) {
        createListMovie(movies: $movies) {
            id
            title
            year
            rated
            released
            runtime
            genre
            director
            writer
            actors
            plot
            languages
            countries
            awards
            metaScore
            imdbRating
            type
            categories
        }
    }
`

export const UPDATE_MOVIE = gql`
    mutation UpdateMovie($id: ID!, $movie: MovieInput!) {
        updateMovie(id: $id, movie: $movie) {
            id
            title
            year
            rated
            released
            runtime
            genre
            director
            writer
            actors
            plot
            languages
            countries
            awards
            metaScore
            imdbRating
            type
            categories
            images {
                id
                type
                url
            }
            assets {
                id
                fileId
                name
                format
                url
                assetType
                drm
                renditions
            }
        }
    }
`

export const DELETE_MOVIE = gql`
    mutation DeleteMovie($id: ID!) {
        deleteMovie(id: $id)
    }
`
