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
import {MenuItem, Select, TextField, Typography} from "@mui/material";
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

type CustomizeDialogType = {
    addItem: (data: IFormInput, date: string) => void
}

enum CountryEnum {
    England = "England",
    Spain = "Spain",
    France = "France",

}

enum CityEnum {
    Barcelona = "Barcelona",
    Madrid = "Madrid",
    Paris = "Paris",
    Lyon = "Lyon",
    Berlin = "Berlin",
    Frankfurt = "Frankfurt",
    Munich = "Munich"
}

export interface IFormInput {
    courseName: string;
    courseId: string
    country: CountryEnum
    city: CityEnum;
    date: string
}

export const CustomizedCourseForm = (props: CustomizeDialogType) => {
    const {t} = useTranslation()
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const {register, handleSubmit, reset} = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = data => {
        let newDate = new Date();
        let date = String(newDate.getDate())
            .padStart(2, '0') + '/' + String(newDate.getMonth() + 1).padStart(2, '0') + '/' + newDate.getFullYear();
        props.addItem(data, date)
        reset({courseName: "", courseId: ""})
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                {t("button_add_course")}
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {t("button_add_course")}
                </BootstrapDialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent dividers>

                        <FormControl sx={{m: 1, mb: 2, minWidth: 250}}>
                            <Typography sx={{mb: 1}}>{t("course_title")}</Typography>
                            <TextField
                                variant="standard"
                                {...register("courseName", {required: true, maxLength: 50})} />
                        </FormControl>
                        <FormControl sx={{m: 1, mb: 2, minWidth: 250}}>
                            <Typography sx={{mb: 1}}>{t("course_id")}</Typography>
                            <TextField
                                variant="standard"
                                {...register("courseId")} />
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 250}}>
                            <Typography sx={{mb: 1}}>{t("country_selection")}</Typography>
                            <Select
                                variant="standard"
                                defaultValue={"Spain"}
                                {...register("country")} >
                                <MenuItem value="England">England</MenuItem>
                                <MenuItem value="Spain">Spain</MenuItem>
                                <MenuItem value="France">France</MenuItem>
                                <MenuItem value="Germany">Germany</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 250}}>
                            <Typography sx={{mb: 1}}>{t("city_selection")}</Typography>
                            <Select
                                variant="standard"
                                defaultValue={"Barcelona"}
                                {...register("city")} >
                                <MenuItem value="Barcelona">Barcelona</MenuItem>
                                <MenuItem value="Madrid">Madrid</MenuItem>
                                <MenuItem value="Paris">Paris</MenuItem>
                                <MenuItem value="Lyon">Lyon</MenuItem>
                                <MenuItem value="Berlin">Berlin</MenuItem>
                                <MenuItem value="Frankfurt">Frankfurt</MenuItem>
                                <MenuItem value="Munich">Munich</MenuItem>
                            </Select>
                        </FormControl>

                    </DialogContent>
                    <DialogActions>
                        <Button type="submit">
                            {t("button_submit_course")}
                        </Button>
                    </DialogActions>
                </form>
            </BootstrapDialog>
        </div>
    );
}
