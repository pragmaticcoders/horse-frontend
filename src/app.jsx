import styles from './index.scss';
import React from 'react';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


export default class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <h1>HORSe</h1>
            </MuiThemeProvider>
        )
    }
}
