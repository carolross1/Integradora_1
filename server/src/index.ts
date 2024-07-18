import express,{Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cortecajaRoutes from './routes/cortecajaRoutes';
import indexRoutes from './routes/indexRoutes';
import productoRoutes from './routes/productoRoutes'; 

class Server{
public app:Application;
 
constructor(){
       this.app=express();
       this.config(); 
       this.routes();
    }

    //Métodos en TypeScrip
    config():void{
        this.app.set('port',process.env.PORT ||3000)
       this.app.use(morgan('dev'));
        this.app.use(cors()); 
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));
    }
    routes():void{
        this.app.use('/',indexRoutes);
        this.app.use('/api/cortecaja',cortecajaRoutes);
        this.app.use('/api/productos', productoRoutes);
    }
    start():void{
        this.app.listen(this.app.get('port'),()=>{
            console.log('Server on port',this.app.get('port'));
        })
    }

    }
const server=new Server();
server.start(); 