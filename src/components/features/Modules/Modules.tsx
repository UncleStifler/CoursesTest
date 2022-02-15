import React, {ChangeEvent, useCallback} from "react";
import {EditableSpan} from "../../utils/EditableSpan";
import {Delete} from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import {ModuleStatuses, ModuleType} from "../../api/course-api";
import {RequestStatusType} from "../../app/app-reducer";

type ModulePropsType = {
    module: ModuleType
    courseId: string
    moduleId: string
    dateOfModule: string
    removeModule: (idTasks: string, todolistId: string) => void
    changeStatusCheckbox: (tasksID: string, status: ModuleStatuses, todoListId: string) => void
    changeModuleTitle: (id: string, newValue: string, todoListId: string) => void
    entityStatus: RequestStatusType
    entityTaskStatus: RequestStatusType
}

export const Modules = React.memo((props: ModulePropsType) => {

    const {
        module, courseId, changeStatusCheckbox, changeModuleTitle, removeModule,
        entityTaskStatus, moduleId, dateOfModule
    } = props

    const onRemoveHandler = useCallback(() => removeModule(module.id, courseId),
        [module.id, courseId, removeModule])

    const onChangeHandlerCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        changeStatusCheckbox(module.id, newIsDoneValue ?
            ModuleStatuses.Completed : ModuleStatuses.New, courseId)
    }

    const onChangeTitleHandler = useCallback((newValue: string) => {
        changeModuleTitle(module.id, newValue, courseId)
    }, [module.id, changeModuleTitle, courseId])

    return (
        <li key={module.id}
            className={`commonClassName ${module.status === ModuleStatuses.Completed ? "is-done" : ""}`}>
            <Checkbox
                disabled={entityTaskStatus === 'loading'}
                color="success"
                onChange={onChangeHandlerCheckbox}
                checked={module.status === ModuleStatuses.Completed}
            />
            <EditableSpan
                disabled={entityTaskStatus === 'loading'}
                title={`
                ${module.title} 
                ${moduleId ? moduleId : ""} 
                ${dateOfModule ? dateOfModule : ""}`}
                onChange={onChangeTitleHandler}/>
            <IconButton
                disabled={entityTaskStatus === 'loading'}
                style={{marginLeft: "5px"}}
                onClick={onRemoveHandler}>
                <Delete fontSize={"small"}/>
            </IconButton>
        </li>
    );
});
