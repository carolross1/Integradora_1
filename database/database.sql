

DROP DATABASE ng_punto_de_venta;

CREATE DATABASE ng_punto_de_venta;
USE ng_punto_de_venta; 


-- Crea la tabla Categoria 
CREATE TABLE `categoria` (
  `id_Categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_Categoria`),
  UNIQUE KEY `unique_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crea la tabla Producto 
CREATE TABLE `producto` (
  `id_Producto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL UNIQUE,
  `id_Categoria` int(11) NOT NULL,
  `precio_Compra` decimal(10,2) NOT NULL,
  `precio_Venta` decimal(10,2) NOT NULL,
  `utilidad` decimal(10,2) GENERATED ALWAYS AS (`precio_Venta` - `precio_Compra`) STORED,
  `cantidad_Stock` int(11) NOT NULL,
  `cant_Minima` int(11) NOT NULL,
  `codigo_Barras` int(11) NOT NULL UNIQUE,
  PRIMARY KEY (`id_Producto`),
  UNIQUE KEY `codigo_barras` (`codigo_Barras`),
  KEY `fk_categoria` (`id_Categoria`),
  CONSTRAINT `fk_categoria` FOREIGN KEY (`id_Categoria`) REFERENCES `categoria` (`id_Categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estructura de tabla para la tabla `usuario`

 CREATE TABLE `usuario` (
  `id_Usuario` varchar(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `telefono` varchar(13) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `tipo_Usuario` varchar(50) NOT NULL,
  `salt` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_Usuario`),
  UNIQUE KEY `telefono` (`telefono`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci |



DELIMITER //

CREATE FUNCTION HashPasswordConSalt(password VARCHAR(60), salt VARCHAR(100))
RETURNS CHAR(64)
BEGIN
    DECLARE hash CHAR(64);
    SET hash = SHA2(CONCAT(password, salt), 256);
    RETURN hash;
END //

DELIMITER ;


DELIMITER //

CREATE TRIGGER trg_PasswwdIn
AFTER INSERT ON usuario
FOR EACH ROW
BEGIN
    DECLARE generatedSalt VARCHAR(100);
    
    -- Generar salt
    SET generatedSalt = UUID();

    -- Actualizar usuario con salt y hashed password
    UPDATE usuario
    SET 
        salt = generatedSalt,
        contrasena = HashPasswordConSalt(NEW.contrasena, generatedSalt)
    WHERE id_Usuario = NEW.id_Usuario;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER trg_PasswwdIn
AFTER INSERT ON usuario
FOR EACH ROW
BEGIN
    DECLARE generatedSalt VARCHAR(100);
    
    -- Generar salt
    SET generatedSalt = UUID();

    -- Actualizar usuario con salt y hashed password
    UPDATE usuario
    SET 
        salt = generatedSalt,
        contrasena = HashPasswordConSalt(contrasena, generatedSalt)
    WHERE id_Usuario = NEW.id_Usuario;
END //

DELIMITER ;


----Trigger para Actualizar Contraseña 
DELIMITER //

CREATE TRIGGER trg_PasswordUpadate
BEFORE UPDATE ON usuario
FOR EACH ROW
BEGIN
    -- Verificar si la nueva contraseña es diferente a la antigua
    IF NEW.contrasena != OLD.contrasena THEN
        
        -- Asignar un nuevo salt y hashear la nueva contraseña directamente
        SET NEW.salt = UUID();
        SET NEW.contrasena = HashPasswordConSalt(NEW.contrasena, NEW.salt);
        
    END IF;
END //

DELIMITER ;




-- Estructura de tabla para la tabla `corte_caja`
CREATE TABLE `corte_caja` (
  `id_Corte` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora_Inicio` time NOT NULL,
  `hora_Fin` time DEFAULT NULL,
  `saldo_Inicial` decimal(10,2) NOT NULL,
  `ingresos` decimal(10,2) DEFAULT 0.00,
  `egresos` decimal(10,2) DEFAULT 0.00,
  `saldo_Final` decimal(10,2) DEFAULT NULL,
  `id_Usuario` varchar(100) DEFAULT NULL,
  `cerrado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_Corte`),
  KEY `id_Usuario` (`id_Usuario`),
  CONSTRAINT `corte_caja_ibfk_1` FOREIGN KEY (`id_Usuario`) REFERENCES `usuario` (`id_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Estructura de tabla para la tabla `venta`
CREATE TABLE `venta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_Venta` varchar(8) NOT NULL,
  `id_Usuario` varchar(10) NOT NULL,
  `fecha` datetime NOT NULL,
  `metodo_Pago` varchar(50) NOT NULL,
  `caja` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_Venta` (`id_Venta`),
  KEY `id_Usuario` (`id_Usuario`),
  CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`id_Usuario`) REFERENCES `usuario` (`id_Usuario`)      
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `detalle_venta`
CREATE TABLE `detalle_venta` (
  `id_Detalle` int(11) NOT NULL AUTO_INCREMENT,
  `id_Venta` varchar(8) NOT NULL,
  `id_Producto` int(11) NOT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `total_venta` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_Detalle`),
  KEY `id_Producto` (`id_Producto`),
  KEY `detalle_venta_ibfk_1` (`id_Venta`),
  CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`id_Venta`) REFERENCES `venta` (`id_Venta`) ON DELETE CASCADE,
  CONSTRAINT `detalle_venta_ibfk_2` FOREIGN KEY (`id_Producto`) REFERENCES `producto` (`id_Producto`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id_Factura` int(11) NOT NULL AUTO_INCREMENT,
  `id_Venta` varchar(8) NOT NULL UNIQUE,
  `RFC` varchar(13) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `municipio` varchar(50) NOT NULL,
  `codigo_Postal` varchar(5) NOT NULL,
  `direccion` text NOT NULL,
  `fecha_Factura` datetime NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_Factura`),
  CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`id_Venta`) REFERENCES `venta` (`id_Venta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear la tabla `Inventario`  
 inventario | CREATE TABLE `inventario` (
  `id_Inventario` int(11) NOT NULL AUTO_INCREMENT,
  `id_Usuario` varchar(10) NOT NULL,
  `Fecha_Inicio` datetime NOT NULL,
  `Fecha_Termino` datetime NOT NULL,
  PRIMARY KEY (`id_Inventario`),
  KEY `id_Usuario` (`id_Usuario`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_Usuario`) REFERENCES `usuario` (`id_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci |

-- Crear la tabla `Detalle_Inventario`
CREATE TABLE `detalle_inventario` (
  `id_Inventario` INT NOT NULL,
  `id_Producto` INT NOT NULL,
  `cantidad_Fisica` INT NOT NULL,
  FOREIGN KEY (`id_Inventario`) REFERENCES `Inventario`(`id_Inventario`),
  FOREIGN KEY (`id_Producto`) REFERENCES `producto`(`id_Producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `proveedor` (
  `id_Proveedor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `email`     varchar(100) NOT NULL UNIQUE,
  `empresa` varchar(100) NOT NULL,
  PRIMARY KEY (`id_Proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--Edita el campo email para que sea UNIQUE
ALTER TABLE proveedor
ADD UNIQUE (email);


-- Tabla entrega_producto
CREATE TABLE entrega_producto (
    id_Entrega INT AUTO_INCREMENT PRIMARY KEY,
    id_Usuario VARCHAR(10) NOT NULL,
    id_Proveedor INT NOT NULL,
    fecha DATETIME NOT NULL,
    id_Factura INT,
    FOREIGN KEY (id_Usuario) REFERENCES usuario(id_Usuario),
    FOREIGN KEY (id_Proveedor) REFERENCES proveedor(id_Proveedor)
);


-- Tabla detalle_entrega
CREATE TABLE detalle_entrega (
    id_Entrega INT,
    id_Producto INT NOT NULL,
    cantidad INT NOT NULL,
    total_entrega DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_Entrega, id_Producto),
    FOREIGN KEY (id_Entrega) REFERENCES entrega_producto(id_Entrega),
    FOREIGN KEY (id_Producto) REFERENCES producto(id_Producto)
);

-- Tabla pedido_digital 
CREATE TABLE pedido_digital (
    id_Pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_Proveedor INT NOT NULL,
    fecha_Pedido DATETIME NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_Proveedor) REFERENCES proveedor(id_Proveedor)
);

