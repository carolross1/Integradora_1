"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cortecajaRoutes_1 = __importDefault(require("./routes/cortecajaRoutes"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const productoRoutes_1 = __importDefault(require("./routes/productoRoutes"));
const ventasRoutes_1 = __importDefault(require("./routes/ventasRoutes"));
const categoriaRoutes_1 = __importDefault(require("./routes/categoriaRoutes"));
const facturaRoutes_1 = __importDefault(require("./routes/facturaRoutes"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const reportesRoutes_1 = __importDefault(require("./routes/reportesRoutes"));
const proveedores_listRoutes_1 = __importDefault(require("./routes/proveedores-listRoutes"));
const inventarioRoutes_1 = __importDefault(require("./routes/inventarioRoutes"));
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const entregasRoutes_1 = __importDefault(require("./routes/entregasRoutes"));
const pedidosProveedorRoutes_1 = __importDefault(require("./routes/pedidosProveedorRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    //Métodos en TypeScrip
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/', indexRoutes_1.default);
        this.app.use('/api/cortecaja', cortecajaRoutes_1.default);
        this.app.use('/api/productos', productoRoutes_1.default);
        this.app.use('/api/ventas', ventasRoutes_1.default);
        this.app.use('/api/categorias', categoriaRoutes_1.default);
        this.app.use('/api/facturas', facturaRoutes_1.default);
        this.app.use('/api/login', loginRoutes_1.default);
        this.app.use('/api/reportes', reportesRoutes_1.default);
        this.app.use('/api/proveedores', proveedores_listRoutes_1.default);
        this.app.use('/api/inventarios', inventarioRoutes_1.default);
        this.app.use('/api/usuarios', usuarioRoutes_1.default);
        this.app.use('/api/entregas', entregasRoutes_1.default);
        this.app.use('/api/pedidos', pedidosProveedorRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
