### Ver abajo ARANCAR APLICACION
### Configurar Karma
- Xa crear carpeta covarage automaticamente
  ir angular.json -> "test" anadir "codeCoverage": true,
- Xa cambiar puerto (port) o autoWatch: true o restartOnFileChange: true
  ir karma.config.js
### Carpeta coverage (index.html) -> % de codigo testeado
### Lanzar Test
- >ng test
- >ng test --no-watch (Jasmine en el navegador solo se ejecuta una vez)
- >ng test --no-watch --code-coverage (ejecuta carpeta coverage)
- Scripts personalizados -> package.json "scripts" anadir 
  "test-coverage": "ng test --code-coverage",
  >npm run test-coverage

### Instalar JSON Server xa simular que tenemos un backend (Fake API)
- archivo db.json
- archivo enviroments.ts ->  API_REST_URL: 'http://localhost:3000', apunta a localhost en el puerto 3000
- JSON Server va a levantarnos en este puerto esta API simulada
- Cada vez que hagamos una peticion nos devolvera el array que hay en db.json

- ir https://github.com/typicode/json-server

- Install JSON Server
  >npm install -g json-server
- Start JSON Server (IMPORTANT db.json = archivo donde tengo mi base de datos)
  >json-server --watch db.json

### XA ARANCAR APLICACION  
- Primero levantar el API-Backend simulado con JSON Server:
  >json-server --watch db.json
  navegador: http://localhost:3000/book
- Segundo levantar el Frontend:
  >ng serve

### Test sobre COMPONENTE pages/cart (carrito de compra)
# Crear test y configurar TestBed =>
- fixture: variable para extraer de nuestro component el servicio, detectar cambios...
- TestBed: va a tener toda la configuracion del test
- HttpClientTestingModule: xa accesos API (get, post...) o probar componentes con servicios que si lo esten llamando. No hace una peticion real!

# Fallos comunes al configurar TestBed

# ngOnInit() del cart.component llama al servicio
- CUIDADO este metodo ngOnInit(), llama al servicio !!! Rompemos el test unitario !!!
- Solucion -> en beforEach crear un espia

# Test a un metodo CON return getTotalPrice()
# Test a un metodo SIN return onInputNumberChange() -> uso del spyOn
- Los espias estan atentos a que un metodo/s dentro del metodo han sido llamados
- Un test unitario no debe de llamar a otro metodo o metodo en un servicio !!!
# Test a un metodo PRIVADOS
- OP1: Correcto: Probando el metodo publico que llame a este metodo privado. No debe ser probado directamente
- Usar un espia 1, para comprobar que el metodo privado ha sido llamado
- CUIDADO este metodo publico, llama a un metodo privado que llama un servicio !!! Rompemos el test unitario !!! -> solucion: crear un spia 2 al metodo removeBooksFromCart()
- OP2: NO Correcto: Testear el metodo privado directamente

### Test a un metodo que dentro tiene una SUBSCRIPCION [subscribe - Observable]
# Test sobre componente pages/home (inicio)

# Mock de un Servicio o Servicio Mock
- Servicio Mock: xa un servicio con muchos metodos o dependencias que utilices sus propios servicios -> creo un Servicio Mock que tenga todos los metodos simulados

### xit, fit, xdescribe, fdescribe
- xit: no se ejecuta ese test/s
- xdescribe: no se ejecuta ese describe/s
- fit: solo se ejecuta ese test/s (mas rapido)
- fdescribe: solo se ejecuta ese describe/s (mas rapido)

### beforeEach, beforeAll, afterEach, afterAll
- beforeEach: se va a llamar al principio de cada test
- beforeAll: solo se va a llamar al principio del todo
- afterEach: se va a llamar despues de cada test
- afterAll: solo se va a llamar al final del todo, cuando han terminado todos los test

### Depurar en KARMA, por consola los test unitarios
- debugger;

### Test a un componente que tiene un PIPE (reduce-text/reduce-text.pipe.ts)
- Con pipe los test fallan!
- ir home.spec.ts -> Crear un pipe Mock (simular un pipe) y lo declaro en los declarations
# Test a archivo PIPE reduce-text.pipe.ts
- ir reduce-text.pipe.spec.ts

### Test a un SERVICIO con peticiones a una API
- ir book.service.spec.ts
- uso del afterEach -> xa servicios que realizan peticiones a API
# Test a un SERVICIO que guarda en el LocalStorage
- simular un LocalStorage -> crear un espia xa similar el localStorage

### Alternativa para instanciar un componente o servicio
- ir cart.spec.ts

### Test de INTEGRACION:
- ir cart.component.html -> tengo un texto condicionado con *ngIf
  <ng-container *ngIf="!listCartBook || listCartBook.length === 0">
  <h5>The cart is empty</h5>
  </ng-container>
- ir cart.spec.ts

### Automatizar test antes de generar el build:
- Para no generar un build que tenga errores
- Si no tenemos integracion continua en nuestro proyecto CI
- Creo comando: si los test han pasado correctamente entonces genera el build
- ir package.json -> scripts: "tbuild": "ng test --no-watch && ng build"
  >npm run tbuild