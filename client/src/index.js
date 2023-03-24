import React from "react";
import ReactDOM from "react-dom";
import {App} from '../src/App';
import * as ReactDOMClient from 'react-dom/client';


const el = document.getElementById("app");

const container = document.getElementById('app');


const root = ReactDOMClient.createRoot(container);

root.render(<App/>);


// ReactDOM.render(<App />, el);