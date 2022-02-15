import axios, {AxiosResponse} from "axios";
import {ResponseType, ModulePriorities, ModuleStatuses, ModuleType} from "./course-api";

export type UpdateModuleType = {
    title: string
    description: string
    status: ModuleStatuses
    priority: ModulePriorities
    startDate: string
    deadline: string
}

type getModulesListResponse = {
    error: string| null
    totalCount: number
    items: ModuleType[]
    resultCode: number
    messages: string[]
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/todo-lists',
    withCredentials: true,
    headers: {
        'API-KEY': 'bd989617-b1e7-48f3-b931-dc63118fa1e9'
    }
})

export const modulesListsAPI = {
    getModules(todoListId: string) {
        return instance.get<getModulesListResponse>(`${todoListId}/tasks`)
    },
    createModule(todoListId: string, title: string) {
        return instance.post(`${todoListId}/tasks`, {title: title})
    },
    deleteModule(todoListId: string, taskId: string) {
        return instance.delete<ResponseType>(`${todoListId}/tasks/${taskId}`)
    },
    updateModule(todoListId: string, taskId: string, model: UpdateModuleType) {
        return instance.put<UpdateModuleType, AxiosResponse<ResponseType<{ item: ModuleType }>>>(`${todoListId}/tasks/${taskId}`, model)
    }
}
