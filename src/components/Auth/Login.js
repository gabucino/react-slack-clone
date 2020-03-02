import React, { Component } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import firebase from '../../firebase'

class Login extends Component {
    state = {
        email: '',
        password: '',
        errors: [],
        loading: false,
    }






    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)


    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    isFormValid = ({ email, password }) => email && password


    handleInputError = (errors, inputName) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(inputName)) ? 'error' : null
    }


    handleSubmit = event => {
        event.preventDefault()
        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true });
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log(signedInUser)
                    this.setState({ loading: false });
                })
                .catch(err => {
                    console.error(err)
                    this.setState({ errors: this.state.errors.concat(err), loading: false });
                })
        }
    }

    render() {
        const { email, password, errors, loading } = this.state
        return (
            <Grid textAlign='center' className="app" verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1" color="violet" textAlign="center">
                        <Icon name="puzzle piece" color="violet" />
                        Login to DevChat
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input
                                className={this.handleInputError(errors, 'email')} value={email} fluid name="email" icon="mail" iconPosition="left" placeholder="E-mail address" onChange={this.handleChange} type="text" />
                            <Form.Input className={this.handleInputError(errors, 'password')} value={password} fluid name="password" icon="lock" iconPosition="left" placeholder="Password" onChange={this.handleChange} type="password" />
                            <Button disabled={loading} className={loading ? 'loading' : null} color="violet" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Don't have an account?<Link to="/register"> Register</Link></Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login;