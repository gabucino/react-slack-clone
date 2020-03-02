import React, { Component } from 'react';
import { Segment, Accordion, Responsive, Header, Icon, Image, List, Dimmer, Loader } from 'semantic-ui-react'
import firebase from '../../firebase'

class MetaPanel extends Component {
    state = {
        channel: this.props.currentChannel,
        privateChannel: this.props.isPrivateChannel,
        activeIndex: 0,
        usersRef: firebase.database().ref('users'),
        creatorAvatar: 'null',
        creatorName: '',
        loading: false
    }

    componentDidMount() {
        this.getCreatorData()
    }

    getCreatorData = () => {
        if (this.state.channel !== null && this.state.channel.createdBy !== undefined) {
            this.setState({ loading: true });
            this.state.usersRef
                .child(this.state.channel.createdBy)
                .once('value')
                .then(data => {
                    if (data.val() !== null) {
                        console.log(data.val())
                        this.setState({ creatorAvatar: data.val().avatar, creatorName: data.val().name });
                        this.setState({ loading: false });
                    }

                }).catch(err => {
                    console.error(err);
                    this.setState({ loading: false });

                })
        }
    }

    displaySpinner = () => {
        if (this.state.loading) {
            return (
                <Dimmer active>
                    <Loader />
                </Dimmer>
            )
        }
    }


    displayCreatorData = (name, avatar) => {
        if (name && avatar) {
            const creatorData = (
                <Header as="h3">
                    <Image circular src={avatar && avatar} />
                    {name && name}
                </Header>
            )
            return creatorData
        } else {
            return
        }
    }

    setActiveIndex = (event, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    };



    formatCount = num => (num > 1 || num === 0 ? `${num} posts` : `${num} post`)

    displayTopPosters = posts =>

        Object.entries(posts)
            .sort((a, b) => b[1] - a[1])
            .map(([key, val], i) => (
                <List.Item key={i}>
                    <Image avatar src={val.avatar} />
                    <List.Content>
                        <List.Header as="a">{key}</List.Header>
                        <List.Description>{this.formatCount(val.count)}</List.Description>
                    </List.Content>
                </List.Item>
            ))
            .slice(0, 5)

    render() {
        const { activeIndex, privateChannel, channel, creatorAvatar, creatorName } = this.state
        const { userPosts } = this.props

        if (privateChannel) return null

        return (
            <Responsive as={Segment} minWidth={768}>
                <Header as="h3" attached="top">
                    About # {channel && channel.name}
                </Header>
                <Accordion styled attached="true">
                    <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name="dropdown" />
                        <Icon name="info" />
                        Channel Details
              </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        {channel && channel.details}
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name="dropdown" />
                        <Icon name="user circle" />
                        Top Posters
              </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <List>{userPosts && this.displayTopPosters(userPosts)}</List>
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 2}
                        index={2}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name="dropdown" />
                        <Icon name="pencil alternate" />
                        Created By
              </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        {this.displaySpinner}
                        {this.displayCreatorData(creatorName, creatorAvatar)}
                    </Accordion.Content>
                </Accordion>
</Responsive>
        )
    }
}

export default MetaPanel;