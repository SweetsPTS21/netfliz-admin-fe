import { IMAGE_TYPE } from "@/constants/imageType"
import { stripTypename } from '@apollo/client/utilities'

export const mapMovieToFormValues = (movie) => {
    const allImages = stripTypeName(movie.images) || []
    const posters = allImages.filter((img) => img.type !== IMAGE_TYPE.GALLERY)
    const gallery = allImages.filter((img) => img.type === IMAGE_TYPE.GALLERY)
    return {
        ...movie,
        genre: movie.genre ? Array.isArray(movie.genre) ? movie.genre : movie.genre.split(',').map((g) => g.trim()) : [],
        languages: movie.languages ? Array.isArray(movie.languages) ? movie.languages : movie.languages.split(',').map((l) => l.trim()) : [],
        countries: movie.countries ? Array.isArray(movie.countries) ? movie.countries : movie.countries.split(',').map((c) => c.trim()) : [],
        posters: posters,
        gallery: gallery,
    }
}

export const mapFormValuesToMovie = (values) => {
    const { posters, gallery, ...rest } = values
    const images = [
        ...(Array.isArray(posters) ? posters : []),
        ...(Array.isArray(gallery) ? gallery : []),
    ]
    return {
        ...rest,
        images,
    }
}

export const stripTypeName = (images) => {
    return images.map((img) => stripTypename(img))
}