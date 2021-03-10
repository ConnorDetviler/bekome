import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
    Box
} from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 300,
    },
    button: {
        justifyContent: 'center'
    }
  });

function UserCard({provider, questions}) {
    const classes = useStyles()

    return (
        <Card className={classes.root}>
            <CardMedia
            className={classes.media}
            image={provider.pic}
            />
            <CardContent>
                <Typography
                variant="h5"
                >
                    {provider.first_name + ' ' + provider.last_name}
                </Typography>

                <Typography>
                    {provider.pronouns}
                </Typography>

                <Typography>
                    {provider.location}
                </Typography>

                <Typography>
                    {provider.languages}
                </Typography>

                {provider.answers.map(answer => {
                    // find method finds the question that the provider has an answer to
                    const questionObj = questions.find(element => element.id === answer.questions_id)
                    return (
                        <Typography key={answer.questions_id}>
                            <b>{questionObj?.content} </b>
                            {answer.answer}
                        </Typography>
                    )
                })}
            </CardContent>
            <CardActions className={classes.button}>
                <Button size="small" color="primary">
                Full Profile
                </Button>
            </CardActions>
        </Card>
    )
}

export default UserCard;