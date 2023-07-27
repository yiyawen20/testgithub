import React, { Component } from "react";
import Button from "./Button";
import a1 from "./static/images/a1.png";

class DangerButton extends Component{
    render(){
        return <div>
                <img src={a1} alt="a1" />
                <Button color="red" />
            </div>
    }
}

export default DangerButton;