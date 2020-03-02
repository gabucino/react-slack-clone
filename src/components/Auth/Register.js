import React, { Component } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import md5 from 'md5'

import firebase from '../../firebase'

class Register extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    }

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return (
            !username.length ||
            !email.length ||
            !password.length ||
            !passwordConfirmation.length
        );
    };

    isFormValid = () => {
        let errors = []
        let error


        if (this.isFormEmpty(this.state)) {
            error = { message: 'Fill in all fields!' }
            this.setState({ errors: errors.concat(error) });
            return false
        } else if (!this.isPasswordValid(this.state)) {
            error = { message: 'Password is not valid' }
            this.setState({ errors: errors.concat(error) });
            return false
        } else {
            return true
        }
    }



    isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password.length < 6 || passwordConfirmation !== password) {
            return false
        } else {
            return true
        }
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)


    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        })
    }

    handleInputError = (errors, inputName) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(inputName)) ? 'error' : null
    }


    handleSubmit = event => {
        event.preventDefault()
        if (this.isFormValid()) {
            this.setState({ errors: [], loading: true });
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser)
                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    }).then(() => {
                        this.saveUser(createdUser).then(() => {
                            console.log('User saved')
                        })
                        this.setState({ loading: false });
                    }).catch(err => {
                        console.error(err)
                        this.setState({ errors: this.state.errors.concat(err), loading: false });
                    })
                })
                .catch(err => {
                    console.error(err)
                    this.setState({ errors: this.state.errors.concat(err), loading: false });

                })

        }
    }

    render() {
        const { username, email, password, passwordConfirmation, errors, loading } = this.state
        return (
            <Grid textAlign='center' className="app" verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1" color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                        Register for DevChat
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input
                                className={this.handleInputError(errors, 'email')} value={email} fluid name="email" icon="mail" iconPosition="left" placeholder="E-mail address" onChange={this.handleChange} type="text" />
                            <Form.Input className={this.handleInputError(errors, 'username')} value={username} fluid name="username" icon="user" iconPosition="left" placeholder="Username" onChange={this.handleChange} type="text" />
                            <Form.Input className={this.handleInputError(errors, 'password')} value={password} fluid name="password" icon="lock" iconPosition="left" placeholder="Password" onChange={this.handleChange} type="password" />
                            <Form.Input className={this.handleInputError(errors, 'passwordConfirmation')} value={passwordConfirmation} fluid name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="Repeat password" onChange={this.handleChange} type="password" />
                            <Button disabled={loading} className={loading ? 'loading' : null} color="orange" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Already a user?<Link to="/login"> Login</Link></Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Register;