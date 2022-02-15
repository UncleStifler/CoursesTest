import axios, {AxiosResponse} from "axios";

export type CourseListType = {
    id: string
    title: string
    addedDate: string
    order: number
    city: string
    date: string,
    country: string,
    courseIdentifier: string
}

export type ResponseType<param = {}> = {
    resultCode: number
    messages: Array<string>
    data: param
}

export enum ModuleStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum ModulePriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type ModuleType = {
    description: string
    title: string
    status: ModuleStatuses
    priority: ModulePriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
    moduleId: string
    dateOfModule: string
}

// export type UpdateModuleModelType = {
//     title: string
//     description: string
//     status: ModuleStatuses
//     priority: ModulePriorities
//     startDate: string
//     deadline: string
// }


const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": "bd989617-b1e7-48f3-b931-dc63118fa1e9"
    }
}

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    ...settings
})

export const courseApi = {
    getCourses() {
        return instance.get<CourseListType[]>('/todo-lists')
    },
    createCourse(title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: CourseListType }>>>('/todo-lists', {title})
    },
    deleteCourse(todoListId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todoListId}`)
    },
    updateCourse(todoListId: string, title: string) {
        return instance.put<ResponseType>(`/todo-lists/${todoListId}`, {title: title})
    }
}

