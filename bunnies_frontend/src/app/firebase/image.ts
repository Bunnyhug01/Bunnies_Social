

export interface ImageCreateRequest {
    title: string,
    details: string,
    imageUrl: string,
    isPrivate: boolean,
}

export interface ImageUpdateRequest {
    title?: string,
    details?: string,
    imageUrl?: string,
    isPrivate?: boolean,
}

export interface Image {
    id?: string,
    title: string,
    details: string,
    imageUrl: string,
    uploadDate: string,
    likes: number,
    dislikes: number,
    views: number,
    owner: string,
    isPrivate: boolean,
}