import styles from './index.scss';
import React from 'react';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';


const horseURL = 'http://localhost:5000/';


class UserChooser extends React.Component {
    render () {
        const items = this.props.users.map((user) => (
            <MenuItem value={user.pk} primaryText={user.name} />
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


export default class App extends React.Component {
    state = {
        user: null,
        users: []
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

    onUserSelected(event, index, value) {
        const user = this.state.users.find((user) => user.pk === value)
        this.setState({
            'user': user
        })
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
                </div>
            </MuiThemeProvider>
        )
    }
}
