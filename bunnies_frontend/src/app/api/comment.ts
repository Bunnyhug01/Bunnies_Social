
// import { sfetch } from "./main"

// export interface CommentCreateRequest {
//     video: number,
//     text: string
// }

// export interface CommentReplaceRequest {
//     text?: string
// }

// export interface Comment {
//     id: number,
//     video: number,
//     author: number,
//     text: string
// }

// export async function getAll(): Promise<Comment[]>  {
//     return sfetch(`/comments`).then(resp => resp.json())
// }

// export async function getOne(id: number): Promise<Comment>  {
//     return sfetch(`/comments/${id}`).then(resp => resp.json())
// }

// export async function createOne(comment: CommentCreateRequest): Promise<Comment>  {
//     return sfetch(`/comments`, {
//         method: "POST",
//         body: JSON.stringify(comment),
//         headers: {
//             "Content-Type": "application/json",
//         }
//     }).then(resp => resp.json())
// }

// export async function deleteOne(id: number): Promise<Response> {
//     return sfetch(`/comments/${id}`, {
//         method: "DElETE"
//     })
// }

// export async function replaceOne(id: number, comment: CommentReplaceRequest): Promise<Comment> {
//     return sfetch(`/comments/${id}`, {
//         method: "PUT",
//         body: JSON.stringify(comment),
//         headers: {
//             "Content-Type": "application/json",
//         }
//     }).then(resp => resp.json())
// }

// export async function replaceText(id: number, text: string): Promise<Comment> {
//     return replaceOne(id, { text: text })
// }