import * as React from 'react';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {SubmitHandler, useForm} from "react-hook-form";
import {TextField, Typography} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {useTranslation} from "react-i18next";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle sx={{m: 0, p: 2}} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

type FromNewModuleType = {
    addModuleForAddItem: (dataModule: ModuleFormInput, dateOfModule: string) => void
}

export interface ModuleFormInput {
    moduleName: string;
    moduleId: string
    date: string
}

export const NewModuleForm = (props: FromNewModuleType) =>  {
    const {t} = useTranslation()
    const [openForm, setOpenForm] = React.useState(false);

    const handleClickOpen = () => {
        setOpenForm(true);
    };
    const handleClose = () => {
        setOpenForm(false);
    };

    const {register, handleSubmit, reset} = useForm<ModuleFormInput>();
    const onSubmit: SubmitHandler<ModuleFormInput> = dataModule => {
        let newDate = new Date();
        let dateOfModule = String(newDate.getDate())
            .padStart(2, '0') + '/' + String(newDate.getMonth() + 1).padStart(2, '0') + '/' + newDate.getFullYear();
        props.addModuleForAddItem(dataModule, dateOfModule)
        reset({moduleName: "", moduleId: ""})
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                {t("button_add_module")}
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openForm}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {t("button_add_module")}
                </BootstrapDialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent dividers>
                        <FormControl sx={{m: 1, mb: 2, minWidth: 250}}>
                            <Typography sx={{mb: 1}}>{t("module_title")}</Typography>
                            <TextField
                                variant="standard"
                                {...register("moduleName", { required: true, maxLength: 50 })} />
                        </FormControl>
                        <FormControl sx={{m: 1, mb: 2,  minWidth: 250}}>
                            <Typography sx={{mb: 1}}>{t("module_id")}</Typography>
                            <TextField
                                variant="standard"
                                {...register("moduleId", {required: true, maxLength: 50})} />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit">
                            {t("button_submit_module")}
                        </Button>
                    </DialogActions>
                </form>
            </BootstrapDialog>
        </div>
    );
}