-- Tabla detalle_pedido_digital
CREATE TABLE detalle_pedido_digital (
    id_Pedido INT NOT NULL,
    id_Producto INT NOT NULL,
    cantidad INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id_Pedido, id_Producto),
    FOREIGN KEY (id_Pedido) REFERENCES pedido_digital(id_Pedido),
    FOREIGN KEY (id_Producto) REFERENCES producto(id_Producto)
);

------------------------- probaremos con esto 

DELIMITER //

CREATE TRIGGER trg_AjusteStockDetalleVenta
AFTER UPDATE ON detalle_venta
FOR EACH ROW
BEGIN
    -- Ajuste del stock en caso de actualización
    UPDATE producto
    SET cantidad_Stock = cantidad_Stock + (OLD.cantidad - NEW.cantidad)
    WHERE producto.id_Producto = NEW.id_Producto;
END//

DELIMITER ;
------segundo

DELIMITER //

CREATE TRIGGER trg_AjusteStockDetalleVentaDelete
AFTER DELETE ON detalle_venta
FOR EACH ROW
BEGIN
    -- Ajuste del stock en caso de eliminación
    UPDATE producto
    SET cantidad_Stock = cantidad_Stock + OLD.cantidad
    WHERE producto.id_Producto = OLD.id_Producto;
END//

DELIMITER ;

---tercero
DELIMITER //



CREATE PROCEDURE proc_ActualizarDetalleVenta (
    IN p_id_Detalle INT,
    IN p_cantidad INT,
    IN p_id_Producto INT,
    IN p_descuento DECIMAL(10, 2)
)
BEGIN
    DECLARE p_precio_Venta DECIMAL(10, 2);
    DECLARE p_total_venta DECIMAL(10, 2);

    -- Actualiza el detalle de la venta
    UPDATE detalle_venta
    SET cantidad = p_cantidad, id_Producto = p_id_Producto, descuento = p_descuento
    WHERE id_Detalle = p_id_Detalle;

    -- Obtiene el precio del producto
    SELECT precio_Venta INTO p_precio_Venta
    FROM producto
    WHERE id_Producto = p_id_Producto;

    -- Calcula el total de venta
    SET p_total_venta = p_cantidad * p_precio_Venta;

    -- Actualiza el total de venta en detalle_venta
    UPDATE detalle_venta
    SET total_venta = p_total_venta
    WHERE id_Detalle = p_id_Detalle;
END//

DELIMITER ;
--Trigger para actualizar el stcok de productos tomando en cuenta el detalle_Entrega
DELIMITER //

CREATE TRIGGER trg_AjusteStockDetalleEntregaInsert
AFTER INSERT ON detalle_entrega
FOR EACH ROW
BEGIN
    -- Ajuste del stock en caso de inserción
    UPDATE producto
    SET cantidad_Stock = cantidad_Stock + NEW.cantidad
    WHERE producto.id_Producto = NEW.id_Producto;
END//

DELIMITER ;
