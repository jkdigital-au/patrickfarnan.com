import React, { useState } from 'react';
import { Grid, List, ListItem, ListItemText, ListItemIcon, Typography, Alert, Container, Box } from '@mui/material';
import Input from '../core/Input';
import CustomButton from '../core/CustomButton';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { validateSubmit } from '../../helpers/validate';

const MailchimpForm = ({block, minimal, audience}) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        first: '',
        last: '',
        email: '',
        audience: (audience) ? audience : false
    });

    const handleSubmit = async (e) => {
        setError(false);
        setLoading(true)
        e.preventDefault();
    
        // Check All Fields Are Valid and Correct
        const formErrors = await validateSubmit(formData);

        if(formErrors.length > 0) {
            setError('All fields are required to sign up.')
            setLoading(false);
        } else {
            // Continue If Form is Valid 
            const addToMailchimp = async () => {
                const response = await fetch('.netlify/functions/addToMailchimp', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                return result;
            }

            const result = await addToMailchimp();

            if(result.result) {
                if(block.redirect) {
                    setSuccess('You\'ve successfully joined the email list!');
                    setTimeout(() => window.location.href = block.redirectUrl, 1000);
                } else {
                    setSuccess('You\'ve successfully joined the email list!');
                    setLoading(false);    
                }   
            } else {
                setLoading(false);
                setError('There was an error adding you to the email list. Please try again later.');
            }
        }
    }

    if(minimal) {
        return (
            <Box sx={{py: 4}}>
                <Typography variant="h3" children={block.title} gutterBottom />
                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Input setFormData={setFormData} label="First Name" name="first" validation="specialChars" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Input setFormData={setFormData} label="Last Name" name="last" validation="specialChars" />
                        </Grid>
                        <Grid item xs={12}>
                            <Input setFormData={setFormData} label="Email Address" name="email" validation="email" />
                        </Grid>
                        <Grid item xs={12}>
                            {(error) ? <Alert severity="error" children={error} sx={{mb: 2}} /> : ''}
                            {(success) ? <Alert severity="success" children={success} sx={{mb: 2}} /> : ''}
                            <CustomButton fullWidth size="large" submit loading={loading}>I'm In!</CustomButton>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        );
    } else {
        return (
            <>
                <Container sx={{py: 2}}>
                    <Typography align="center" variant="h3" children={block.title} />
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" children={(block.subtitle) ? block.subtitle : 'Type your details here...'} sx={{my: 2}} />
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Input setFormData={setFormData} label="First Name" name="first" validation="specialChars" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Input setFormData={setFormData} label="Last Name" name="last" validation="specialChars" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Input setFormData={setFormData} label="Email Address" name="email" validation="email" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {(error) ? <Alert severity="error" children={error} sx={{mb: 2}} /> : ''}
                                        {(success) ? <Alert severity="success" children={success} sx={{mb: 2}} /> : ''}
                                        <CustomButton fullWidth size="large" submit loading={loading}>I'm In!</CustomButton>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <DoubleArrowIcon sx={{color: 'primary.main'}} />
                                    </ListItemIcon>
                                    <ListItemText primary="Access to a community of like-minded people." />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <DoubleArrowIcon sx={{color: 'primary.main'}} />
                                    </ListItemIcon>
                                    <ListItemText primary="Access to content I don't post anywhere else." />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <DoubleArrowIcon sx={{color: 'primary.main'}} />
                                    </ListItemIcon>
                                    <ListItemText primary="Access to upcoming Masterclasses." />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <DoubleArrowIcon sx={{color: 'primary.main'}} />
                                    </ListItemIcon>
                                    <ListItemText primary="Live videos on new tips to raise your performance." />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </Container>
            </>
        );
    }
}

export default MailchimpForm;
