import { createBrowserHistory } from "history";
import React, { Component }from 'react';
import {Link, withRouter} from 'react-router-dom'; // withRouter proporciona acceso al historial
//import firebase from '../../firebase'
import './login.css'
import axios from 'axios';
import Cookies from 'universal-cookie'; 
const cookies = new Cookies();




// API del login

export const API_PROTOCOL = 'https';
export const API_DOMAIN = '://superheroapi.com/api/';
export const API_ACCESS_TOKEN = '4280760198639854';

export const API_FULL_DOMAIN = `${API_PROTOCOL}${API_DOMAIN}${API_ACCESS_TOKEN}`;

export const API_AUTH_DOMAIN = 'http://challenge-react.alkemy.org';



class Login extends Component{
    state={
        form:{
            email:'',
            password:''
        }
    }

    handleChange = async e => {
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    iniciarSesion = async(e) =>{
        e.preventDefault();

        const payload = {email: this.state.form.email, password: this.state.form.password};
        console.log(this.state.form);
        await axios.post(API_AUTH_DOMAIN, payload)
        .then(response => {
            console.log(response);
            return response.data;
        })
        .then (response=>{
            console.log('response', response);
            localStorage.setItem('token', response.token);
            window.location.href='./welcome';
        })
        .catch(error => {
            alert('el usuario no es correcto');
            console.log(error.response);
        })
        
        
    } 

    
    componentDidMount() {
        if(cookies.get('welcome')) {
            window.location.href='./welcome';
        }
    }
    

    render(){
        return(
            <div>
                <form onSubmit={this.iniciarSesion} id="login">
                    <label>Email:</label><br/>
                    <input 
                        type="email" 
                        name='email'
                        autoComplete="off" 
                        autoFocus 
                        value={this.state.email}
                        onChange={this.handleChange} 
                        placeholder="name@example.com"
                    /><br/>
                    <label>Password:</label><br/>
                    <input 
                        type="password" 
                        name='password'
                        autoComplete="off" 
                        value={this.state.password}
                        onChange={this.handleChange} 
                        placeholder="escribe tu contraseña"
                    /><br/>
                    <button type='submit'>Iniciar Sesion</button>

                    <Link to="/Register">todavia no tienes una cuenta?</Link>
                </form>
               
            </div>
        )
    }
}

export default withRouter(Login);