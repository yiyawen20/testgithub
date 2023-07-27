import React, { Component } from 'react';
import "./static/css/button.css"

class Button extends Component{
    render(){
        return <button className={"btn_" + this.props.color}>危险按钮</button>;
    }
}

export default Button;