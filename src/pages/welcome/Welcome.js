import React, { Component }from 'react';
import { Form, Col, Button, Container, Row, Card} from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner'
import {Link} from 'react-router-dom';

//import './welcome.css';
import firebase from '../../firebase'
import { PageActions } from './WelcomoStyles'

class Welcome extends Component{
    componentDidMount() {
      if(!localStorage.getItem('token')) {
          window.location.href='./login';
      };
    }                                                                                                                                                               

    constructor(props){
        super(props);
        this.state = {
            allHerois: [],
            searchText:'',
            begin:1,
            idHeroi:'',
            favoritos:[],
            buttonPesquisar:true,
            color:'',
            page:1,
            teste:'',
            loading:false,
        }
        this.listAllHeroes = this.listAllHeroes.bind(this);
        this.searchSuperHeroes = this.searchSuperHeroes.bind(this);
        this.addFavoritos = this.addFavoritos.bind(this);
        this.mudarPagina = this.mudarPagina.bind(this);
    }

    
    

    
    componentDidMount(){
      if(!firebase.getCurrent()){
        alert('Bienvenidos');
        // this.props.history.replace('/');
      }

      firebase.getUserName((info)=>{
          localStorage.nome = info.val().nome;
          this.setState({name: localStorage.nome});
      })

      if(this.state.begin){
        this.listAllHeroes();
      }
      console.log('favoritos',localStorage.getItem('favoritos'));

      let themeGet = JSON.parse(localStorage.getItem('tema'));

      if(themeGet===false){
        this.setState({color:'#fff'})
      } else{
        this.setState({color:'#800404'})
      }
    }
   
    mudarPagina=(e)=>{
      let page1 = this.state.page;
      if(e === 'back'){page1 =  page1 - 1 }else{page1= page1 + 1} ;
      this.listAllHeroes(page1);
    }

    listAllHeroes = async(e) => {
        this.setState({loading:true});
        let listHeroes = [];
        let page1=1;
        let total=1;
        
        if(e>=1){
          page1=e;
           total = page1*12;
        }else{total=12}

        console.log('page12:',e);
        console.log('total',total);
        
        for(let i = total-11; i <= total; i++){
          const response = await fetch(`https://www.superheroapi.com/api.php/4280760198639854/${i}`);
          const data = await response.json();
          listHeroes = [...listHeroes, {
            id: data.id,
            name: data.name,
            powerstats: data.powerstats,
            biography: data.biography,
            appearance: data.appearance,
            work: data.work,
            connections: data.connections,
            image:data.image
          }];
        }            
        this.setState({allHerois:listHeroes, searchText:'', buttonPesquisar: true, page:page1, loading:false});
        console.log('page:',this.state.page);
        console.log(listHeroes);
      }

      searchSuperHeroes = async() => {
        this.setState({loading:true});
        const response = await fetch(`https://www.superheroapi.com/api.php/4280760198639854/search/${this.state.searchText}`);
        const data = await response.json();
        this.setState({begin:0});
        this.setState({allHerois:data.results, buttonPesquisar:false, page:1, loading:false});
      }
      
      addFavoritos =async(e) => {
        console.log('e', e);
        try{
          if(e){
            await firebase.addFavorite(e);
            alert("agregado a Favoritos");
          }
        }catch(error){
          alert(error.message);
        }
      }
    

    render(){

        return (
          !this.state.loading ? (
          <Container >
            <div className='busca'>
              <Form>
                <Form.Row className="align-items-center">
                  <Col sm={3} className="my-1"  style={{ paddingTop:'20px', paddingBottom: '20px' }}>
                    <input id="search-bar" className="form-control" type="text" value={this.state.searchText} 
                      onChange={(e) => this.setState({searchText: e.target.value})} placeholder="busca tu super-heroe"/>
                  </Col>
                  <Col xs="auto" className="my-1" style={{ paddingTop:'20px', paddingBottom: '20px' }}>
                    {this.state.buttonPesquisar ?
                    <Button onClick={this.searchSuperHeroes}
                     style={{backgroundColor: '#2b2c2d',borderColor:'#2b2c2d', boxShadow:'none' }}>Buscar</Button>
                    :
                    <Button onClick={this.listAllHeroes}
                    style={{backgroundColor: '#2b2c2d',borderColor:'#2b2c2d', boxShadow:'none' }}>Limpiar Busqueda</Button>
                    }
                  </Col>
                </Form.Row>
              </Form>
            </div>
            <div className='principal'>
              <Row>
                {this.state.allHerois.map(item =>(
                  <Col>
                    <Card style={{ width: '18rem', border:'transparent', background:'transparent' }}>
                      <Card.Title style={{ textAlign: 'center',marginTop: '.5rem',  color: '#f70606' }}>{item.name}</Card.Title>
                      <Link to={`/HeroDetails/${item.id}`}>
                      <Card.Img variant="top" src={item.image.url} alt={item.name}  
                      style={{marginTop: '-0.8rem', marginBottom: '-1.8rem'}} />
                      </Link>
                      
                      <Card.Body>
                        <Button variant="primary" onClick={(e)=> this.addFavoritos(item.id)}
                        style={{marginLeft: '-.7rem', backgroundColor: '#2b2c2d',borderColor:'#2b2c2d', boxShadow:'none'}}>
                          Añadir a los favoritos
                          </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
            {this.state.buttonPesquisar ?
              <PageActions>
                <button 
                type="button" 
                onClick={()=> this.mudarPagina('back')  }
                disabled={this.state.page < 2}
                >
                  Página Anterior
                </button>
                
                <button 
                type="button" 
                onClick={()=> this.mudarPagina('next') }
                >
                  Proxima Página
                </button>
              </PageActions>
            :console.log()
            }
          </Container>
          ): (
          <div
            style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40px",
            width: "100%",
            marginTop: "30px",
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            }}>
            <Spinner animation="border" role="status" variant='danger'>
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
         )
        );
    }
}

export default Welcome;
