import styles from './index.scss';
import React from 'react';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Avatar from 'material-ui/Avatar';
import {Tabs, Tab} from 'material-ui/Tabs';
import config from 'config';


const horseURL = config.horseURL;


class UserChooser extends React.Component {
    render () {
        const items = this.props.users.map((user) => (
            <MenuItem key={user.pk} value={user.pk} primaryText={user.name} />
        ))

        return (
            <SelectField
                floatingLabelText="Become a user"
                value={this.props.user && this.props.user.pk}
                onChange={this.props.onChange}>
                {items}
            </SelectField>
        );
    }
}


class MovieList extends React.Component {
    render () {
        const movies = this.props.movies.map((movie) => {
            const liked = Boolean(
                this.props.liked.find((liked) => liked.pk === movie.pk));
            const onClick = () => this.props.onMovieLiked(movie);
            const likes = (<Avatar>{movie.likes}</Avatar>);

            return (<ListItem
                key={movie.pk}
                onClick={onClick}
                primaryText={movie.title}
                leftIcon={liked && <ActionFavorite /> || <ActionFavoriteBorder/>}
                rightAvatar={likes}
            />)})

        return (
            <List>
                <Subheader>{this.props.header}</Subheader>
                {movies}
            </List>
        )
    }
}


class UserList extends React.Component {
    render () {
        const users = this.props.users.map((user) => {
            const followed = Boolean(
                this.props.followed.find((followed) => followed.pk === user.pk));

            return (<ListItem
                        key={user.pk}
                        onClick={() => alert(user.name)}
                        primaryText={user.name}
                        leftIcon={followed && <ActionFavorite /> || <ActionFavoriteBorder/>}
                    />)})

        return (
            <List>
                <Subheader>Users</Subheader>
                {users}
            </List>
        )
    }
}


class UserView extends React.Component {
    render () {
        if (!this.props.user) {
            return (<div>Please select user</div>);
        }
        return (
            <Tabs>
                <Tab label="Movie list" >
                    <MovieList
                        header="All Movies"
                        liked={this.props.user.liked_movies}
                        movies={this.props.movies}
                        onMovieLiked={this.props.onMovieLiked}
                    />
                </Tab>
                <Tab label="User list">
                    <UserList
                        followed={this.props.user.followed_users}
                        users={this.props.users}
                    />
                </Tab>
                <Tab label="Recommendations">
                    <MovieList
                        header="Recommendations"
                        liked={this.props.user.liked_movies}
                        movies={this.props.recommendations}
                    />
                </Tab>
            </Tabs>
        )
    }
}


export default class App extends React.Component {
    state = {
        user: null,
        users: [],
        movies: [],
        recommendations: []
    }

    reloadUserData() {
        this.loadMovies()
        this.loadRecommendations()
        this.loadUser()
    }

    loadRecommendations() {
        fetch(`${horseURL}users/${this.state.user.pk}/recommendations`).then(
            (response) => response.json()
        ).then((data) => {
            this.setState({
                recommendations: data.items
            })
        })
    }

    onMovieLiked(movie) {
        fetch(`${horseURL}users/${this.state.user.pk}/liked_movies`,{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'pk': movie.pk})

        }).then((response) => this.reloadUserData())
    }

    loadMovies() {
        fetch(horseURL + 'movies').then((response) =>
            response.json()
        ).then((data) => {
            this.setState({
                movies: data.items
            })
        })
    }

    loadUser() {
        fetch(`${horseURL}users/${this.state.user.pk}`).then((response) =>
            response.json()
        ).then((data) => {
            this.setState({
                user: data
            })
        })
    }

    componentDidMount() {
        fetch(horseURL + 'users').then((response) =>
            response.json()
        ).then((data) => {
            this.setState({
                users: data.items
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.user &&
                this.state.user.pk != (prevState.user && prevState.user.pk)) {
            this.reloadUserData()
        }
    }

    onUserSelected(event, index, value) {
        const user = this.state.users.find((user) => user.pk === value)
        this.setState({'user': user})
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <h1>HORSe</h1>
                    <UserChooser
                        user={this.state.user}
                        users={this.state.users}
                        onChange={this.onUserSelected.bind(this)}/>
                    <UserView
                        user={this.state.user}
                        users={this.state.users}
                        movies={this.state.movies}
                        recommendations={this.state.recommendations}
                        onMovieLiked={this.onMovieLiked.bind(this)}
                    />
                </div>
            </MuiThemeProvider>
        )
    }
}
