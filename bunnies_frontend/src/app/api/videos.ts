
// import { sfetch } from "./main"

// export interface VideoCreateRequest {
//     logoUrl: string,
//     title: string,
//     detail: string,
//     videoUrl: string,
//     isPrivate: boolean,
// }

// export interface VideoReplaceRequest {
//     title?: string,
//     detail?: string,

//     logoUrl?: string,
//     videoUrl?: string,
    
//     isPrivate?: boolean,
// }

// export interface Video {
//     id: number,
//     logoUrl: string,
//     title: string,
//     detail: string,
//     videoUrl: string,
//     uploadDate: Date,
//     likes: number,
//     dislikes: number,
//     views: number,
//     owner: number,
//     isPrivate: boolean,
// }

// export async function getAll(): Promise<Video[]>  {
//     return sfetch(`/videos`).then(resp => resp.json())
// }

// export async function getOne(id: number): Promise<Video> {
//     return sfetch(`/videos/${id}`).then(resp => resp.json())
// }

// export async function deleteOne(id: number): Promise<Response> {
//     return sfetch(`/videos/${id}`, {
//         method: "DELETE"
//     })
// }

// export async function createOne(video: VideoCreateRequest): Promise<Video> {
//     return sfetch(`/videos`, {
//         method: "POST",
//         body: JSON.stringify(video),
//         headers: {
//             "Content-Type": "application/json",
//         }
//     }).then(resp => resp.json())
// }

// export async function replaceOne(id: number, video: VideoReplaceRequest): Promise<Video> {
//     return sfetch(`/videos/${id}`, {
//         method: "PUT",
//         body: JSON.stringify(video),
//         headers: {
//             "Content-Type": "application/json",
//         }
//     }).then(resp => resp.json())
// }

// export async function replaceTitle(id: number, title: string): Promise<Video> {
//     return replaceOne(id, { title: title })
// }

// export async function setLike(video: number): Promise<Response> {
//     return sfetch(`/likes/${video}`, {
//         method: "POST"
//     })
// }

// export async function setDisLike(video: number): Promise<Response> {
//     return sfetch(`/dislikes/${video}`, {
//         method: "POST"
//     })
// }
// export async function removeLike(video: number): Promise<Response> {
//     return sfetch(`/likes/${video}`, {
//         method: "DELETE"
//     })
// }

// export async function removeDisLike(video: number): Promise<Response> {
//     return sfetch(`/dislikes/${video}`, {
//         method: "DELETE"
//     })
// }

// export async function hasLike(video: number): Promise<boolean> {
//     return sfetch(`/likes/${video}`).then(resp => resp.json()).then(json => json["status"])
// }

// export async function hasDisLike(video: number): Promise<boolean> {
//     return sfetch(`/dislikes/${video}`).then(resp => resp.json()).then(json => json["status"])
// }

