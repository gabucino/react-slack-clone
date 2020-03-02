import React, { Component } from 'react';
import { Grid, Header, Icon, Button, Input, Dropdown, Image, Modal } from 'semantic-ui-react'
import firebase from '../../firebase'
import { connect } from 'react-redux'
import AvatarEditor from 'react-avatar-editor'

class UserPanel extends Component {
    state = {
        user: this.props.currentUser,
        modal: false,
        previewImage: '',
        croppedImage: '',
        blob: '',
        uploadedCroppedImage: '',
        storageRef: firebase.storage().ref(),
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref('users'),
        metadata: {
            contentType: 'image/jpeg'
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({ user: nextProps.currentUser });
    // }

    openModal = () => this.setState({ modal: true });
    closeModal = () => this.setState({ modal: false });

    dropdownOptions = () => [{
        key: 'user',
        text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
        disabled: true
    },
    {
        key: 'avatar',
        text: <span onClick={this.openModal}>Change Avatar</span>
    },
    {
        key: 'signout',
        text: <span onClick={this.handleSignout}>Sign Out</span>
    }
    ]


    uploadCroppedImage = () => {
        const { storageRef, metadata, userRef, blob } = this.state
        storageRef
            .child(`avatars/users/${userRef.uid}`)
            .put(blob, metadata)
            .then(snap => {
                snap.ref.getDownloadURL().then(downloadURL => {
                    this.setState({ uploadedCroppedImage: downloadURL },
                        () => this.changeAvatar());
                })
            })
    }

    changeAvatar = () => {
        this.state.userRef
            .updateProfile({
                photoURL: this.state.uploadedCroppedImage
            })
            .then(() => {
                console.log('Photourl uploaded');
                this.closeModal()
            })
            .catch(err => {
                console.error(err)
            })
        this.state.usersRef
            .child(this.state.user.uid)
            .update({ avatar: this.state.uploadedCroppedImage })
            .then(() => {
                console.log('user avatar uploaded');
            }).catch((err) => {
                console.error(err);
            });
    }



    handleChange = event => {
        const file = event.target.files[0]
        const reader = new FileReader()

        if (file) {
            reader.readAsDataURL(file)
            reader.addEventListener('load', () => {
                this.setState({ previewImage: reader.result });
            })
        }
    }

    handleCropImage = () => {
        if (this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob)
                this.setState({
                    croppedImage: imageUrl,
                    blob
                });
            })
        }
    }

    handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('Signed out'))
    }

    render() {
        const { user, modal, previewImage, croppedImage } = this.state

        console.log(this.props.currentUser)
        return (
            <Grid style={{ background: this.props.primaryColor }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>

                        <Header inverted floated="left" as="h2">
                            {/* <Icon onClick={this.props.toggle} name="code" /> */}
                            <Header.Content>DevChat</Header.Content>
                        </Header>


                        <Header style={{ padding: '0.25em' }} as="h4" inverted>
                            <Dropdown trigger={
                                <span>
                                    <Image src={user.photoURL} spaced="right" avatar />
                                    {user.displayName}

                                </span>
                            } options={this.dropdownOptions()} />
                        </Header>
                    </Grid.Row>
                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header>Change Avatar</Modal.Header>
                        <Modal.Content>
                            <Input
                                onChange={this.handleChange}
                                fluid
                                type="file"
                                label="New avatar"
                                name="previewImage"
                            />
                            <Grid centered stackable columns={2}>
                                <Grid.Row>
                                    <Grid.Column className="ui center aligned grid">
                                        {previewImage && (
                                            <AvatarEditor
                                                ref={node => (this.avatarEditor = node)}
                                                image={previewImage}
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1.2}
                                            />
                                        )}
                                    </Grid.Column>
                                    <Grid.Column className="ui center aligned grid">
                                        {croppedImage && (
                                            <Image
                                                style={{ margin: '3.5em auto' }}
                                                width={100}
                                                height={100}
                                                src={croppedImage}
                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>

                            </Grid>

                        </Modal.Content>
                        <Modal.Actions>
                            {croppedImage && <Button onClick={this.uploadCroppedImage} color="green" inverted>
                                <Icon name="save" /> Change Avatar
    </Button>}
                            <Button onClick={this.handleCropImage} color="green" inverted>
                                <Icon name="image" /> Preview
    </Button>
                            <Button onClick={this.closeModal} color="red" inverted>
                                <Icon name="remove" /> Cancel
    </Button>
                        </Modal.Actions>
                    </Modal>
                </Grid.Column>
            </Grid>
        );
    }
}


const mapStateToProps = state => ({
    currentUser: state.user.currentUser

})

export default connect(mapStateToProps)(UserPanel);