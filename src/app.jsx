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


const horseURL = 'http://localhost:5000/';


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

            return (<ListItem
                key={movie.pk}
                onClick={() => alert(movie.title)}
                primaryText={movie.title}
                leftIcon={liked && <ActionFavorite /> || <ActionFavoriteBorder/>}
                rightAvatar={<Avatar>3</Avatar>}
            />)})

        return (
            <List>
                <Subheader>All Movies</Subheader>
                {movies}
            </List>
        )
    }
}


export default class App extends React.Component {
    state = {
        user: null,
        users: [],
        movies: [],
    }

    componentDidMount() {
        fetch(horseURL + 'users').then((response) =>
            response.json()
        ).then((data) => {
            this.setState({
                users: data.items
            })
        })

        fetch(horseURL + 'movies').then((response) =>
            response.json()
        ).then((data) => {
            this.setState({
                movies: data.items
            })
        })
    }

    onUserSelected(event, index, value) {
        const user = this.state.users.find((user) => user.pk === value)
        this.setState({
            'user': user
        })
    }

    render() {
        let userContent = (<div>Please select user</div>);
        if (this.state.user) {
            userContent = (
                <MovieList
                    liked={this.state.user.liked_movies}
                    movies={this.state.movies}
                />)
        }

        return (
            <MuiThemeProvider>
                <div>
                    <h1>HORSe</h1>
                    <UserChooser
                        user={this.state.user}
                        users={this.state.users}
                        onChange={this.onUserSelected.bind(this)}/>
                    {userContent}
                </div>
            </MuiThemeProvider>
        )
    }
}
