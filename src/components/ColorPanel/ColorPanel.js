import React, { Component } from 'react'
import { Sidebar, Segment, Menu, Divider, Button, Modal, Icon, Label } from 'semantic-ui-react'
import { CirclePicker } from 'react-color'
import firebase from '../../firebase'
import { connect } from 'react-redux'
import {setColors} from '../../actions'

class ColorPanel extends Component {
    state = {
        modal: false,
        primary: '',
        secondary: '',
        usersRef: firebase.database().ref('users'),
        user: this.props.currentUser,
        userColors: []
    }

    componentDidMount() {
        if (this.state.user) {
            this.addListener(this.state.user.uid)
        }
    }

    componentWillUnmount() {
        this.removeListener()
    }

    removeListener = () => {
        this.state.usersRef.child(`${this.state.user.uid}/color`).off()
    }

    addListener = userId => {
        let userColors = []
        this.state.usersRef.child(`${userId}/color`).on("child_added", snap => {
            userColors.unshift(snap.val())
            this.setState({ userColors })
        })
    }

    displayUserColors = colors =>
        colors.length > 0 &&
        colors.map((color, i) => (
            <React.Fragment key={i}>
                <Divider />
                <div
                    className="color__container"
                    onClick={() => this.props.setColors(color.primary, color.secondary)}
                >
                    <div className="color__square" style={{ background: color.primary }}>
                        <div
                            className="color__overlay"
                            style={{ background: color.secondary }}
                        />
                    </div>
                </div>
            </React.Fragment>
        ))

    openModal = () => this.setState({ modal: true })
    closeModal = () => this.setState({ modal: false })

    handleChangePrimary = color => this.setState({ primary: color.hex })
    handleChangeSecondary = color => this.setState({ secondary: color.hex })

    handleSaveColors = () => {
        if (this.state.primary && this.state.secondary) {
            this.saveColors(this.state.primary, this.state.secondary)
        }
    }

    saveColors = (primary, secondary) => {
        this.state.usersRef
            .child(`${this.state.user.uid}/color`)
            .push()
            .update({
                primary, secondary
            })
            .then(() => {
                console.log('Colors added')
                this.closeModal()
            }).catch(err => console.error(err))
    }

    render() {
        const { modal, primary, secondary, userColors } = this.state
        return (
            <Sidebar
                as={Menu}
                icon="labeled"
                inverted
                vertical
                visible
                width="very thin">
                <Divider />

                <Button onClick={this.openModal} icon="add" size="small" color="blue" />
                {this.displayUserColors(userColors)}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Choose app colors</Modal.Header>
                    <Modal.Content>
                        <Segment inverted>
                            <Label content="Primary Color" />
                            <CirclePicker color={primary} onChange={this.handleChangePrimary} />
                        </Segment >
                        <Segment inverted>
                            <Label content="Secondary Color" />
                            <CirclePicker color={secondary} onChange={this.handleChangeSecondary} />
                        </Segment>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleSaveColors} color="green" inverted>
                            <Icon name="checkmark" /> Save Colors
    </Button>
                        <Button onClick={this.closeModal} color="red" inverted>
                            <Icon name="remove" /> Cancel
    </Button>
                    </Modal.Actions>
                </Modal>
            </Sidebar>
        )
    }
}

export default connect(null, {setColors})(ColorPanel)