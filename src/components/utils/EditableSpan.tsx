import React, {ChangeEvent, useState} from "react";
import {TextField} from "@mui/material";

type EditableSpanType = {
    title: string
    onChange: (newValue: string) => void
    disabled?: boolean
}
export const EditableSpan = React.memo((props: EditableSpanType) => {

    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState("")

    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.title)
    }
    const activateViewMode = () => {
        setEditMode(false)
        props.onChange(title)
    }

    const onChangeTitleForEditableName = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return (
        editMode ?
            <TextField
                disabled={props.disabled}
                size="small"
                variant="outlined"
                value={title}
                onBlur={activateViewMode}
                autoFocus
                onChange={onChangeTitleForEditableName}/>
            :
            <span onDoubleClick={activateEditMode}>{props.title}</span>
    )
})
